from io import BytesIO
from pathlib import Path

from reportlab.pdfgen import canvas
from pypdf import PdfReader, PdfWriter


TEMPLATE_PATH = "media/certificate_template.pdf"
DEFAULT_OUTPUT_PATH = "media/certificate_with_code.pdf"


def generate_certificate(
    promocode: str,
    output_path: str | Path | None = None,
    template_path: str | Path | None = None,
) -> str:
    """
    Накладывает промокод на PDF-шаблон и сохраняет в новый файл.
    Возвращает путь к сгенерированному сертификату.
    """
    if output_path is None:
        output_path = DEFAULT_OUTPUT_PATH
    if template_path is None:
        template_path = TEMPLATE_PATH

    output_path = str(Path(output_path))
    template_path = str(Path(template_path))

    # читаем шаблон целиком в память, чтобы pypdf не
    # обращался к уже закрытому файловому объекту
    with open(template_path, "rb") as f:
        template_bytes = f.read()

    template_reader = PdfReader(BytesIO(template_bytes))

    first_page = template_reader.pages[0]
    mediabox = first_page.mediabox
    width = float(mediabox.width)
    height = float(mediabox.height)

    packet = BytesIO()
    can = canvas.Canvas(packet, pagesize=(width, height))

    can.setFont("Helvetica-Bold", 50)
    can.drawString(580, 485, promocode)
    can.save()

    packet.seek(0)
    overlay_pdf = PdfReader(packet)
    overlay_page = overlay_pdf.pages[0]

    # накладываем текст поверх первой страницы шаблона
    first_page.merge_page(overlay_page)

    writer = PdfWriter()
    writer.add_page(first_page)

    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "wb") as out:
        writer.write(out)

    return output_path


if __name__ == "__main__":
    # пример использования
    path = generate_certificate("5000BABUKA")
    print(f"Сертификат сохранён в: {path}")
