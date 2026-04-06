from typing import List, Dict, Any
import json
import os
from pathlib import Path

class IssueStorage:
    """Simple storage manager for issues"""
    
    def __init__(self, storage_path: str = None):
        """Initialize issue storage
        
        Args:
            storage_path: Path to the JSON file for storing issues. 
                         Defaults to backend/data/issues.json
        """
        if storage_path is None:
            # Default to backend/data/issues.json
            backend_dir = Path(__file__).resolve().parent.parent.parent
            storage_path = os.path.join(backend_dir, "data", "issues.json")
        
        self.storage_path = storage_path
        self.issues: List[Dict[str, Any]] = []
        self._load_issues()
    
    def _load_issues(self) -> None:
        """Load issues from disk"""
        try:
            if os.path.exists(self.storage_path):
                with open(self.storage_path, 'r', encoding='utf-8') as f:
                    self.issues = json.load(f)
        except Exception as e:
            print(f"Error loading issues: {e}")
            self.issues = []
    
    def _save_issues(self) -> None:
        """Save issues to disk"""
        try:
            os.makedirs(os.path.dirname(self.storage_path), exist_ok=True)
            with open(self.storage_path, 'w', encoding='utf-8') as f:
                json.dump(self.issues, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving issues: {e}")
    
    def get_all_issues(self) -> List[Dict[str, Any]]:
        """Get all stored issues"""
        return self.issues
    
    def add_issue(self, issue: Dict[str, Any]) -> None:
        """Add a new issue to storage"""
        self.issues.append(issue)
        self._save_issues()
    
    def get_issue(self, issue_id: str) -> Dict[str, Any]:
        """Get a specific issue by ID"""
        for issue in self.issues:
            if issue.get('id') == issue_id:
                return issue
        return None
    
    def update_issue(self, issue_id: str, updated_data: Dict[str, Any]) -> bool:
        """Update an existing issue"""
        for i, issue in enumerate(self.issues):
            if issue.get('id') == issue_id:
                self.issues[i].update(updated_data)
                self._save_issues()
                return True
        return False
    
    def delete_issue(self, issue_id: str) -> bool:
        """Delete an issue by ID"""
        initial_length = len(self.issues)
        self.issues = [issue for issue in self.issues if issue.get('id') != issue_id]
        if len(self.issues) < initial_length:
            self._save_issues()
            return True
        return False
