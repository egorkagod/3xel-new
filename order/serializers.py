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
    class Meta:
        model = Order
        fields = '__all__'
