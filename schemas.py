from typing import Annotated
from pydantic import BaseModel, Field

Pixel = Annotated[float, Field(ge=0, le=1)]


class DigitInput(BaseModel):
    pixels: list[Pixel] = Field(..., min_length=784, max_length=784)
    model_config = {"extra": "forbid", "strict": True}

class DigitPrediction(BaseModel):
    digit: int = Field(..., ge=0, le=9)
    confidence: float = Field(..., ge=0, le=1)
    model_config = {"extra": "forbid", "strict": True}