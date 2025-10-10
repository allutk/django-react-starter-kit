import pytest
from typing import Any
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractBaseUser


User = get_user_model()


@pytest.fixture
def api_client() -> APIClient:
    return APIClient()


@pytest.fixture
def user(db: Any) -> AbstractBaseUser:
    return User.objects.create_user(
        email="user@example.com",
        password="pass123",
        first_name="John",
        last_name="Doe",
    )


def test_healthcheck(api_client: APIClient):
    url = reverse("healthcheck")
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"status": "ok"}


@pytest.mark.django_db
def test_create_user(api_client: APIClient):
    url = reverse("user")
    payload = {
        "email": "user@example.com",
        "password": "pass123",
        "first_name": "John",
        "last_name": "Doe",
    }
    response = api_client.post(url, payload, format="json")

    assert response.status_code == status.HTTP_201_CREATED
    assert User.objects.filter(email="user@example.com").exists()


def test_get_user_requires_auth(api_client: APIClient):
    url = reverse("user")
    response = api_client.get(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_get_user_authenticated(api_client: APIClient, user: AbstractBaseUser):
    api_client.force_authenticate(user=user)
    url = reverse("user")
    response = api_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["email"] == user.email


@pytest.mark.django_db
def test_update_user(api_client: APIClient, user: AbstractBaseUser):
    api_client.force_authenticate(user=user)
    url = reverse("user-update", kwargs={"id": user.id})

    payload = {"first_name": "New", "last_name": "Name"}
    response = api_client.patch(url, payload, format="json")

    assert response.status_code == status.HTTP_200_OK
    user.refresh_from_db()
    assert user.first_name == "New"
    assert user.last_name == "Name"


@pytest.mark.django_db
def test_update_password_success(
    api_client: APIClient,
    user: AbstractBaseUser,
):
    api_client.force_authenticate(user=user)
    url = reverse("change-password")

    payload = {
        "current_password": "pass123",
        "new_password": "newpass",
        "new_password_confirmation": "newpass",
    }

    response = api_client.put(url, payload, format="json")
    assert response.status_code == status.HTTP_200_OK
    user.refresh_from_db()
    assert user.check_password("newpass")


@pytest.mark.django_db
def test_update_password_wrong_password(
    api_client: APIClient,
    user: AbstractBaseUser,
):
    api_client.force_authenticate(user=user)
    url = reverse("change-password")

    payload = {
        "current_password": "wrongpass",
        "new_password": "newpass",
        "new_password_confirmation": "newpass",
    }

    response = api_client.put(url, payload, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Provided password is incorrect" in str(response.json())


@pytest.mark.django_db
def test_update_password_mismatch(
    api_client: APIClient,
    user: AbstractBaseUser,
):
    api_client.force_authenticate(user=user)
    url = reverse("change-password")

    payload = {
        "current_password": "pass123",
        "new_password": "newpass123",
        "new_password_confirmation": "newpass456",
    }

    response = api_client.put(url, payload, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "The passwords do not match" in str(response.json())
