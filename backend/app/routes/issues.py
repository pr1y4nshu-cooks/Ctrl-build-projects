from datetime import datetime
from typing import Any, Dict
from uuid import uuid4

from fastapi import APIRouter, HTTPException

from app.utils.issue_storage import IssueStorage

router = APIRouter()
issue_storage = IssueStorage()


@router.on_event("startup")
async def load_issues_on_startup() -> None:
    issue_storage.load_issues()


@router.get("/")
async def get_all_issues() -> Dict[str, Any]:
    issues = issue_storage.get_all_issues()
    return {"success": True, "count": len(issues), "issues": issues}


@router.get("/priority/{priority}")
async def get_issues_by_priority(priority: str) -> Dict[str, Any]:
    normalized_priority = priority.lower()
    issues = [
        issue
        for issue in issue_storage.get_all_issues()
        if issue.get("priority", "").lower() == normalized_priority
    ]
    return {"success": True, "count": len(issues), "issues": issues}


@router.get("/{issue_id}")
async def get_issue(issue_id: str) -> Dict[str, Any]:
    issue = issue_storage.get_issue(issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return {"success": True, "issue": issue}


@router.post("/")
async def create_issue(payload: Dict[str, Any]) -> Dict[str, Any]:
    title = str(payload.get("title", "")).strip()
    description = str(payload.get("description", "")).strip()

    if not title or not description:
        raise HTTPException(status_code=400, detail="title and description are required")

    now = datetime.utcnow().isoformat()
    issue = {
        "id": str(uuid4()),
        "title": title,
        "description": description,
        "repository": payload.get("repository", "unknown"),
        "priority": str(payload.get("priority", "medium")).lower(),
        "status": str(payload.get("status", "open")).lower(),
        "labels": payload.get("labels", []),
        "created_at": now,
        "updated_at": now,
    }

    try:
        issue_storage.add_issue(issue)
    except (ValueError, RuntimeError) as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {"success": True, "issue": issue}


@router.put("/{issue_id}")
async def update_issue(issue_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    existing_issue = issue_storage.get_issue(issue_id)
    if not existing_issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    updated_issue = dict(existing_issue)
    for key in ["title", "description", "repository", "priority", "status", "labels"]:
        if key in payload:
            updated_issue[key] = payload[key]

    updated_issue["updated_at"] = datetime.utcnow().isoformat()

    try:
        issue_storage.update_issue(issue_id, updated_issue)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {"success": True, "issue": updated_issue}


@router.delete("/{issue_id}")
async def delete_issue(issue_id: str) -> Dict[str, Any]:
    try:
        deleted = issue_storage.delete_issue(issue_id)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    if not deleted:
        raise HTTPException(status_code=404, detail="Issue not found")

    return {"success": True, "message": "Issue deleted"}
