import re
from collections import defaultdict
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction
from PIL import Image

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


class Command(BaseCommand):
    help = 'Создание товаров и вариантов с изображениями из каталога'

    def handle(self, *args, **options):
        image_groups = self._group_images()
        if not image_groups:
            self.stdout.write(self.style.ERROR('Нет изображений в media/catalog/images'))
            return

        plastic_good, _ = Good.objects.update_or_create(
            name='3D модель из PLA-пластика',
            defaults={
                'description': '3D-печать из PLA-пластика.',
            },
        )
        cardboard_good, _ = Good.objects.update_or_create(
            name='Конструктор из картона',
            defaults={
                'description': '',
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
            color_hex = self._detect_color(paths[0])
            color_name = self._humanize(slug)
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
            color=self._detect_color(paths[0]),
            colorName=self._humanize(CARDBOARD_SLUG),
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

    def _detect_color(self, path):
        with Image.open(path) as img:
            pixel = img.convert('RGB').resize((1, 1)).getpixel((0, 0))
        return '#{0:02X}{1:02X}{2:02X}'.format(*pixel)
