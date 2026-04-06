import json
import os
from typing import List, Dict, Optional


class IssueStorage:
    """Simple JSON-based storage for issues"""
    
    def __init__(self, storage_path: str = "./data/issues.json"):
        self.storage_path = storage_path
        self.issues = []
        self.load_issues()
    
    def load_issues(self) -> bool:
        """Load issues from JSON file"""
        try:
            if os.path.exists(self.storage_path):
                with open(self.storage_path, 'r', encoding='utf-8') as f:
                    self.issues = json.load(f)
                return True
            else:
                self.issues = []
                return False
        except Exception as e:
            print(f"Error loading issues: {e}")
            self.issues = []
            return False
    
    def save_issues(self) -> bool:
        """Save issues to JSON file"""
        try:
            os.makedirs(os.path.dirname(self.storage_path), exist_ok=True)
            with open(self.storage_path, 'w', encoding='utf-8') as f:
                json.dump(self.issues, f, indent=2, ensure_ascii=False)
            return True
        except Exception as e:
            print(f"Error saving issues: {e}")
            return False
    
    def add_issue(self, issue: Dict) -> bool:
        """Add a new issue"""
        try:
            self.issues.append(issue)
            return self.save_issues()
        except Exception as e:
            print(f"Error adding issue: {e}")
            return False
    
    def get_all_issues(self) -> List[Dict]:
        """Get all issues"""
        return self.issues
    
    def get_issue_by_id(self, issue_id: str) -> Optional[Dict]:
        """Get issue by ID"""
        for issue in self.issues:
            if issue.get('id') == issue_id:
                return issue
        return None
    
    def update_issue(self, issue_id: str, updates: Dict) -> bool:
        """Update an existing issue"""
        for i, issue in enumerate(self.issues):
            if issue.get('id') == issue_id:
                self.issues[i].update(updates)
                return self.save_issues()
        return False
    
    def delete_issue(self, issue_id: str) -> bool:
        """Delete an issue"""
        self.issues = [issue for issue in self.issues if issue.get('id') != issue_id]
        return self.save_issues()
