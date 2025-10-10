import pytest
from django.contrib.auth import get_user_model


User = get_user_model()


@pytest.mark.django_db
def test_create_user_success():
    user = User.objects.create_user(
        email="user@example.com",
        password="pass123",
        first_name="John",
        last_name="Doe",
    )

    assert user.email == "user@example.com"
    assert user.first_name == "John"
    assert user.last_name == "Doe"
    assert user.is_active
    assert not user.is_staff
    assert not user.is_superuser
    assert user.check_password("pass123")


@pytest.mark.django_db
def test_create_user_without_email_raises_error():
    with pytest.raises(ValueError) as exc:
        User.objects.create_user(email=None, password="pass123")
    assert "Email must be set" in str(exc.value)


@pytest.mark.django_db
def test_create_superuser_success():
    admin = User.objects.create_superuser(
        email="admin@example.com",
        password="adminpass",
    )

    assert admin.is_staff
    assert admin.is_superuser
    assert admin.is_active
    assert admin.check_password("adminpass")


@pytest.mark.django_db
def test_create_superuser_with_wrong_flag_raises_error():
    with pytest.raises(ValueError) as exc:
        User.objects.create_superuser(
            email="badadmin@example.com",
            password="adminpass",
            is_superuser=False,
        )
    assert "Superuser must have is_superuser=True" in str(exc.value)


@pytest.mark.django_db
def test_str_representation():
    user = User.objects.create_user(
        email="user@example.com",
        password="pass123",
    )
    assert str(user) == "user@example.com"


@pytest.mark.django_db
def test_email_uniqueness():
    User.objects.create_user(email="unique@example.com", password="pass123")
    with pytest.raises(Exception):
        User.objects.create_user(
            email="unique@example.com", password="pass456"
        )
