from pydantic import BaseModel

class CodeRequest(BaseModel):
    mlm_code: str

class FileCreateRequest(BaseModel):
    filename: str
    content: str
    session_id: str = "default"

class FileResponse(BaseModel):
    id: str
    filename: str
    content: str
    session_id: str
    created_at: str
