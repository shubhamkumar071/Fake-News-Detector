from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn
from model_helper import analyze_text

app = FastAPI(
    title="TruthLens NLP Service",
    description="NLP microservice for Fake News & Manipulation Detection",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    text: str
    url: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    service: str

@app.get("/health", response_model=HealthResponse)
def health_check():
    """Verify that the service is running and healthy."""
    return {"status": "UP", "service": "TruthLens-NLP-Service"}

@app.post("/analyze")
def analyze(payload: AnalysisRequest):
    """Analyze incoming text for bias, emotional manipulation, clickbait, and fake probability."""
    if not payload.text or not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text field cannot be empty.")
    
    try:
        results = analyze_text(payload.text)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing NLP analysis: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
