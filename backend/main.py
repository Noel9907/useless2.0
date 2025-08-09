
from fastapi import FastAPI
from pydantic import BaseModel
from interpreter import MalayalamInterpreter
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    mlm_code: str

@app.post("/run")
def run_code(req: CodeRequest):
    interp = MalayalamInterpreter()
    result = interp.run(req.mlm_code)
    print(result)
    return {"output": result}
