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

    if dto.previous_order_id:
        previous_order = Order.objects.filter(pk=dto.previous_order_id).first()
        if not previous_order or not previous_order.video:
            raise OrderCreationError('Не найден предыдущий заказ или его видео')
        new_video_path = str(order_folder / f'video.{previous_order.video.format}')
        os.link(previous_order.video.path, new_video_path)
        video = File.objects.create(
            user_id=dto.user_id,
            path=new_video_path
        )
    elif dto.video_id:
        video = File.objects.filter(pk=dto.video_id).first()
        if not video:
            raise OrderCreationError('Не найдено загруженное видео')
        new_video_path = str(order_folder / f'video.{video.format}')
        shutil.move(video.path, new_video_path)
        video.path = new_video_path
        video.save(update_fields=['path'])

    update_fields = []
    if dto.previous_order_id or dto.video_id:
        created_order.video = video
        update_fields.append('video')

    if dto.promocode:
        created_order.promocode_id = dto.promocode
        update_fields.append('promocode')

    created_order.save(update_fields=update_fields)

    if dto.promocode:
        Promocode.objects.filter(pk=dto.promocode).update(is_used=True)

    return created_order.id
