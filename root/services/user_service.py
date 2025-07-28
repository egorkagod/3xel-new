from root.repositories import user_rep
from root.exceptions import UserExists, UserCreationFailed


def create(**kwargs):
    user, created = user_rep.get_or_create(**kwargs)
    if not created:
        raise UserExists
    if not user:
        raise UserCreationFailed
    return user
