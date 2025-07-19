from django.contrib.auth.models import User


def create(**kwargs):
    try:
        user = User.objects.create_user(**kwargs)
    except:
        user = None
    return user

def get(user_id):
    user = User.objects.filter(pk=user_id).first()
    return user