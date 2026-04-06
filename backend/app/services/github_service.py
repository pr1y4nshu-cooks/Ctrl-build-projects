import os
import json
import secrets
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
from urllib.parse import urlencode

import requests
from authlib.integrations.httpx_client import AsyncOAuth2Client
from authlib.oauth2 import OAuth2Error

from app.models.github_model import (
    GitHubUser, LinkedRepository, get_github_user, save_github_user,
    get_linked_repos, save_linked_repo, clear_linked_repos, remove_linked_repo
)

# GitHub OAuth configuration
GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID', '')
GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET', '')
GITHUB_OAUTH_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'
GITHUB_OAUTH_TOKEN_URL = 'https://github.com/login/oauth/access_token'
GITHUB_API_USER_URL = 'https://api.github.com/user'
GITHUB_API_REPOS_URL = 'https://api.github.com/user/repos'

# Store OAuth states temporarily (in production, use Redis or database)
oauth_states = {}

class GitHubOAuthController:
    """Controller for GitHub OAuth operations"""

    @staticmethod
    def generate_oauth_url(callback_url: str) -> Tuple[str, str]:
        """Generate GitHub OAuth authorization URL"""
        state = secrets.token_urlsafe(32)
        oauth_states[state] = {
            'created_at': datetime.utcnow(),
            'callback_url': callback_url
        }
        
        params = {
            'client_id': GITHUB_CLIENT_ID,
            'redirect_uri': callback_url,
            'scope': 'repo,read:user',
            'state': state,
            'allow_signup': 'true'
        }
        
        auth_url = f"{GITHUB_OAUTH_AUTHORIZE_URL}?{urlencode(params)}"
        return auth_url, state

    @staticmethod
    def validate_oauth_state(state: str) -> bool:
        """Validate OAuth state parameter"""
        if state not in oauth_states:
            return False
        
        state_data = oauth_states[state]
        created_at = state_data['created_at']
        
        # State valid for 10 minutes
        if datetime.utcnow() - created_at > timedelta(minutes=10):
            del oauth_states[state]
            return False
        
        return True

    @staticmethod
    def exchange_code_for_token(code: str, redirect_uri: str) -> Optional[str]:
        """Exchange authorization code for access token"""
        try:
            response = requests.post(
                GITHUB_OAUTH_TOKEN_URL,
                headers={'Accept': 'application/json'},
                json={
                    'client_id': GITHUB_CLIENT_ID,
                    'client_secret': GITHUB_CLIENT_SECRET,
                    'code': code,
                    'redirect_uri': redirect_uri
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'access_token' in data:
                    return data['access_token']
                if 'error' in data:
                    print(f"GitHub OAuth error: {data.get('error_description')}")
            else:
                print(f"Token exchange failed: {response.status_code}")
                
        except Exception as e:
            print(f"Error exchanging code for token: {str(e)}")
        
        return None

    @staticmethod
    def get_user_info(access_token: str) -> Optional[Dict[str, Any]]:
        """Fetch authenticated user information from GitHub"""
        try:
            response = requests.get(
                GITHUB_API_USER_URL,
                headers={
                    'Authorization': f'token {access_token}',
                    'Accept': 'application/vnd.github.v3+json'
                }
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Failed to get user info: {response.status_code}")
                
        except Exception as e:
            print(f"Error fetching user info: {str(e)}")
        
        return None

    @staticmethod
    def get_user_repositories(access_token: str, per_page: int = 100) -> List[Dict[str, Any]]:
        """Fetch user's repositories"""
        repos = []
        page = 1
        
        try:
            while True:
                response = requests.get(
                    GITHUB_API_REPOS_URL,
                    headers={
                        'Authorization': f'token {access_token}',
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    params={
                        'page': page,
                        'per_page': per_page,
                        'sort': 'updated',
                        'direction': 'desc'
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if not data:
                        break
                    
                    repos.extend(data)
                    page += 1
                    
                    # Limit to 500 repos for performance
                    if len(repos) >= 500:
                        repos = repos[:500]
                        break
                else:
                    print(f"Failed to fetch repos: {response.status_code}")
                    break
                    
        except Exception as e:
            print(f"Error fetching repositories: {str(e)}")
        
        return repos

    @staticmethod
    def format_repo_data(repos: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Format repository data for frontend"""
        formatted_repos = []
        
        for repo in repos:
            formatted_repos.append({
                'id': repo['id'],
                'name': repo['name'],
                'url': repo['html_url'],
                'description': repo.get('description', ''),
                'is_private': repo['private'],
                'stars': repo['stargazers_count'],
                'forks': repo.get('forks_count', 0),
                'language': repo.get('language', ''),
                'updated_at': repo['updated_at'],
                'topics': repo.get('topics', [])
            })
        
        return formatted_repos

    @staticmethod
    def save_user_tokens(user_id: str, github_username: str, access_token: str) -> None:
        """Save GitHub user and access token"""
        github_user = GitHubUser(
            user_id=user_id,
            github_username=github_username,
            access_token=access_token
        )
        save_github_user(github_user)

    @staticmethod
    def save_selected_repos(user_id: str, repo_list: List[Dict[str, Any]]) -> int:
        """Save selected repositories for user"""
        clear_linked_repos(user_id)
        
        count = 0
        for repo in repo_list:
            linked_repo = LinkedRepository(
                user_id=user_id,
                repo_id=repo['id'],
                repo_name=repo['name'],
                repo_url=repo['url'],
                is_private=repo['is_private'],
                stars=repo.get('stars', 0)
            )
            save_linked_repo(linked_repo)
            count += 1
        
        return count

    @staticmethod
    def get_user_linked_repos(user_id: str) -> List[Dict[str, Any]]:
        """Get user's linked repositories"""
        repos = get_linked_repos(user_id)
        
        return [
            {
                'repo_id': r.repo_id,
                'name': r.repo_name,
                'url': r.repo_url,
                'is_private': r.is_private,
                'stars': r.stars,
                'last_updated': r.last_updated.isoformat() if r.last_updated else None
            }
            for r in repos
        ]

    @staticmethod
    def unlink_repository(user_id: str, repo_id: int) -> bool:
        """Remove a linked repository"""
        try:
            remove_linked_repo(user_id, repo_id)
            return True
        except Exception as e:
            print(f"Error unlinking repo: {str(e)}")
            return False

    @staticmethod
    def refresh_repositories(user_id: str, access_token: str) -> List[Dict[str, Any]]:
        """Refresh user's repository list and update saved ones"""
        try:
            repos = GitHubOAuthController.get_user_repositories(access_token)
            formatted = GitHubOAuthController.format_repo_data(repos)
            
            # Update last_updated for existing repos
            existing_repos = get_linked_repos(user_id)
            for existing in existing_repos:
                for repo in formatted:
                    if repo['id'] == existing.repo_id:
                        existing.last_updated = datetime.utcnow()
                        break
            
            return formatted
        except Exception as e:
            print(f"Error refreshing repositories: {str(e)}")
            return []
