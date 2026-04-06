import numpy as np
from sentence_transformers import SentenceTransformer

# Lazy-load the model as per Performance Considerations
_model = None

def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model

def generate_embedding(text: str) -> np.ndarray:
    """
    Generate an embedding for a given text string.
    """
    model = get_model()
    return model.encode(text)

def generate_combined_embedding(title: str, description: str) -> np.ndarray:
    """
    Generate a combined embedding using both title and description.
    """
    combined_text = f"{title} {description}"
    return generate_embedding(combined_text)
