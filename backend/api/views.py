from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView

from .models import User
from .serializers import (
    UserPasswordUpdateSerializer,
    UserSerializer,
    UserUpdateSerializer,
)


@api_view(["GET"])
@permission_classes([AllowAny])
def healthcheck(_: Request):
    return Response({"status": "ok"})


class UserListCreateView(generics.ListCreateAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        return User.objects.filter(email=self.request.user)

    def get_permissions(self):
        self.permission_classes = [AllowAny]
        if self.request.method == 'GET':
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def list(self, _: Request):
        serializer = UserSerializer(self.get_queryset(), many=True)
        return Response(serializer.data[0])

    def perform_create(self, serializer: UserSerializer):
        serializer.save()


class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserUpdateSerializer
    lookup_url_kwarg = 'id'
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(email=self.request.user)


class UserPasswordUpdateView(APIView):
    serializer_class = UserPasswordUpdateSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request: Request):
        serializer = UserPasswordUpdateSerializer(
            data=request.data, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'detail': 'Password changed successfully'},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
