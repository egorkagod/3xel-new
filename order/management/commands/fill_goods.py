import re
from collections import defaultdict
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction

from order.models import Good, GoodVariant, GoodVariantImage


IMAGE_DIR = Path(settings.MEDIA_ROOT) / 'catalog' / 'images'

PLASTIC_DATA = (
    {'size': 10, 'price': 3500, 'box_sizes': '12-12-11', 'weight': 1200},
    {'size': 12, 'price': 4500, 'box_sizes': '14-15-13', 'weight': 1200},
    {'size': 16, 'price': 7400, 'box_sizes': '19-18-17', 'weight': 1200},
    {'size': 20, 'price': 11800, 'box_sizes': '23-24-21', 'weight': 1200},
)

CARDBOARD_DATA = {
    'size': 18,
    'price': 4500,
    'slug': 'natural_cardboard',
    'box_sizes': '35-20-7',
    'weight': 1200
}

# 🔥 фиксированный порядок цветовых вариантов
PLASTIC_COLOR_ORDER = [
    'Ivory White',
    'Charcoal',
    'Grass Green',
    'Scarlet Red',
    'Dark Blue',
    'Marine Blue',
    'Ash Gray',
    'Caramel',
    'Terracotta',
    'Dark Brown',
    'Lilac Purple',
    'Sakura Pink',
    'Mandarin Orange',
    'Lemon Yellow',
]

# 🔥 правильный словарь HEX-цветов
COLOR_MAP = {
    'Ivory White': '#FFFFF0',
    'Charcoal': '#36454F',
    'Grass Green': '#7CFC00',
    'Scarlet Red': '#FF2400',
    'Dark Blue': '#003366',
    'Marine Blue': '#01386A',
    'Ash Gray': '#B2BEB5',
    'Caramel': '#AF6F09',
    'Terracotta': '#E2725B',
    'Dark Brown': '#4B3621',
    'Lilac Purple': '#C8A2C8',
    'Sakura Pink': '#FADADD',
    'Mandarin Orange': '#FF8243',
    'Lemon Yellow': '#FFF44F',
    'Natural Cardboard': '#B19876',
}


class Command(BaseCommand):
    help = 'Создание товаров и вариантов с изображениями из каталога'

    # ==========================================================
    # ENTRY POINT
    # ==========================================================
    def handle(self, *args, **options):
        image_groups = self._group_images()
        if not image_groups:
            self.stdout.write(self.style.ERROR('Нет изображений в media/catalog/images'))
            return

        with transaction.atomic():
            Good.objects.all().delete()

            self._create_plastic_goods(image_groups)
            self._create_cardboard_good(image_groups)

        self.stdout.write(self.style.SUCCESS('Каталог товаров обновлён'))

    # ==========================================================
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

    # ==========================================================
    # СОЗДАНИЕ ПЛАСТИКОВ
    # ==========================================================
    def _create_plastic_goods(self, image_groups):

        # Сопоставляем slug → humanized
        raw_slugs = {
            slug: self._humanize(slug)
            for slug in image_groups.keys()
            if slug != CARDBOARD_DATA['slug']  # исключаем картон
        }

        # оставляем только цвета из заданного списка
        plastic_slugs = {
            slug: name
            for slug, name in raw_slugs.items()
            if name in PLASTIC_COLOR_ORDER
        }

        for plastic in PLASTIC_DATA:
            good, _ = Good.objects.update_or_create(
                name=f'Пластиковый бюст {plastic["size"]}',
                size=plastic["size"],
                defaults={
                    'description': f'Пластиковый бюст размером {plastic["size"]} см. Большая карта цветов.',
                    'technology': ['PLA Matte/PETG-CF', 'Премиум-поверхность'],
                    'price': plastic['price'],
                    'box_sizes': plastic['box_sizes'],
                    'weight': plastic['weight']
                }
            )

            good.variants.all().delete()

            # создаём варианты строго в указанном порядке
            for color_name in PLASTIC_COLOR_ORDER:
                slug = next((s for s, nm in plastic_slugs.items() if nm == color_name), None)
                if not slug:
                    self.stdout.write(self.style.WARNING(f'Нет изображений для цвета: {color_name}'))
                    continue

                color_hex = COLOR_MAP.get(color_name)
                if not color_hex:
                    self.stdout.write(self.style.WARNING(f'Нет HEX для цвета: {color_name}'))
                    continue

                variant = GoodVariant.objects.create(
                    good=good,
                    color=color_hex,
                    colorName=color_name,
                )

                self._attach_images(variant, image_groups[slug])

    # ==========================================================
    # КАРТОННЫЙ ТОВАР
    # ==========================================================
    def _create_cardboard_good(self, image_groups):
        paths = image_groups.get(CARDBOARD_DATA['slug'])
        if not paths:
            self.stdout.write(self.style.WARNING('Нет изображений для картона'))
            return

        good, _ = Good.objects.update_or_create(
            name='Картонный бюст',
            size=CARDBOARD_DATA['size'],
            defaults={
                'description': 'Один размер — 18 см. Цвет — натуральный картон.',
                'technology': ['HDF/картон', 'Конструктор'],
                'price': CARDBOARD_DATA['price'],
                'box_sizes': CARDBOARD_DATA['box_sizes'],
                'weight': CARDBOARD_DATA['weight'],
            }
        )

        good.variants.all().delete()

        variant = GoodVariant.objects.create(
            good=good,
            color=COLOR_MAP['Natural Cardboard'],
            colorName='Natural Cardboard',
        )
        self._attach_images(variant, paths)

    # ==========================================================
    def _attach_images(self, variant, paths):
        for path in paths:
            relative = path.relative_to(settings.MEDIA_ROOT)
            GoodVariantImage.objects.create(
                variant=variant,
                image=str(relative).replace("\\", "/"),
            )

    # ==========================================================
    def _humanize(self, slug):
        return slug.replace('_', ' ').title()