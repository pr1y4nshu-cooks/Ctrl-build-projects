import os
import sys
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to path
sys.path.insert(0, os.path.dirname(__file__))

from app.main import app

if __name__ == '__main__':
    # Get configuration from environment or use defaults
    port = int(os.getenv('FLASK_PORT', 5000))
    host = os.getenv('FLASK_HOST', '127.0.0.1')
    
    print(f"Starting OpenIssue Analyzer API on {host}:{port}")
    
    # Run the app with Uvicorn
    uvicorn.run(app, host=host, port=port, reload=True)
