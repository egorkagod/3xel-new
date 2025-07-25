import uuid

from django.contrib.auth.models import User

from order.models import Order, OrderItem, GoodVariant
from filehandler.models import File


def create(user_id: int, goods: list, video_id: int, amount: int):
    video = File.objects.filter(id=video_id).first()
    if video:
        order = Order.objects.create(user_id=user_id, amount=amount, video=video)
        group_goods = _group_good_variants(goods)
        for good in group_goods:
            good_variant = GoodVariant.objects.filter(pk=good).first()
            OrderItem.objects.create(order=order,
                                     good_variant = good_variant,
                                     quantity=group_goods[good])
        return order.id
    return None

def get(user_id: int, order_id: uuid.UUID):
    user = User.objects.filter(user_id).first()
    if user:
        order = user.orders.filter(order_id).first()
        if order:
            return order
    return None

def get_all(user_id: int):
    user = User.objects.filter(pk=user_id).first()
    if user:
        orders = user.orders.all()
        return orders 

def _group_good_variants(goods: list):
    result = {}
    for good in goods:
        result[good] = result.setdefault(good, 0) + 1
    return result