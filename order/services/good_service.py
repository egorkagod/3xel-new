from typing import TypedDict

from order.models import GoodVariant
from order.exceptions import InvalidGoodsError


class Good(TypedDict):
    id: int
    name: str
    price: int
    discounted_price: int
    size: int
    box_sizes: list[int]
    weight: int


def get_all_goods_info(goods: list[int], is_repeated=False) -> list[dict]:
    '''Эта функция возвращает товары с итоговой ценой и информацией, внутри реализована скидочная система'''

    if not goods:
        raise InvalidGoodsError('Список товаров пуст.')

    # Формируем структуру
    unique_ids = set(goods)
    goods_objects = list(GoodVariant.objects
        .filter(id__in=unique_ids)
        .select_related("good")
        .values('id', 'good__price', 'good__box_sizes', 'good__weight', 'good__name', 'good__size')
    )

    if len(goods_objects) < len(unique_ids):
        raise InvalidGoodsError('Присутствуют недопустимые товары')
    
    goods_map = {}
    for obj in goods_objects:
        good: Good = {
            'id': obj['id'],
            'name': obj['good__name'],
            'price': obj['good__price'],
            'discounted_price': obj['good__price'],
            'size': obj['good__size'],
            'box_sizes': list(map(int, obj['good__box_sizes'].split('-'))),
            'weight': obj['good__weight'],
        }
        goods_map[obj['id']] = good

    total_goods = [
        goods_map[id] for id in goods
    ]

    # Подсчитываем скидочную стоимость
    plastic_busts = 0
    carton_busts = 0
    for good in total_goods:
        if good['name'] == "Картонный бюст":
            carton_busts += 1
        else:
            plastic_busts += 1

    if len(total_goods) == 1:
        if is_repeated:
            total_goods[0]['discounted_price'] -= 1000
    else:
        if is_repeated:
            for good in total_goods:
                good['discounted_price'] -= 1000
            return total_goods

        plastic_sales = max(plastic_busts - 1, 0)
        carton_sales = min(carton_busts, plastic_busts)
        for good in total_goods:
            if good['name'] == "Картонный бюст" and carton_sales > 0:
                good['discounted_price'] -= 1000
                carton_sales -= 1
            elif good['name'] == "Пластиковый бюст" and plastic_sales > 0:
                good['discounted_price'] -= 500
                plastic_sales -= 1
    return total_goods


def get_goods_amount(goods: list[dict], key='discounted_price') -> int:
    sum = 0
    for good in goods:
        sum += good[key]
    return sum
