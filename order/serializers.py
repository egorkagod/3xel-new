from rest_framework import serializers

from .models import Good, GoodVariant, Order, OrderItem

# GoodVariant

class GoodVariantModelSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    type = serializers.CharField(source='good.name', read_only=True)

    class Meta:
        model = GoodVariant
        fields = ['id', 'size', 'color', 'colorName', 'cost', 'images', 'type']

    def get_images(self, obj):
        request = self.context.get('request')
        urls = [image.image.url for image in obj.images.all()]
        if request:
            return [request.build_absolute_uri(url) for url in urls]
        return urls

# Good

class GoodModelSerializer(serializers.ModelSerializer):
    variants = GoodVariantModelSerializer(many=True, read_only=True)

    class Meta:
        model = Good
        fields = ['id', 'name', 'description', 'technology', 'variants']

# OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    good_variant = GoodVariantModelSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'good_variant', 'quantity']

# Order

class OrderViewSerializer(serializers.Serializer):
    goods = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        allow_empty=False,
    )
    video_id = serializers.IntegerField()


class OrderModelSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment_status = serializers.CharField(source='payment.get_status_display')
    status = serializers.CharField(source='get_status_display')
    created_at = serializers.CharField(source='formatted_created_at')

    class Meta:
        model = Order
        fields = ['id', 'items', 'payment_status', 'amount', 'status', 'video', 'created_at']


class OrderPreviewSerializer(serializers.ModelSerializer):
    payment_status = serializers.CharField(source='payment.get_status_display')
    status = serializers.CharField(source='get_status_display')
    created_at = serializers.CharField(source='formatted_created_at')

    class Meta:
        model = Order
        fields = ['id', 'status', 'amount', 'created_at', 'payment_status']


class PaymentInitResponseSerializer(serializers.Serializer):
    payment_url = serializers.CharField()
