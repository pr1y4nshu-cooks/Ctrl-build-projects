from fastapi import APIRouter, HTTPException
from typing import List, Dict
import uuid

from app.models.issue_model import Issue
from app.schemas.issue_schema import IssueSchema
from app.services.priority_service import PriorityService

router = APIRouter()

# In-memory storage for demo
issues_store = {}

@router.get("")
async def get_issues():
    """Get all issues"""
    try:
        issues_list = list(issues_store.values())
        return {
            'success': True,
            'count': len(issues_list),
            'issues': [IssueSchema.serialize_issue(issue) for issue in issues_list]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{issue_id}")
async def get_issue(issue_id: str):
    """Get a specific issue"""
    if issue_id not in issues_store:
        raise HTTPException(status_code=404, detail='Issue not found')
    
    issue = issues_store[issue_id]
    return {
        'success': True,
        'issue': IssueSchema.serialize_issue(issue)
    }

@router.post("")
async def create_issue(data: Dict):
    """Create a new issue"""
    try:
        # Validate input
        validated_data = IssueSchema.validate_create(data)
        
        # Create issue
        issue = Issue(
            id=str(uuid.uuid4()),
            title=validated_data['title'],
            description=validated_data['description'],
            repository=validated_data['repository'],
            priority=PriorityService.determine_priority(
                validated_data['title'],
                validated_data['description']
            ),
            status=validated_data['status'],
            labels=validated_data['labels']
        )
        
        # Store issue
        issues_store[issue.id] = issue
        
        return {
            'success': True,
            'message': 'Issue created successfully',
            'issue': IssueSchema.serialize_issue(issue)
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Internal server error: {str(e)}')

@router.put("/{issue_id}")
async def update_issue(issue_id: str, data: Dict):
    """Update an issue"""
    if issue_id not in issues_store:
        raise HTTPException(status_code=404, detail='Issue not found')
    
    issue = issues_store[issue_id]
    
    # Update fields
    if 'title' in data:
        issue.title = data['title']
    if 'description' in data:
        issue.description = data['description']
    if 'status' in data:
        issue.status = data['status']
    if 'priority' in data:
        issue.priority = data['priority']
    if 'labels' in data:
        issue.labels = data['labels']
    
    return {
        'success': True,
        'message': 'Issue updated successfully',
        'issue': IssueSchema.serialize_issue(issue)
    }

@router.delete("/{issue_id}")
async def delete_issue(issue_id: str):
    """Delete an issue"""
    if issue_id not in issues_store:
        raise HTTPException(status_code=404, detail='Issue not found')
    
    del issues_store[issue_id]
    
    return {
        'success': True,
        'message': 'Issue deleted successfully'
    }

@router.get("/priority/{priority}")
async def get_issues_by_priority(priority: str):
    """Get issues filtered by priority"""
    filtered_issues = [
        issue for issue in issues_store.values()
        if issue.priority == priority
    ]
    
    return {
        'success': True,
        'priority': priority,
        'count': len(filtered_issues),
        'issues': [IssueSchema.serialize_issue(issue) for issue in filtered_issues]
    }
