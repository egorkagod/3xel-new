from django.contrib.auth.models import User
from django.conf import settings
from pathlib import Path
import shutil

from order.models import Order, OrderItem, GoodVariant
from filehandler.models import File
from order.dto.order import CreateOrdeRepoDTO


def create(data: CreateOrdeRepoDTO) -> int | None:
    video = File.objects.filter(id=data.video_id).first()
    if video:
        order = Order.objects.create(
            user_id=data.user_id,
            amount=data.amount,
            video=video,
            comment=(data.comment or ''),
            phone=data.phone,
            address=data.full_address,
        )
        for item in data.items:
            good_variant = GoodVariant.objects.filter(pk=item.good_variant_id).first()
            if good_variant:
                OrderItem.objects.create(
                    order=order,
                    good_variant=good_variant,
                    quantity=item.quantity,
                )
        _place_video_into_order_folder(order, video)
        return order.id
    return None

def get(user_id: int, order_id: int):
    user = User.objects.filter(pk=user_id).first()
    if user:
        order = user.orders.filter(pk=order_id).first()
        if order:
            return order
    return None

def get_all(user_id: int):
    user = User.objects.filter(pk=user_id).first()
    if user:
        orders = user.orders.all()
        return orders 

"""Grouping now happens in service layer; keep repo lean."""


def _place_video_into_order_folder(order: Order, file: File):
    """Move uploaded video into per-order folder and rename to 'video.<ext>'.
    Updates File.path accordingly, preserving admin download links.
    """
    path = getattr(file, 'path', None)
    if not path:
        return
    media_url = settings.MEDIA_URL.rstrip('/')
    # Strip domain if accidentally stored with full URL
    rel = path
    # Expecting paths like '/media/uploads/<...>' or '/uploads/<...>'
    if media_url and rel.startswith(media_url):
        rel = rel[len(media_url):]
    if rel.startswith('/'):
        rel = rel[1:]

    src_abs = Path(settings.MEDIA_ROOT) / rel
    if not src_abs.exists():
        return

    ext = src_abs.suffix
    dest_rel = Path('orders') / str(order.id) / f'video{ext}'
    dest_abs = Path(settings.MEDIA_ROOT) / dest_rel
    dest_abs.parent.mkdir(parents=True, exist_ok=True)

    # If file is shared with other orders, copy and create a new File object
    linked_orders = getattr(file, 'order_set', None)
    link_count = linked_orders.count() if linked_orders is not None else 0
    needs_copy = link_count > 1 or ('/orders/' in str(file.path) and f"/orders/{order.id}/" not in str(file.path))

    def build_url(relpath: Path) -> str:
        url = f"{settings.MEDIA_URL.rstrip('/')}/{'/'.join(relpath.parts)}"
        return url if url.startswith('/') else '/' + url

    if needs_copy:
        # Copy file to new destination and create new File record; re-link order
        shutil.copy2(str(src_abs), str(dest_abs))
        new_file = File.objects.create(
            user_id=order.user_id,
            name=f'order-{order.id}-video{ext}',
            path=build_url(dest_rel),
        )
        order.video = new_file
        order.save(update_fields=['video'])
    else:
        # Move file to destination and update existing File record
        try:
            shutil.move(str(src_abs), str(dest_abs))
        except Exception:
            shutil.copy2(str(src_abs), str(dest_abs))
            try:
                src_abs.unlink()
            except Exception:
                pass
        file.name = f'order-{order.id}-video{ext}'
        file.path = build_url(dest_rel)
        file.save(update_fields=['name', 'path'])
