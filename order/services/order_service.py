from pathlib import Path
import shutil

from django.conf import settings
from order.repositories import order_rep
from order.repositories.dto import OrderCreateRepoDTO
from order.exceptions import OrderCreationError
from order.services.dto import OrderCreateServiceDTO
from order.models import Order
from filehandler.models import File


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
    if not dto.previous_order_id:
        order_id = order_rep.create(
            OrderCreateRepoDTO(
                user_id=dto.user_id,
                goods=dto.goods,
                video_id=dto.video_id,
                comment=dto.comment,
                amount=dto.amount,
            )
        )
        if not order_id:
            raise OrderCreationError('Не удалось создать заказ в бд')
        video = File.objects.filter(pk=dto.video_id).first()
    else:   
        order = Order.objects.filter(pk=dto.previous_order_id).first()
        if not order:
            raise OrderCreationError('Не найде предыдущий заказ')
        video = order.video
        order_id = order.id

    if not video:
        raise OrderCreationError('Не нашел видео')
    
    order_folder = Path(settings.BASE_DIR) / 'media' / 'orders' / f'{order_id}'
    order_folder.mkdir(parents=True, exist_ok=True)

    new_video_path = str(order_folder / 'video.mp4')
    shutil.move(video.path, new_video_path)
    video.path = new_video_path
    video.save()
    return order_id
