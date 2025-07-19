from django.contrib.auth.models import User
from rest_framework import serializers


class RegisterViewSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    email_code = serializers.CharField()
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
        fields = ['first_name', 'email']