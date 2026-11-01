from pathlib import Path
import joblib
import numpy as np

MODEL_PATH = Path(__file__).resolve().parent / "models" / "mlp_model.joblib"

def load_model():
    model = joblib.load(MODEL_PATH)
    return model


def predict_digit(model, pixels):
    input_data = np.array(pixels, dtype=np.float32).reshape(1, -1)
    predicted_digit = int(model.predict(input_data)[0])
    probabilities = model.predict_proba(input_data)[0]
    confidence = float(probabilities[predicted_digit])
    return {"digit": predicted_digit, "confidence": confidence}