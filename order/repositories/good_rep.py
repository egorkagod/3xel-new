from order.models import Good


def get(id):
    good_variant = Good.objects.filter(pk=id).first()
    return good_variant