from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

from . import views


auth_urlpatterns = [
    path('user/', views.UserListCreateView.as_view(), name='user'),
    path('user/<str:id>/', views.UserUpdateView.as_view(), name='user-update'),
    path('password/change/', views.UserPasswordUpdateView.as_view(), name='change-password'),
    path('token/', TokenObtainPairView.as_view(), name='get-token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh-token'),
]

api_urlpatterns = []

urlpatterns = auth_urlpatterns + api_urlpatterns
