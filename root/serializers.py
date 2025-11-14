from django.contrib.auth import get_user_model
from rest_framework import serializers


User = get_user_model()


class RegisterViewSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    email_code = serializers.IntegerField()
    name = serializers.CharField()


class LoginViewSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class ProfileViewSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField()
    phone = serializers.CharField()


class UserModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'patronymic', 'phone', 'email']


class ChangePasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    email_code = serializers.IntegerField()
    password = serializers.CharField()


class ChangeNameSerializer(serializers.Serializer):
    name = serializers.CharField()
    password = serializers.CharField()
