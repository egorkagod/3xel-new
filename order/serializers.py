from rest_framework import serializers

from .models import Good, GoodVariant, Order, OrderItem

# GoodVariant

class GoodVariantModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoodVariant
        fields = ['id', 'size', 'color', 'image', 'price']

# Good

class GoodModelSerializer(serializers.ModelSerializer):
    variants = GoodVariantModelSerializer(many=True, read_only=True)

    class Meta:
        model = Good
        fields = ['id', 'name', 'description', 'variants']

# OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    good_variant = GoodVariantModelSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'good_variant', 'quantity']

# Order

class OrderViewSerializer(serializers.Serializer):
    goods = serializers.ListField()
    video_id = serializers.IntegerField()
    amount = serializers.IntegerField()


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
