import os
from dotenv import load_dotenv
load_dotenv()

FIREBASE_SCHEMA = os.getenv(
    'FIREBASE_SCHEMA'
)
FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000"
)
GOOGLE_APPLICATION_CREDENTIALS_JSON = os.getenv(
    'GOOGLE_APPLICATION_CREDENTIALS'
)
OPEN_API_KEY = os.getenv(
    'OPENAI_API_KEY'
)
