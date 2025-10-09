import pytest
from django.urls import reverse
from rest_framework import status


@pytest.mark.django_db
def test_healthcheck(client):
    url = reverse("healthcheck")
    response = client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"status": "ok"}
