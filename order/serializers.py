from rest_framework import serializers

from .models import Good, GoodVariant, Order

# APIView serializers

class OrderViewSerializer(serializers.Serializer):
    goods = serializers.ListField()
    video_id = serializers.IntegerField()
    amount = serializers.IntegerField()

# Model serializers

class GoodVariantModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoodVariant
        fields = '__all__'


class GoodModelSerializer(serializers.ModelSerializer):
    variants = GoodVariantModelSerializer(many=True, read_only=True)

    class Meta:
        model = Good
        fields = '__all__'


class OrderModelSerializer(serializers.ModelSerializer):
    payment_status = serializers.CharField(source='payment.get_status_display')
    status = serializers.CharField(source='get_status_display')

    class Meta:
        model = Order
        fields = ['id', 'status', 'amount', 'formatted_created_at', 'payment_status']
