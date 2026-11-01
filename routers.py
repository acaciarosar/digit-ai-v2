from fastapi import APIRouter, HTTPException, Request

from schemas import DigitInput, DigitPrediction
from services import predict_digit

router = APIRouter()

@router.get("/")
def root():
    return {
        "message": "DigitAI API está em execução.",
        "endpoint": "/predict"
    }

@router.get("/health")
def health(request: Request):
    model = getattr(request.app.state, "model", None)

    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Modelo não está disponível."
        )

    return {
        "status": "ok",
        "model_loaded": True
    }

@router.post("/predict", response_model=DigitPrediction)
def predict(request: Request, input_data: DigitInput):
    model = request.app.state.model

    try:
        return predict_digit(model, input_data.pixels)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Erro interno ao realizar a predição."
        )