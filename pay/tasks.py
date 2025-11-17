import logging
from pathlib import Path

from celery import shared_task
from django.conf import settings

from order.models import Order
from pay.cert_generate import generate_certificate
from pay.models import PromocodeType
from root.repositories import email_rep


@shared_task
def send_digital_certs(payment_id: int):
    logger = logging.getLogger("pay")
    logger.info("Начинаю генерировать и отправлять цифровые сертификаты для платежа %s", payment_id)

    order = (
        Order.objects.filter(payment_id=payment_id)
        .select_related("user")
        .prefetch_related("certificates")
        .first()
    )

    if not order:
        logger.warning("Заказ по платежу %s не найден", payment_id)
        return

    digital_certs = order.certificates.filter(type=PromocodeType.DIGITAL.value)

    if not digital_certs.exists():
        logger.info("У заказа %s нет цифровых сертификатов", order.id)
        return

    media_root = Path(settings.MEDIA_ROOT)
    certs_dir = media_root / "orders" / str(order.id) / "certs"
    certs_dir.mkdir(parents=True, exist_ok=True)

    attachments: list[dict] = []

    for cert in digital_certs:
        output_path = certs_dir / f"{cert.promo}.pdf"
        try:
            pdf_path = generate_certificate(str(cert.promo), output_path=str(output_path))
        except Exception as exc:
            logger.exception("Ошибка при генерации сертификата %s для заказа %s: %s", cert.promo, order.id, exc)
            continue

        attachments.append(
            {
                "path": pdf_path,
                "filename": output_path.name,
                "mimetype": "application/pdf",
            }
        )

    if not attachments:
        logger.warning("Не удалось сгенерировать ни одного сертификата для заказа %s", order.id)
        return

    recipient_email = getattr(order.user, "email", None)
    if not recipient_email:
        logger.warning("У заказа %s отсутствует email пользователя, отправка сертификатов невозможна", order.id)
        return

    email_rep.send_with_attachment(recipient_email, attachments)
    logger.info("Цифровые сертификаты для заказа %s отправлены на %s", order.id, recipient_email)
