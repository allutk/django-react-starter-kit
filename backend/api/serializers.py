from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'password'
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'password': {'write_only': True}
        }

    def create(self, validated_data: dict):
        return User.objects.create_user(**validated_data)


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'last_name'
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'email': {'read_only': True}
        }


class UserPasswordUpdateSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, write_only=True)
    new_password_confirmation = serializers.CharField(required=True, write_only=True)

    def validate(self, data: dict):
        user = self.context.get('request').user
        if not user.check_password(data.get('current_password')):
            raise serializers.ValidationError(
                { 'detail': 'Provided password is incorrect' }
            )
        if data.get('new_password') != data.get('new_password_confirmation'):
            raise serializers.ValidationError(
                { 'detail': 'The passwords do not match' }
            )
        return super().validate(data)

    def save(self, **kwargs):
        user = self.context.get('request').user
        user.set_password(self.validated_data.get('new_password'))
        user.save()
        return user
