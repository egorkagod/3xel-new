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
    'size': 18, 'price': 4500, 'slug': 'natural_cardboard', 'box_sizes': '35-20-7', 'weight': 1200
}

COLOR_MAP = {
    'Ash Gray': '#B2BEB5',
    'Caramel': '#AF6F09',
    'Charcoal': '#36454F',
    'Dark Blue': '#003366',
    'Dark Brown': '#4B3621',
    'Dark Chocolate': '#381819',
    'Grass Green': '#7CFC00',
    'Ivory White': '#FFFFF0',
    'Lemon Yellow': '#FFF44F',
    'Lilac Purple': '#C8A2C8',
    'Mandarin Orange': '#FF8243',
    'Marine Blue': '#01386A',
    'Natural Cardboard': '#B19876',
    'Sakura Pink': '#FADADD',
    'Scarlet Red': '#FF2400',
    'Sky Blue': '#76D7EA',
}


class Command(BaseCommand):
    help = 'Создание товаров и вариантов с изображениями из каталога (цены и размеры в Good)'

    def handle(self, *args, **options):
        image_groups = self._group_images()
        if not image_groups:
            self.stdout.write(self.style.ERROR('Нет изображений в media/catalog/images'))
            return

        with transaction.atomic():
            # очищаем старые товары
            Good.objects.all().delete()

            # создаём пластиковые
            self._create_plastic_goods(image_groups)

            # создаём картонный
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
            # создаём отдельный Good для каждого размера
            good, _ = Good.objects.update_or_create(
                name=f'Пластиковый бюст {plastic['size']}',
                size=plastic['size'],  # ключевое поле для уникальности
                defaults={
                    'description': f'Пластиковый бюст размером {plastic["size"]} см. Большая карта цветов.',
                    'technology': ['PLA Matte/PETG-CF', 'Премиум-поверхность'],
                    'price': plastic['price'],
                    'box_sizes': plastic['box_sizes'],
                    'weight': plastic['weight']
                },
            )

            # чистим старые варианты
            good.variants.all().delete()

            # создаём все цветовые варианты
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
            size=CARDBOARD_DATA['size'],
            defaults={
                'description': 'Один размер — 18 см. Цвет — натуральный картон.',
                'technology': ['HDF/картон', 'Конструктор'],
                'price': CARDBOARD_DATA['price'],
                'box_sizes': CARDBOARD_DATA['box_sizes'],
                'weight': CARDBOARD_DATA['weight'],
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