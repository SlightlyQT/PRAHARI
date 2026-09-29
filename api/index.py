import os
import sys

# Make the FastAPI app in backend/app importable as `app.main`
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.main import app  # noqa: E402,F401
