from root.repositories import user_rep
from root.exceptions import UserExists, UserCreationFailed
from .dto import UserChangeDataDTO


def create(**kwargs):
    user, created = user_rep.get_or_create(**kwargs)
    if not created:
        raise UserExists
    if not user:
        raise UserCreationFailed
    return user


def get_email(user_id):
    user = user_rep.get(user_id=user_id)
    if user:
        return user.email
    return None


def change_data(dto: UserChangeDataDTO):
    user = user_rep.get(user_id=dto.user_id)
    if user:
        user.first_name = dto.name
        user.last_name = dto.surname
        user.patronymic = dto.patronymic
        user.save(update_fields=['name', 'surname', 'patronymic'])