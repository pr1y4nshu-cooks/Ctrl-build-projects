from fastapi import APIRouter, HTTPException
from typing import List, Dict
from app.services.embedding_service import get_embedding_service
from app.services.vector_service import VectorService
from app.config.settings import config
import os

router = APIRouter()
embedding_service = get_embedding_service()
vector_service = VectorService(config.FAISS_INDEX_PATH)

@router.post("")
async def find_similar_issues(data: Dict):
    """Find similar issues based on text"""
    try:
        if 'text' not in data:
            raise HTTPException(status_code=400, detail='Text field is required')
        
        text = data['text']
        top_k = data.get('top_k', 5)
        
        # Generate embedding for query
        query_embedding = embedding_service.generate_embedding(text)
        
        if not query_embedding:
            raise HTTPException(status_code=500, detail='Failed to generate embedding')
        
        # Search for similar issues
        similar_issues = vector_service.search(query_embedding, k=top_k)
        
        return {
            'success': True,
            'query': text,
            'similar_count': len(similar_issues),
            'similar_issues': [
                {
                    'issue_id': issue_id,
                    'similarity': similarity
                }
                for issue_id, similarity in similar_issues
            ]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Internal server error: {str(e)}')

@router.get("/{issue_id}")
async def get_similar_by_id(issue_id: str, top_k: int = 5):
    """Get issues similar to a specific issue ID"""
    try:
        # In production, would retrieve issue embedding from database
        # For now, return placeholder
        return {
            'success': True,
            'issue_id': issue_id,
            'similar_count': 0,
            'similar_issues': []
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Internal server error: {str(e)}')

@router.post("/batch")
async def find_similar_batch(data: List[str]):
    """Find similar issues for multiple queries"""
    try:
        results = []
        for item in data:
            query_embedding = embedding_service.generate_embedding(item)
            similar = vector_service.search(query_embedding, k=5)
            results.append({
                'query': item,
                'similar_issues': [
                    {'issue_id': iid, 'similarity': sim}
                    for iid, sim in similar
                ]
            })
        
        return {
            'success': True,
            'batch_count': len(results),
            'results': results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Internal server error: {str(e)}')

@router.get("/index-info")
async def get_index_info():
    """Get information about the vector index"""
    try:
        info = vector_service.get_index_info()
        model_info = embedding_service.get_model_info()
        
        return {
            'success': True,
            'index': info,
            'model': model_info
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
