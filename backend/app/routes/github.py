from fastapi import APIRouter, Query, HTTPException, Request, Cookie
from typing import List, Dict, Any, Optional
from urllib.parse import urlparse

from app.services.github_service import GitHubOAuthController

router = APIRouter()

# Note: In production, use proper session management or JWT tokens
# For now, we'll use a simple user_id from cookie
@router.get("/auth/github")
async def github_oauth_start(redirect_uri: str = Query(...)):
    """
    Start GitHub OAuth flow
    Returns the authorization URL
    """
    try:
        # Validate redirect URI
        parsed = urlparse(redirect_uri)
        if not parsed.scheme or not parsed.netloc:
            raise HTTPException(status_code=400, detail="Invalid redirect URI")
        
        auth_url, state = GitHubOAuthController.generate_oauth_url(redirect_uri)
        
        return {
            "auth_url": auth_url,
            "state": state
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/auth/github/callback")
async def github_oauth_callback(
    code: str = Query(...),
    state: str = Query(...),
    redirect_uri: str = Query(...),
    user_id: str = Query(...)
):
    """
    Handle GitHub OAuth callback
    Exchange authorization code for access token
    """
    try:
        # Validate state
        if not GitHubOAuthController.validate_oauth_state(state):
            raise HTTPException(status_code=400, detail="Invalid or expired state")
        
        # Exchange code for token
        access_token = GitHubOAuthController.exchange_code_for_token(code, redirect_uri)
        
        if not access_token:
            raise HTTPException(status_code=400, detail="Failed to obtain access token")
        
        # Get user info
        user_info = GitHubOAuthController.get_user_info(access_token)
        
        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to fetch user information")
        
        # Save user tokens (in production, use secure database)
        GitHubOAuthController.save_user_tokens(
            user_id=user_id,
            github_username=user_info['login'],
            access_token=access_token
        )
        
        return {
            "status": "success",
            "user_id": user_id,
            "github_username": user_info['login'],
            "avatar_url": user_info.get('avatar_url'),
            "profile_url": user_info.get('html_url')
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/repos")
async def get_user_repositories(user_id: str = Query(...)):
    """
    Fetch user's GitHub repositories using stored access token
    """
    try:
        from app.models.github_model import get_github_user
        
        # Get stored access token
        user = get_github_user(user_id)
        if not user:
            raise HTTPException(status_code=401, detail="User not authenticated with GitHub")
        
        # Fetch repositories
        repos = GitHubOAuthController.get_user_repositories(user.access_token)
        formatted_repos = GitHubOAuthController.format_repo_data(repos)
        
        return {
            "status": "success",
            "count": len(formatted_repos),
            "repositories": formatted_repos
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save-repos")
async def save_user_repositories(
    user_id: str = Query(...),
    repos: List[Dict[str, Any]] = None
):
    """
    Save selected repositories for user
    """
    try:
        if not repos:
            raise HTTPException(status_code=400, detail="No repositories provided")
        
        count = GitHubOAuthController.save_selected_repos(user_id, repos)
        
        return {
            "status": "success",
            "message": f"Saved {count} repositories",
            "saved_count": count
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/linked-repos")
async def get_linked_repositories(user_id: str = Query(...)):
    """
    Get user's linked repositories
    """
    try:
        repos = GitHubOAuthController.get_user_linked_repos(user_id)
        
        return {
            "status": "success",
            "count": len(repos),
            "repositories": repos
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/linked-repos/{repo_id}")
async def unlink_repository(
    repo_id: int,
    user_id: str = Query(...)
):
    """
    Remove a linked repository
    """
    try:
        if GitHubOAuthController.unlink_repository(user_id, repo_id):
            return {
                "status": "success",
                "message": "Repository unlinked successfully"
            }
        else:
            raise HTTPException(status_code=400, detail="Failed to unlink repository")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refresh-repos")
async def refresh_user_repositories(user_id: str = Query(...)):
    """
    Refresh user's repository list
    """
    try:
        from app.models.github_model import get_github_user
        
        user = get_github_user(user_id)
        if not user:
            raise HTTPException(status_code=401, detail="User not authenticated with GitHub")
        
        repos = GitHubOAuthController.refresh_repositories(user_id, user.access_token)
        
        return {
            "status": "success",
            "count": len(repos),
            "repositories": repos
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
