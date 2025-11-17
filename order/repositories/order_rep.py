from order.models import Order, OrderItem, GoodVariant
from order.repositories.dto import OrderCreateRepoDTO
from pay.repositories import promo_rep


def create(dto: OrderCreateRepoDTO):
    order = Order.objects.create(
        user_id=dto.user_id,
        amount=dto.amount,
        comment=dto.comment,
    )

    goods = {}
    if dto.goods:
        for id in dto.goods:
            goods[id] = goods.setdefault(id, 0) + 1

    for id, quantity in goods.items():
        good_variant = GoodVariant.objects.filter(pk=id).first()
        if good_variant:
            OrderItem.objects.create(
                order=order,
                good_variant=good_variant,
                quantity=quantity,
            )

    if dto.certificates:
        for cert in dto.certificates:
            promo_rep.create(
                promo_rep.PromoCreateRepoDTO(
                    order_id=order.id,
                    denomination=cert['denomination'],
                    type=cert['type'],
                )
            )
            
    
    return order
