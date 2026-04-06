import os
import sys
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to path
sys.path.insert(0, os.path.dirname(__file__))

from app.config.settings import config

if __name__ == '__main__':
    # Get configuration from environment or use defaults
    port = int(os.getenv('FASTAPI_PORT', 8001))
    host = os.getenv('FASTAPI_HOST', '0.0.0.0')
    reload = os.getenv('RELOAD', 'False').lower() == 'true'
    
    print(f"Starting OpenIssue Analyzer API on {host}:{port}")
    print(f"Reload mode: {reload}")
    
    # Run the FastAPI app with uvicorn
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )
