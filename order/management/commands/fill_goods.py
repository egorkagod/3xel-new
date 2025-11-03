import re
from collections import defaultdict
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction

from order.models import Good, GoodVariant, GoodVariantImage


IMAGE_DIR = Path(settings.MEDIA_ROOT) / 'catalog' / 'images'
PLASTIC_SIZES = (
    (12, 3450),
    (16, 4500),
    (20, 5200),
)
CARDBOARD_SIZE = 18
CARDBOARD_COST = 3500
CARDBOARD_SLUG = 'natural_cardboard'

COLOR_MAP = {
    'Apple Green': '#8DB255',
    'Ash Gray': '#B2BEB5',
    'Bone White': '#E3DAC9',
    'Caramel': '#AF6E4D',
    'Charcoal': '#36454F',
    'Dark Blue': '#1B365D',
    'Dark Brown': '#5C4033',
    'Dark Chocolate': '#490206',
    'Dark Green': '#015D52',
    'Dark Red': '#8B0000',
    'Desert Tan': '#D2B48C',
    'Grass Green': '#7CFC00',
    'Ice Blue': '#AFDBF5',
    'Ivory White': '#FFFFF0',
    'Latte Brown': '#A1866F',
    'Lemon Yellow': '#FFF44F',
    'Lilac Purple': '#C8A2C8',
    'Mandarin Orange': '#F37A48',
    'Marine Blue': '#3B9C9C',
    'Nardo Gray': '#686A6C',
    'Natural Cardboard': '#A1866F',
    'Plum': '#8E4585',
    'Sakura Pink': '#FCC8D1',
    'Scarlet Red': '#FF2400',
    'Sky Blue': '#87CEEB',
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
        plastic_slugs = [slug for slug in image_groups.keys() if slug != CARDBOARD_SLUG]

        for size, cost in PLASTIC_SIZES:
            good, _ = Good.objects.update_or_create(
                name=f'Пластиковый бюст {size} см',
                defaults={
                    'description': f'Пластиковый бюст размером {size} см. Большая карта цветов.',
                    'technology': ['PLA Matte/PETG-CF', 'Премиум-поверхность'],
                    'size': size,
                    'cost': cost,
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
        paths = image_groups.get(CARDBOARD_SLUG)
        if not paths:
            self.stdout.write(self.style.WARNING('Нет изображений для картона, пропускаю'))
            return

        good, _ = Good.objects.update_or_create(
            name='Картонный бюст',
            defaults={
                'description': 'Один размер — 18 см. Цвет — натуральный картон.',
                'technology': ['HDF/картон', 'Конструктор'],
                'size': CARDBOARD_SIZE,
                'cost': CARDBOARD_COST,
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