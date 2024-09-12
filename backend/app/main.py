from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, Depends
from router import router
# import firebase_admin
import os
# from app.config import get_settings
load_dotenv()

app = FastAPI()
app.include_router(router)

origins = [os.getenv("FRONTEND_URL", "http://localhost:3000")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

