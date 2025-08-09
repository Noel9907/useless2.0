from fastapi import APIRouter, HTTPException
from models.schemas import FileCreateRequest
from db.mongodb import files_collection
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/files/create")
async def create_file(file: FileCreateRequest):
    file_doc = {
        "filename": file.filename,
        "content": file.content,
        "session_id": file.session_id,
        "created_at": datetime.utcnow()
    }
    result = await files_collection.insert_one(file_doc)
    return {"id": str(result.inserted_id)}

@router.get("/files/{file_id}")
async def get_file(file_id: str):
    file = await files_collection.find_one({"_id": ObjectId(file_id)})
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    return {
        "id": str(file["_id"]),
        "filename": file["filename"],
        "content": file["content"],
        "session_id": file["session_id"],
        "created_at": file["created_at"].isoformat()
    }

@router.get("/files/list/{session_id}")
async def list_files(session_id: str):
    files = files_collection.find({"session_id": session_id})
    result = []
    async for file in files:
        result.append({
            "id": str(file["_id"]),
            "filename": file["filename"],
            "created_at": file["created_at"].isoformat()
        })
    return result
