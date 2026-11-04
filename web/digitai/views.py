import json
import urllib.request
import urllib.error
import socket

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie


@ensure_csrf_cookie
def home(request):
    return render(request, "digitai/index.html")


def predict(request):
    if request.method != "POST":
        return JsonResponse(
            {"error": "Método não permitido."},
            status=405
        )

    try:
        data = json.loads(request.body)

        if not isinstance(data, dict):
            return JsonResponse(
                {"error": "Os dados enviados devem estar no formato JSON de objeto."},
                status=400
            )

        pixels = data.get("pixels")

        if not isinstance(pixels, list) or len(pixels) != 784:
            return JsonResponse(
                {"error": "A imagem deve conter exatamente 784 pixels."},
                status=400
            )

        if not all(
            not isinstance(pixel, bool)
            and isinstance(pixel, (int, float))
            and 0 <= pixel <= 1
            for pixel in pixels
        ):
            return JsonResponse(
                {"error": "Os pixels devem estar entre 0 e 1."},
                status=400
            )

        payload = json.dumps({"pixels": pixels}).encode("utf-8")

        api_request = urllib.request.Request(
            "http://127.0.0.1:8001/predict",
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        with urllib.request.urlopen(api_request, timeout=10) as response:
            result = json.loads(response.read().decode("utf-8"))

        return JsonResponse(result)

    except (json.JSONDecodeError, TypeError, ValueError):
        return JsonResponse(
            {"error": "Dados enviados inválidos."},
            status=400
        )

    except urllib.error.HTTPError as error:
        return JsonResponse(
            {"error": "A API de reconhecimento retornou um erro."},
            status=error.code
        )

    except (TimeoutError, socket.timeout):
        return JsonResponse(
            {"error": "A API de reconhecimento demorou muito para responder."},
            status=504
        )

    except urllib.error.URLError:
        return JsonResponse(
            {"error": "Não foi possível conectar à API de reconhecimento."},
            status=502
        )