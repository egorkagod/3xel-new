from django.core.management.base import BaseCommand
from django.core.files import File
from django.conf import settings
from order.models import Good, GoodVariant

class Command(BaseCommand):
    help = 'Создание товаров их видов'

    def handle(self, *args, **options):
        goods = [
            {
                'name': "3D модель из PLA-пластика",
                'description': '3D-печать из PLA-пластика.',
            },
            {
                'name': 'Конструктор из картона',
                'description': '',
            }
        ]
        plastic_good = Good.objects.create(**goods[0])
        carton_good = Good.objects.create(**goods[1])
        good_variants = [
            {'size': 10, 'color': 'rgb(0, 0, 0)', 'price': 3200, 'image': 'catalog/images/black.jpeg', 'good': plastic_good},
            {'size': 12, 'color': 'rgb(0, 0, 0)', 'price': 3450, 'image': 'catalog/images/black.jpeg', 'good': plastic_good},
            {'size': 14, 'color': 'rgb(0, 0, 0)', 'price': 3800, 'image': 'catalog/images/black.jpeg', 'good': plastic_good},
            {'size': 16, 'color': 'rgb(0, 0, 0)', 'price': 4200, 'image': 'catalog/images/black.jpeg', 'good': plastic_good},
            {'size': 18, 'color': 'rgb(0, 0, 0)', 'price': 4700, 'image': 'catalog/images/black.jpeg', 'good': plastic_good},
            {'size': 20, 'color': 'rgb(0, 0, 0)', 'price': 5200, 'image': 'catalog/images/black.jpeg', 'good': plastic_good},
            {'size': 10, 'color': 'rgb(1, 99, 206)', 'price': 3200, 'image': 'catalog/images/blue.jpeg', 'good': plastic_good},
            {'size': 12, 'color': 'rgb(1, 99, 206)', 'price': 3450, 'image': 'catalog/images/blue.jpeg', 'good': plastic_good},
            {'size': 14, 'color': 'rgb(1, 99, 206)', 'price': 3800, 'image': 'catalog/images/blue.jpeg', 'good': plastic_good},
            {'size': 16, 'color': 'rgb(1, 99, 206)', 'price': 4200, 'image': 'catalog/images/blue.jpeg', 'good': plastic_good},
            {'size': 18, 'color': 'rgb(1, 99, 206)', 'price': 4700, 'image': 'catalog/images/blue.jpeg', 'good': plastic_good},
            {'size': 20, 'color': 'rgb(1, 99, 206)', 'price': 5200, 'image': 'catalog/images/blue.jpeg', 'good': plastic_good},
            {'size': 10, 'color': 'rgb(117, 122, 126)', 'price': 3200, 'image': 'catalog/images/gray.jpeg', 'good': plastic_good},
            {'size': 12, 'color': 'rgb(117, 122, 126)', 'price': 3450, 'image': 'catalog/images/gray.jpeg', 'good': plastic_good},
            {'size': 14, 'color': 'rgb(117, 122, 126)', 'price': 3800, 'image': 'catalog/images/gray.jpeg', 'good': plastic_good},
            {'size': 16, 'color': 'rgb(117, 122, 126)', 'price': 4200, 'image': 'catalog/images/gray.jpeg', 'good': plastic_good},
            {'size': 18, 'color': 'rgb(117, 122, 126)', 'price': 4700, 'image': 'catalog/images/gray.jpeg', 'good': plastic_good},
            {'size': 20, 'color': 'rgb(117, 122, 126)', 'price': 5200, 'image': 'catalog/images/gray.jpeg', 'good': plastic_good},
            {'size': 10, 'color': 'rgb(146, 57, 27)', 'price': 3200, 'image': 'catalog/images/brown.jpeg', 'good': plastic_good},
            {'size': 12, 'color': 'rgb(146, 57, 27)', 'price': 3450, 'image': 'catalog/images/brown.jpeg', 'good': plastic_good},
            {'size': 14, 'color': 'rgb(146, 57, 27)', 'price': 3800, 'image': 'catalog/images/brown.jpeg', 'good': plastic_good},
            {'size': 16, 'color': 'rgb(146, 57, 27)', 'price': 4200, 'image': 'catalog/images/brown.jpeg', 'good': plastic_good},
            {'size': 18, 'color': 'rgb(146, 57, 27)', 'price': 4700, 'image': 'catalog/images/brown.jpeg', 'good': plastic_good},
            {'size': 20, 'color': 'rgb(146, 57, 27)', 'price': 5200, 'image': 'catalog/images/brown.jpeg', 'good': plastic_good},
            {'size': 10, 'color': 'rgb(228, 208, 0)', 'price': 3200, 'image': 'catalog/images/yellow.jpeg', 'good': plastic_good},
            {'size': 12, 'color': 'rgb(228, 208, 0)', 'price': 3450, 'image': 'catalog/images/yellow.jpeg', 'good': plastic_good},
            {'size': 14, 'color': 'rgb(228, 208, 0)', 'price': 3800, 'image': 'catalog/images/yellow.jpeg', 'good': plastic_good},
            {'size': 16, 'color': 'rgb(228, 208, 0)', 'price': 4200, 'image': 'catalog/images/yellow.jpeg', 'good': plastic_good},
            {'size': 18, 'color': 'rgb(228, 208, 0)', 'price': 4700, 'image': 'catalog/images/yellow.jpeg', 'good': plastic_good},
            {'size': 20, 'color': 'rgb(228, 208, 0)', 'price': 5200, 'image': 'catalog/images/yellow.jpeg', 'good': plastic_good},
            {'size': 10, 'color': 'rgb(236, 105, 17)', 'price': 3200, 'image': 'catalog/images/orange.jpeg', 'good': plastic_good},
            {'size': 12, 'color': 'rgb(236, 105, 17)', 'price': 3450, 'image': 'catalog/images/orange.jpeg', 'good': plastic_good},
            {'size': 14, 'color': 'rgb(236, 105, 17)', 'price': 3800, 'image': 'catalog/images/orange.jpeg', 'good': plastic_good},
            {'size': 16, 'color': 'rgb(236, 105, 17)', 'price': 4200, 'image': 'catalog/images/orange.jpeg', 'good': plastic_good},
            {'size': 18, 'color': 'rgb(236, 105, 17)', 'price': 4700, 'image': 'catalog/images/orange.jpeg', 'good': plastic_good},
            {'size': 20, 'color': 'rgb(236, 105, 17)', 'price': 5200, 'image': 'catalog/images/orange.jpeg', 'good': plastic_good},
            {'size': 10, 'color': 'rgb(240, 67, 60)', 'price': 3200, 'image': 'catalog/images/red.jpeg', 'good': plastic_good},
            {'size': 12, 'color': 'rgb(240, 67, 60)', 'price': 3450, 'image': 'catalog/images/red.jpeg', 'good': plastic_good},
            {'size': 14, 'color': 'rgb(240, 67, 60)', 'price': 3800, 'image': 'catalog/images/red.jpeg', 'good': plastic_good},
            {'size': 16, 'color': 'rgb(240, 67, 60)', 'price': 4200, 'image': 'catalog/images/red.jpeg', 'good': plastic_good},
            {'size': 18, 'color': 'rgb(240, 67, 60)', 'price': 4700, 'image': 'catalog/images/red.jpeg', 'good': plastic_good},
            {'size': 20, 'color': 'rgb(240, 67, 60)', 'price': 5200, 'image': 'catalog/images/red.jpeg', 'good': plastic_good},
            {'size': 10, 'color': 'rgb(237, 229, 216)', 'price': 3200, 'image': 'catalog/images/beige.jpeg', 'good': plastic_good},
            {'size': 12, 'color': 'rgb(237, 229, 216)', 'price': 3450, 'image': 'catalog/images/beige.jpeg', 'good': plastic_good},
            {'size': 14, 'color': 'rgb(237, 229, 216)', 'price': 3800, 'image': 'catalog/images/beige.jpeg', 'good': plastic_good},
            {'size': 16, 'color': 'rgb(237, 229, 216)', 'price': 4200, 'image': 'catalog/images/beige.jpeg', 'good': plastic_good},
            {'size': 18, 'color': 'rgb(237, 229, 216)', 'price': 4700, 'image': 'catalog/images/beige.jpeg', 'good': plastic_good},
            {'size': 20, 'color': 'rgb(237, 229, 216)', 'price': 5200, 'image': 'catalog/images/beige.jpeg', 'good': plastic_good},
            {'size': 10, 'color': 'rgb(178, 118, 170)', 'price': 3200, 'image': 'catalog/images/pink.jpeg', 'good': plastic_good},
            {'size': 12, 'color': 'rgb(178, 118, 170)', 'price': 3450, 'image': 'catalog/images/pink.jpeg', 'good': plastic_good},
            {'size': 14, 'color': 'rgb(178, 118, 170)', 'price': 3800, 'image': 'catalog/images/pink.jpeg', 'good': plastic_good},
            {'size': 16, 'color': 'rgb(178, 118, 170)', 'price': 4200, 'image': 'catalog/images/pink.jpeg', 'good': plastic_good},
            {'size': 18, 'color': 'rgb(178, 118, 170)', 'price': 4700, 'image': 'catalog/images/pink.jpeg', 'good': plastic_good},
            {'size': 20, 'color': 'rgb(178, 118, 170)', 'price': 5200, 'image': 'catalog/images/pink.jpeg', 'good': plastic_good},
            {'size': 10, 'color': 'rgb(47, 180, 71)', 'price': 3200, 'image': 'catalog/images/green.jpeg', 'good': plastic_good},
            {'size': 12, 'color': 'rgb(47, 180, 71)', 'price': 3450, 'image': 'catalog/images/green.jpeg', 'good': plastic_good},
            {'size': 14, 'color': 'rgb(47, 180, 71)', 'price': 3800, 'image': 'catalog/images/green.jpeg', 'good': plastic_good},
            {'size': 16, 'color': 'rgb(47, 180, 71)', 'price': 4200, 'image': 'catalog/images/green.jpeg', 'good': plastic_good},
            {'size': 18, 'color': 'rgb(47, 180, 71)', 'price': 4700, 'image': 'catalog/images/green.jpeg', 'good': plastic_good},
            {'size': 20, 'color': 'rgb(47, 180, 71)', 'price': 5200, 'image': 'catalog/images/green.jpeg', 'good': plastic_good},
            {'size': 18, 'color': 'rgb(167, 106, 56)', 'price': 3500, 'image': 'catalog/images/carton.jpeg', 'good': carton_good},
        ]
        for item in good_variants:
            full_path = settings.MEDIA_ROOT / item['image']
            with open(full_path, 'rb') as img_file:
                GoodVariant.objects.create(
                    good=item['good'],
                    size=item['size'],
                    color=item['color'],
                    price=item['price'],
                    image=File(img_file),
                )