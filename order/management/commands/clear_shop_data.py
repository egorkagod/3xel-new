from django.core.management.base import BaseCommand
from django.db import transaction, connection
from django.conf import settings
from pathlib import Path
import shutil

from order.models import Order, OrderItem, Good, GoodVariant, GoodVariantImage


class Command(BaseCommand):
    help = "Delete all orders and goods (Good, GoodVariant, GoodVariantImage, Order, OrderItem). Optionally remove media/orders folder."

    def add_arguments(self, parser):
        parser.add_argument(
            "--yes-i-am-sure",
            action="store_true",
            dest="yes",
            help="Confirm destructive operation",
        )
        parser.add_argument(
            "--with-media",
            action="store_true",
            dest="with_media",
            help="Also remove MEDIA_ROOT/orders folder",
        )

    def handle(self, *args, **options):
        if not options.get("yes"):
            self.stderr.write(self.style.ERROR("Refusing to run without --yes-i-am-sure"))
            return

        with transaction.atomic():
            deleted = 0
            # Delete in safe order
            for model in (OrderItem, Order, GoodVariantImage, GoodVariant, Good):
                c, _ = model.objects.all().delete()
                deleted += c
                self.stdout.write(self.style.WARNING(f"Deleted {c} rows from {model._meta.label}"))

        # Optionally remove media/orders
        if options.get("with_media"):
            orders_dir = Path(settings.MEDIA_ROOT) / 'orders'
            if orders_dir.exists():
                shutil.rmtree(orders_dir, ignore_errors=True)
                self.stdout.write(self.style.WARNING(f"Removed {orders_dir}"))

        # Try to reset sequences (PostgreSQL only)
        try:
            table_names = [
                Order._meta.db_table,
                OrderItem._meta.db_table,
                Good._meta.db_table,
                GoodVariant._meta.db_table,
                GoodVariantImage._meta.db_table,
            ]
            with connection.cursor() as cursor:
                for table in table_names:
                    cursor.execute(
                        "SELECT pg_get_serial_sequence(%s, 'id')",
                        [table],
                    )
                    seq = cursor.fetchone()[0]
                    if seq:
                        cursor.execute(f"ALTER SEQUENCE {seq} RESTART WITH 1")
                        self.stdout.write(self.style.SUCCESS(f"Reset sequence {seq}"))
        except Exception:
            # Non‑critical; ignore on non‑PG backends
            pass

        self.stdout.write(self.style.SUCCESS("Shop data cleared."))

