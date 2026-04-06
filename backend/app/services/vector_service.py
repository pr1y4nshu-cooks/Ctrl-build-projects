import numpy as np
from typing import List, Dict, Any

def cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """
    Calculate the cosine similarity between two numpy ndarrays.
    """
    if np.linalg.norm(vec1) == 0 or np.linalg.norm(vec2) == 0:
        return 0.0
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

def find_similar_issues(
    embedding: np.ndarray, 
    issues_db: List[Dict[str, Any]], 
    top_k: int = 3, 
    threshold: float = 0.5
) -> List[Dict[str, Any]]:
    """
    Find most similar past issues from the in-memory database using cosine similarity.
    Returns a list of dicts with similar issues' essential data and similarity score.
    """
    similar_issues = []
    
    for db_issue in issues_db:
        if 'embedding' not in db_issue or db_issue['embedding'] is None:
            continue
            
        # Convert list back to numpy array if stored as list
        issue_emb = np.array(db_issue['embedding'])
        
        sim_score = cosine_similarity(embedding, issue_emb)
        
        if sim_score >= threshold:
            similar_issues.append({
                "id": db_issue.get("id"),
                "title": db_issue.get("title"),
                "similarity": float(sim_score)
            })
            
    # Sort by descending similarity score
    similar_issues.sort(key=lambda x: x['similarity'], reverse=True)
    
    return similar_issues[:top_k]
