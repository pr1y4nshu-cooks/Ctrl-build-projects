from typing import Tuple

CRITICAL_KEYWORDS = {"security", "urgent", "critical", "vulnerability", "crash", "outage", "data loss", "emergency"}
HIGH_KEYWORDS = {"error", "bug", "fail", "broken", "leak", "memory"}
MEDIUM_KEYWORDS = {"feature", "enhance", "improve", "add", "update"}
LOW_KEYWORDS = {"typo", "docs", "documentation", "question", "help", "format"}

def assign_priority(label: str, title: str, description: str) -> Tuple[str, float]:
    """
    Assign a priority (high, medium, low) to an issue based on its label and content.
    Returns a tuple of (priority_level, confidence_score).
    """
    text = (title + " " + description).lower()
    
    critical_matches = sum(1 for kw in CRITICAL_KEYWORDS if kw in text)
    high_matches = sum(1 for kw in HIGH_KEYWORDS if kw in text)
    medium_matches = sum(1 for kw in MEDIUM_KEYWORDS if kw in text)
    low_matches = sum(1 for kw in LOW_KEYWORDS if kw in text)
    
    total_matches = critical_matches + high_matches + medium_matches + low_matches
    
    # Base priority from label
    base_priority = "medium"
    if label == "bug":
        base_priority = "high"
        high_matches += 1
        total_matches += 1
    elif label == "question":
        base_priority = "low"
        low_matches += 1
        total_matches += 1
        
    if total_matches == 0:
        return base_priority, 0.5  # Default fallback based on label alone
        
    scores = {
        "high": (critical_matches * 2 + high_matches) / (total_matches + critical_matches), # weight critical more
        "medium": medium_matches / total_matches,
        "low": low_matches / total_matches
    }
    
    # Get the priority with the highest score
    best_priority = max(scores, key=scores.get)
    best_confidence = scores[best_priority]
    
    # Boost confidence slightly if keyword priority matches label priority idea
    if best_priority == base_priority:
        best_confidence = min(1.0, best_confidence + 0.1)
        
    return best_priority, best_confidence
