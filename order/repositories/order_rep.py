import uuid

from django.contrib.auth.models import User

from order.models import Order, OrderItem, GoodVariant
from filehandler.models import File
from order.dto import CreateOrdeRepoDTO


def create(data: CreateOrdeRepoDTO) -> uuid.UUID | None:
    video = File.objects.filter(id=data.video_id).first()
    if video:
        order = Order.objects.create(user_id=data.user_id, amount=data.amount, video=video)
        for item in data.items:
            good_variant = GoodVariant.objects.filter(pk=item.good_variant_id).first()
            if good_variant:
                OrderItem.objects.create(
                    order=order,
                    good_variant=good_variant,
                    quantity=item.quantity,
                )
        return order.id
    return None

def get(user_id: int, order_id: uuid.UUID):
    user = User.objects.filter(pk=user_id).first()
    if user:
        order = user.orders.filter(pk=order_id).first()
        if order:
            return order
    return None

def get_all(user_id: int):
    user = User.objects.filter(pk=user_id).first()
    if user:
        orders = user.orders.all()
        return orders 

"""Grouping now happens in service layer; keep repo lean."""
