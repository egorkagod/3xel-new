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

# Цвета, прописанные вручную по ColorName
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
    help = 'Создание товаров и вариантов с изображениями из каталога (цвета заданы вручную)'

    def handle(self, *args, **options):
        image_groups = self._group_images()
        if not image_groups:
            self.stdout.write(self.style.ERROR('Нет изображений в media/catalog/images'))
            return

        plastic_good, _ = Good.objects.update_or_create(
            name='Пластиковый бюст',
            defaults={
                'description': 'Размеры: 12 / 16 / 20 см. Большая карта цветов.',
                'technology': ['PLA Matte/PETG-CF', 'Премиум-поверхность'],
            },
        )
        cardboard_good, _ = Good.objects.update_or_create(
            name='Картонный бюст',
            defaults={
                'description': 'Один размер — 18 см. Цвет — натуральный картон.',
                'technology': ['HDF/картон', 'Конструктор'],
            },
        )

        with transaction.atomic():
            plastic_good.variants.all().delete()
            cardboard_good.variants.all().delete()

            self._create_plastic_variants(plastic_good, image_groups)
            self._create_cardboard_variant(cardboard_good, image_groups)

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

    def _create_plastic_variants(self, good, image_groups):
        plastic_slugs = [slug for slug in image_groups.keys() if slug != CARDBOARD_SLUG]
        for slug in sorted(plastic_slugs):
            paths = image_groups[slug]
            color_name = self._humanize(slug)
            color_hex = COLOR_MAP.get(color_name)
            if not color_hex:
                self.stdout.write(self.style.WARNING(f'Неизвестный цвет: {color_name}, slug: {slug}'))
                continue
            for size, cost in PLASTIC_SIZES:
                variant = GoodVariant.objects.create(
                    good=good,
                    size=size,
                    color=color_hex,
                    colorName=color_name,
                    cost=cost,
                )
                self._attach_images(variant, paths)

    def _create_cardboard_variant(self, good, image_groups):
        paths = image_groups.get(CARDBOARD_SLUG)
        if not paths:
            self.stdout.write(self.style.WARNING('Нет изображений для картона, пропускаю'))
            return

        variant = GoodVariant.objects.create(
            good=good,
            size=CARDBOARD_SIZE,
            color=COLOR_MAP['Natural Cardboard'],
            colorName='Natural Cardboard',
            cost=CARDBOARD_COST,
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