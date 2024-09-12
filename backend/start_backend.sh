#!/bin/bash

# Create and activate a virtual environment
python3.10 -m venv mentum
source mentum/bin/activate

# Install the libraries in order
pip install load-dotenv
pip install fastapi
pip install firebase_admin
pip install bs4
pip install langchain
pip install langchain_chroma
pip install langchain_community
pip install langchain_openai

echo "All libraries installed successfully."

cd app
uvicorn main:app --reload