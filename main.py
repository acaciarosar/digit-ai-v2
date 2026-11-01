from contextlib import asynccontextmanager

from fastapi import FastAPI

from services import load_model
from routers import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model = load_model()
    yield

app = FastAPI(
    title="DigitAI API",
    description="API para classificação de dígitos manuscritos com MLP treinada no MNIST.",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(router)