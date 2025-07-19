from order.repositories import order_rep
from pay.services import pay_service


def get(user_id, order_id):
    order = order_rep.get(user_id, order_id)
    return order

def get_all(user_id):
    orders = order_rep.get_all(user_id)
    return orders

def create(user_id, goods, video_id, amount):
    order_id = order_rep.create(user_id, goods, video_id, amount)
    if order_id:
        payment_url = pay_service.init(order_id, amount)
        if payment_url:
            return payment_url
    return False
