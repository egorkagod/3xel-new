from order.repositories import order_rep
from order.exceptions import InvalidGoodsError, OrderCreationError
from order.dto.order import CreateOrderServiceDTO, CreateOrderItemRepoDTO
from order.models import GoodVariant, Order


def get(user_id, order_id: int):
    order = order_rep.get(user_id, order_id)
    return order

def get_all(user_id):
    orders = order_rep.get_all(user_id)
    return orders


def create(data: CreateOrderServiceDTO):
    video_id = None

    if not data.previous_order_id:
        goods = get_goods_with_sale(data.goods)
        amount = _get_goods_amount(goods)
        if not amount:
            OrderCreationError(detail='Ошибка при подсчете суммы заказа')
    else:
        goods = get_goods_with_sale(data.goods)
        amount = _get_goods_amount(goods)
        if not amount:
            raise OrderCreationError(detail='Ошибка при подсчете суммы заказа')

        order = Order.objects.filter(id=data.previous_order_id).first()
        try:
            video_id = order.video_id
        except:
            raise OrderCreationError(detail='Не нашли видео с предыдущего заказа')

    # Группировка товаров для получения их количества
    grouped = {}
    for gid in data.goods:
        grouped[gid] = grouped.get(gid, 0) + 1
    items = [CreateOrderItemRepoDTO(good_variant_id=gid, quantity=qty) for gid, qty in grouped.items()]

    repo_dto = CreateOrdeRepoDTO(
        user_id=data.user_id,
        items=items,
        video_id=video_id or data.video_id,
        amount=amount,
        comment=data.comment,
        phone=data.phone,
    )

    order_id = order_rep.create(repo_dto)
    if not order_id:
        raise OrderCreationError()
    
    return order_id
   

def get_goods_with_sale(goods: list[int], is_repeated=False) -> list:
    '''Эта функция возвращает товары с итоговой ценой, внутри реализована скидочная система'''

    if not goods:
        raise InvalidGoodsError('Список товаров пуст.')
    total_goods = []

    # id -> {good_name, cost}
    unique_ids = list(set(goods))
    goods_map = {
        obj['id']: {'good__name': obj['good__name'], 'cost': obj['good__cost']}
        for obj in GoodVariant.objects.filter(id__in=unique_ids)
        .select_related("good")
        .values("id", "good__name", "good__cost")
    }
    if len(goods_map) != len(unique_ids):
        missing = set(goods) - set(goods_map.keys())
        if missing:
            raise InvalidGoodsError('Присутствуют недопустимые товары.')

    goods_objects = []
    for gid in goods:
        base = goods_map.get(gid)
        if not base:
            raise InvalidGoodsError('Недопустимый товар.')
        goods_objects.append({'good__name': base['good__name'], 'cost': base['cost']})

    if len(goods_objects) == 1:
        good = goods_objects[0]
        if is_repeated:
            good['cost'] -= 1000
        total_goods.append(good)
    else:
        plastic_busts = 0
        carton_busts = 0

        if is_repeated:
            for obj in goods_objects:
                obj['cost'] -= 1000
                total_goods.append(obj)
            return total_goods

        for obj in goods_objects:
            if obj['good__name'] == "Картонный бюст":
                carton_busts += 1
            else:
                plastic_busts += 1

        plastic_sales = max(plastic_busts - 1, 0)
        carton_sales = min(carton_busts, plastic_busts)
        for obj in goods_objects:
            if obj['good__name'] == "Картонный бюст" and carton_sales > 0:
                obj['cost'] -= 1000
                carton_sales -= 1
            elif obj['good__name'] == "Пластиковый бюст" and plastic_sales > 0:
                obj['cost'] -= 500
                plastic_sales -= 1
            total_goods.append(obj)
    return total_goods

def _get_goods_amount(goods: list, key='cost') -> int:
    sum = 0
    for good in goods:
        sum += good[key]
    return sum
