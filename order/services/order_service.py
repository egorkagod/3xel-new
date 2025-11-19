from pathlib import Path
import shutil
import os

from django.conf import settings
from order.repositories import order_rep
from order.repositories.dto import OrderCreateRepoDTO
from order.exceptions import OrderCreationError
from order.services.dto import OrderCreateServiceDTO
from order.models import Order
from filehandler.models import File
from pay.models import Promocode


def get(order_id: int, user_id: int | None = None):
    if user_id is None:
        order = Order.objects.filter(pk=order_id).first()
    else:
        order = Order.objects.filter(pk=order_id, user_id=user_id).first()
    return order

def get_all(user_id):
    orders = Order.objects.filter(user__id=user_id).all()
    return list(orders)


def create(dto: OrderCreateServiceDTO) -> int:
    created_order = order_rep.create(
        OrderCreateRepoDTO(
            user_id=dto.user_id,
            goods=dto.goods,
            certificates=dto.certificates,
            promocode=dto.promocode,
            comment=dto.comment,
            amount=dto.amount,
        )
    )

    if not created_order:
        raise OrderCreationError('Не удалось создать заказ в бд')
    
    order_folder = Path(settings.BASE_DIR) / 'media' / 'orders' / f'{created_order.id}'
    order_folder.mkdir(parents=True, exist_ok=True)

    update_fields: list[str] = []

    if dto.previous_order_id:
        previous_order = Order.objects.filter(pk=dto.previous_order_id).first()
        if not previous_order:
            raise OrderCreationError('Не найден предыдущий заказ или его видео')

        # Если у предыдущего заказа есть файл — копируем файл
        if previous_order.video:
            new_video_path = str(order_folder / f'video.{previous_order.video.format}')
            os.link(previous_order.video.path, new_video_path)
            video = File.objects.create(
                user_id=dto.user_id,
                path=new_video_path
            )
            created_order.video = video
            update_fields.append('video')
        # Если же у предыдущего заказа только ссылка — просто переиспользуем её
        elif previous_order.video_url:
            created_order.video_url = previous_order.video_url
            update_fields.append('video_url')
        else:
            raise OrderCreationError('Не найден предыдущий заказ или его видео')

    elif dto.video_id:
        # Пытаемся трактовать video_id как целочисленный id файла
        file_pk: int | None = None
        try:
            if dto.video_id is not None:
                file_pk = int(dto.video_id)
        except (TypeError, ValueError):
            file_pk = None

        if file_pk:
            video = File.objects.filter(pk=file_pk).first()
            if not video:
                raise OrderCreationError('Не найдено загруженное видео')
            new_video_path = str(order_folder / f'video.{video.format}')
            shutil.move(video.path, new_video_path)
            video.path = new_video_path
            video.save(update_fields=['path'])
            created_order.video = video
            update_fields.append('video')
        else:
            # video_id не является числом — считаем, что это ссылка
            created_order.video_url = dto.video_id
            update_fields.append('video_url')

    if dto.promocode:
        created_order.promocode_id = dto.promocode
        update_fields.append('promocode')

    created_order.save(update_fields=update_fields)

    if dto.promocode:
        Promocode.objects.filter(pk=dto.promocode).update(is_used=True)

    return created_order.id
