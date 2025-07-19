from django.contrib.auth.models import User

from order.models import Order, OrderItem
from filehandler.models import File


def create(user_id, goods, video_id, amount):
    video = File.objects.filter(id=video_id).first()
    if video:
        order = Order.objects.create(user_id=user_id, amount=amount, video_id=video_id)
        for good in goods:
            OrderItem.objects.create(order=order,
                                     good_variant_id = good['good_variant_id'],
                                     quantity=good['quantity'])
        return order.id
    return None

def get(user_id, order_id):
    user = User.objects.filter(user_id).first()
    if user:
        order = user.orders.filter(order_id).first()
        if order:
            return order
    return None


def get_all(user_id):
    user = User.objects.filter(user_id).first()
    orders = user.orders.all()
    return orders