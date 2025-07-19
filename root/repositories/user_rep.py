from django.contrib.auth.models import User


def create(**kwargs):
    user = User.objects.create_user(**kwargs)
    return user

def get(user_id):
    user = User.objects.filter(pk=user_id).first()
    return user