from django.contrib.auth.models import User


def get_or_create(**kwargs):
    username = kwargs.get('username')
    user = User.objects.filter(username=username).first()
    if user:
        return user, False
    user = User.objects.create_user(**kwargs)
    return user, True

def get(user_id):
    user = User.objects.filter(pk=user_id).first()
    return user

def change_password(user, password):
    user.set_password(password)
    user.save()
