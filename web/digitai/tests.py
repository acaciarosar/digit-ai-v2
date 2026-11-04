
import json
from unittest.mock import patch
from urllib.error import URLError

from django.test import TestCase
from django.urls import reverse


class DigitAITests(TestCase):

    
    def test_home_page_loads(self):
        response = self.client.get(reverse("home"))

        self.assertEqual(response.status_code, 200)

    def test_invalid_json_returns_400(self):
        response = self.client.post(
            reverse("predict"),
            data="{json invalido",
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 400)

    def test_json_list_returns_400(self):
        response = self.client.post(
            reverse("predict"),
            data=json.dumps([0] * 784),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 400)

    def test_boolean_pixels_return_400(self):
        pixels = [0] * 784
        pixels[0] = True

        response = self.client.post(
            reverse("predict"),
            data=json.dumps({"pixels": pixels}),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 400)

    @patch("digitai.views.urllib.request.urlopen")
    def test_api_connection_error_returns_502(self, mock_urlopen):
        mock_urlopen.side_effect = URLError("Conexão recusada")

        response = self.client.post(
            reverse("predict"),
            data=json.dumps({"pixels": [0] * 784}),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 502)

    def test_get_request_returns_405(self):
        response = self.client.get(reverse("predict"))

        self.assertEqual(response.status_code, 405)
