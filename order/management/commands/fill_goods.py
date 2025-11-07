import re
from collections import defaultdict
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction

from order.models import Good, GoodVariant, GoodVariantImage


IMAGE_DIR = Path(settings.MEDIA_ROOT) / 'catalog' / 'images'
PLASTIC_DATA = (
    {'size': 12, 'price': 3450, 'box_sizes': '12-12-11', 'weight': 1200},
    {'size': 16, 'price': 4500, 'box_sizes': '19-18-17', 'weight': 1200},
    {'size': 20, 'price': 5200, 'box_sizes': '23-24-21', 'weight': 1200},
)
CARDBOARD_DATA = {
    'size': 18, 'cost': 3500, 'slug': 'natural_cardboard', 'box_sizes': '35-20-7', 'weight': 1200
}

COLOR_MAP = {
    'Apple Green': '#8DB600',       # ярко-зелёный, как кожура яблока
    'Ash Gray': '#B2BEB5',          # мягкий серый с лёгким зеленоватым тоном
    'Bone White': '#E3DAC9',        # слегка тёплый белый с кремовым оттенком
    'Caramel': '#AF6F09',           # насыщенный тёплый карамельный
    'Charcoal': '#36454F',          # глубокий угольно-серый, ближе к графиту
    'Dark Blue': '#003366',         # темно-синий с лёгкой холодной ноткой
    'Dark Brown': '#4B3621',        # густой кофейно-коричневый
    'Dark Chocolate': '#381819',    # насыщенный шоколадный с бордовым подтоном
    'Dark Green': '#013220',        # тёмно-зелёный, близкий к хвое
    'Dark Red': '#8B0000',          # классический насыщенный красно-тёмный
    'Desert Tan': '#CBB994',        # песочно-бежевый, слегка сероватый
    'Grass Green': '#7CFC00',       # травянисто-зелёный, яркий
    'Ice Blue': '#A1CAF1',          # холодный голубой с белым тоном
    'Ivory White': '#FFFFF0',       # классическая "слоновая кость"
    'Latte Brown': '#A67B5B',       # тёплый кофейно-кремовый
    'Lemon Yellow': '#FFF44F',      # чистый лимонный, чуть мягче жёлтого
    'Lilac Purple': '#C8A2C8',      # светло-сиреневый, ближе к пастельному
    'Mandarin Orange': '#FF8243',   # яркий оранжево-мандариновый
    'Marine Blue': '#01386A',       # глубокий морской сине-зелёный
    'Nardo Gray': '#979797',        # типичный автомобильный Nardo Gray (Audi)
    'Natural Cardboard': '#B19876', # натуральный картон — бежево-коричневый
    'Plum': '#8E4585',              # классический сливовый
    'Sakura Pink': '#FADADD',       # нежно-розовый как лепестки сакуры
    'Scarlet Red': '#FF2400',       # яркий алый, без примесей
    'Sky Blue': '#76D7EA',          # чистый небесный, светлее стандартного
}


class Command(BaseCommand):
    help = 'Создание товаров и вариантов с изображениями из каталога (цены и размеры в Good)'

    def handle(self, *args, **options):
        image_groups = self._group_images()
        if not image_groups:
            self.stdout.write(self.style.ERROR('Нет изображений в media/catalog/images'))
            return

        with transaction.atomic():
            # Удаляем старые данные
            Good.objects.all().delete()

            # Создаём пластиковые бюсты для каждого размера
            self._create_plastic_goods(image_groups)

            # Создаём картонный бюст
            self._create_cardboard_good(image_groups)

        self.stdout.write(self.style.SUCCESS('Каталог товаров обновлён'))

    def _group_images(self):
        groups = defaultdict(list)
        if not IMAGE_DIR.exists():
            return {}

        for path in IMAGE_DIR.iterdir():
            if not path.is_file():
                continue
            slug = re.sub(r'\d+$', '', path.stem)
            groups[slug].append(path)

        for slug in groups:
            groups[slug].sort()
        return groups

    def _create_plastic_goods(self, image_groups):
        plastic_slugs = [slug for slug in image_groups.keys() if slug != CARDBOARD_DATA['slug']]

        for plastic in PLASTIC_DATA:
            good, _ = Good.objects.update_or_create(
                name=f'Пластиковый бюст {plastic['size']} см',
                defaults={
                    'description': f'Пластиковый бюст размером {plastic['size']} см. Большая карта цветов.',
                    'technology': ['PLA Matte/PETG-CF', 'Премиум-поверхность'],
                    'size': plastic['size'],
                    'cost': plastic['cost'],
                    'box_sizes': plastic['box_sizes'],
                    'weight': plastic['weight']
                },
            )
            good.variants.all().delete()

            for slug in sorted(plastic_slugs):
                color_name = self._humanize(slug)
                color_hex = COLOR_MAP.get(color_name)
                if not color_hex:
                    self.stdout.write(self.style.WARNING(f'Неизвестный цвет: {color_name}, slug: {slug}'))
                    continue

                variant = GoodVariant.objects.create(
                    good=good,
                    color=color_hex,
                    colorName=color_name,
                )
                self._attach_images(variant, image_groups[slug])

    def _create_cardboard_good(self, image_groups):
        paths = image_groups.get(CARDBOARD_DATA['slug'])
        if not paths:
            self.stdout.write(self.style.WARNING('Нет изображений для картона, пропускаю'))
            return

        good, _ = Good.objects.update_or_create(
            name='Картонный бюст',
            defaults={
                'description': 'Один размер — 18 см. Цвет — натуральный картон.',
                'technology': ['HDF/картон', 'Конструктор'],
                'size': CARDBOARD_DATA['size'],
                'cost': CARDBOARD_DATA['cost'],
            },
        )
        good.variants.all().delete()

        variant = GoodVariant.objects.create(
            good=good,
            color=COLOR_MAP['Natural Cardboard'],
            colorName='Natural Cardboard',
        )
        self._attach_images(variant, paths)

    def _attach_images(self, variant, paths):
        for path in paths:
            relative = path.relative_to(settings.MEDIA_ROOT)
            GoodVariantImage.objects.create(
                variant=variant,
                image=str(relative).replace('\\', '/'),
            )

    def _humanize(self, slug):
        return slug.replace('_', ' ').title()