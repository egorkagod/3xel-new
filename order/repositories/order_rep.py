from order.models import Order, OrderItem, GoodVariant
from filehandler.models import File
from order.repositories.dto import OrderCreateRepoDTO


def create(dto: OrderCreateRepoDTO) -> int | None:
    video = File.objects.filter(id=dto.video_id).first()
    if not video:
        return None

    order = Order.objects.create(
        user_id=dto.user_id,
        amount=dto.amount,
        video=video,
        comment=dto.comment,
    )

    goods = {}
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
    
    return order.id
