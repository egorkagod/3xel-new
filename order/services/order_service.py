from order.repositories import order_rep
from order.models import GoodVariant
from order.exceptions import InvalidGoodsError, OrderCreationError, PaymentInitializationError
from pay.services import pay_service


def get(user_id, order_id):
    order = order_rep.get(user_id, order_id)
    return order

def get_all(user_id):
    orders = order_rep.get_all(user_id)
    return orders

def create(user_id, goods, video_id):
    amount = get_amount(goods)

    order_id = order_rep.create(user_id, goods, video_id, amount)
    if not order_id:
        raise OrderCreationError()

    payment_url = pay_service.init(order_id, amount)
    if not payment_url:
        raise PaymentInitializationError()
    return payment_url

def get_amount(goods):
    if not goods:
        raise InvalidGoodsError('Goods list is empty.')

    grouped_goods = {}
    for good_id in goods:
        grouped_goods[good_id] = grouped_goods.setdefault(good_id, 0) + 1

    variant_prices = dict(
        GoodVariant.objects.filter(id__in=grouped_goods.keys()).values_list('id', 'price')
    )
    if len(variant_prices) != len(grouped_goods):
        raise InvalidGoodsError('One or more goods are invalid.')

    total_amount = sum(variant_prices[variant_id] * quantity for variant_id, quantity in grouped_goods.items())
    if total_amount <= 0:
        raise InvalidGoodsError('Calculated order amount is not positive.')

    return total_amount
