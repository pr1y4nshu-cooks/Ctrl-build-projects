from typing import Tuple

BUG_KEYWORDS = {"error", "bug", "crash", "exception", "fail", "broken", "issue", "doesn't work", "not working"}
FEATURE_KEYWORDS = {"feature", "add", "enhance", "improve", "request", "support", "new", "idea"}
QUESTION_KEYWORDS = {"how", "why", "what", "question", "help", "explain", "doc", "documentation"}

def classify_issue(title: str, description: str) -> Tuple[str, float]:
    """
    Classify an issue as 'bug', 'feature', or 'question' based on keywords.
    Returns a tuple of (label, confidence).
    """
    text = (title + " " + description).lower()
    
    bug_matches = sum(1 for kw in BUG_KEYWORDS if kw in text)
    feature_matches = sum(1 for kw in FEATURE_KEYWORDS if kw in text)
    question_matches = sum(1 for kw in QUESTION_KEYWORDS if kw in text)
    
    total_matches = bug_matches + feature_matches + question_matches
    
    if total_matches == 0:
        return "question", 0.5  # Default fallback
        
    scores = {
        "bug": bug_matches / total_matches,
        "feature": feature_matches / total_matches,
        "question": question_matches / total_matches
    }
    
    # Get the label with the highest score
    best_label = max(scores, key=scores.get)
    best_confidence = scores[best_label]
    
    return best_label, best_confidence
