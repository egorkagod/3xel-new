from rest_framework import serializers

from .models import Good, GoodVariant, Order, OrderItem

# GoodVariant

class GoodVariantModelSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    type = serializers.CharField(source='good.name', read_only=True)
    size = serializers.IntegerField(source='good.size', read_only=True)
    price = serializers.IntegerField(source='good.price', read_only=True)

    class Meta:
        model = GoodVariant
        fields = ['id', 'color', 'colorName', 'images', 'type', 'size', 'price']

    def get_images(self, obj):
        request = self.context.get('request')
        urls = []
        for image in obj.images.all():
            try:
                url = image.image.url
            except Exception:
                # Если у изображения нет файла — пропускаем, чтобы не ронять 500
                continue
            if request:
                urls.append(request.build_absolute_uri(url))
            else:
                urls.append(url)
        return urls

# Good

class GoodModelSerializer(serializers.ModelSerializer):
    cost = serializers.IntegerField(source='price')
    variants = GoodVariantModelSerializer(many=True, read_only=True)

    class Meta:
        model = Good
        fields = ['id', 'name', 'box_sizes', 'weight', 'cost', 'size', 'description', 'technology', 'variants']

# OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    good_variant = GoodVariantModelSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'good_variant', 'quantity']

# Order




class OrderViewSerializer(serializers.Serializer):
    goods = serializers.ListField(child=serializers.IntegerField(min_value=1), allow_empty=False)
    # Может прийти либо id файла, либо ссылка
    video_id = serializers.CharField(required=False, allow_blank=True, default=None)
    order_id = serializers.IntegerField(required=False, default=None)
    name = serializers.CharField()
    surname = serializers.CharField()
    patronymic = serializers.CharField()
    address = serializers.CharField()
    phone = serializers.CharField()
    wishes = serializers.CharField(allow_blank=True, default='')


class OrderModelSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment_status = serializers.SerializerMethodField()
    status = serializers.CharField(source='get_status_display')
    created_at = serializers.CharField(source='formatted_created_at')

    class Meta:
        model = Order
        fields = ['id', 'items', 'payment_status', 'amount', 'status', 'video', 'created_at']
    
    def get_payment_status(self, obj):
        payment = getattr(obj, 'payment', None)
        if payment:
            return payment.get_status_display()
        return None


class OrderPreviewSerializer(serializers.ModelSerializer):
    payment_status = serializers.SerializerMethodField()
    status = serializers.CharField(source='get_status_display')
    created_at = serializers.CharField(source='formatted_created_at')

    class Meta:
        model = Order
        fields = ['id', 'status', 'amount', 'created_at', 'payment_status']
    
    def get_payment_status(self, obj):
        payment = getattr(obj, 'payment', None)
        if payment:
            return payment.get_status_display()
        return None


class PaymentInitResponseSerializer(serializers.Serializer):
    payment_url = serializers.CharField()
