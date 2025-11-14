from typing import TypedDict
import logging

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
    goods_objects = {
        obj['id']: obj
        for obj in GoodVariant.objects
            .filter(id__in=unique_ids)
            .select_related("good")
            .values('id', 'good__price', 'good__box_sizes', 'good__weight', 'good__name', 'good__size')
    }

    if len(goods_objects) < len(unique_ids):
        raise InvalidGoodsError('Присутствуют недопустимые товары')

    total_goods = []
    for gid in goods:
        obj = goods_objects[gid]
        good: Good = {
            'id': gid,
            'name': obj['good__name'],
            'price': obj['good__price'],
            'discounted_price': obj['good__price'],
            'size': obj['good__size'],
            'box_sizes': list(map(int, obj['good__box_sizes'].split('-'))),
            'weight': obj['good__weight'],
        }
        total_goods.append(good)

    logging.getLogger('order').info(f'Goods: {total_goods}')

    if is_repeated:
        for good in total_goods:
            good['discounted_price'] -= 1000
        return total_goods
    else:
        plastic_busts = 0
        carton_busts = 0
        for good in total_goods:
            if good['name'] == "Картонный бюст":
                carton_busts += 1
            else:
                plastic_busts += 1

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
