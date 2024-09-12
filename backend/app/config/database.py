from dotenv import load_dotenv
import firebase_admin
from firebase_admin import firestore
from firebase_admin import credentials
from config.config import GOOGLE_APPLICATION_CREDENTIALS_JSON

cred = credentials.Certificate(GOOGLE_APPLICATION_CREDENTIALS_JSON)

app = firebase_admin.initialize_app(cred)

db = firestore.client()