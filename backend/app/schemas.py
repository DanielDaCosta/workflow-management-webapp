from pydantic import BaseModel
from typing import Optional, List, Any
from enum import Enum


class Workflow(BaseModel):
    id: str
    url: str
    title: str
    body: str

class WorkflowWrite(BaseModel):
    url: str
    title: str
    body: str

class ChatMessage(BaseModel):
    message: str

class ExecuteRequest(BaseModel):
    prompt: str