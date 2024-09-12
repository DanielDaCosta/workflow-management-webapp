from uuid import uuid4
from fastapi import APIRouter
from schemas import Workflow, WorkflowWrite, ChatMessage, ExecuteRequest
from config.database import db
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from features.core import RAGPipeline
from config.config import FIREBASE_SCHEMA

router = APIRouter()

@router.get("/")
def read_root():
    return {"Hello": "World"}

@router.get("/workflows/{id}", response_model=Workflow)
async def get_workflow(id: str):
    
    doc_ref = db.collection(FIREBASE_SCHEMA).document(id)

    doc = doc_ref.get()
    if doc.exists:
        return {**{"id": doc.id}, **doc.to_dict()}

@router.get("/workflows", response_model=list[Workflow])
async def get_workflows():

    doc_ref = db.collection(FIREBASE_SCHEMA)
    
    docs = doc_ref.stream()
    workflows = []

    for doc in docs:
        workflows.append({**{"id": doc.id}, **doc.to_dict()})
    return workflows

@router.post("/workflows")
async def create_workflow(workflow: WorkflowWrite):

    doc_ref = db.collection(FIREBASE_SCHEMA)
    doc_ref.add(workflow.model_dump())

    return JSONResponse(content={"message": "Workflow created successfully"}, status_code=201)

@router.delete("/workflow/{id}")
async def delete_workflow(id: str):

    doc_ref = db.collection(FIREBASE_SCHEMA)
    doc_ref.document(id).delete()
    return JSONResponse(content={"message": "Workflow deleted successfully"}, status_code=200)


@router.post("/workflow/{id}/execute", response_model=ChatMessage)
async def execute(id: str, request: ExecuteRequest):
    prompt = request.prompt

    doc_ref = db.collection(FIREBASE_SCHEMA).document(id)

    doc = doc_ref.get()

    workflow = doc.to_dict()

    # Testing
    # url = "https://en.wikipedia.org/wiki/Y_Combinator"
    
    url = workflow["url"]
        
    # Format the documents for use in the prompt
    rag_pipeline = RAGPipeline(web_path=url)

    result = rag_pipeline.run(prompt)

    return {"message": result}