from rest_framework import serializers


class InitPaySerializer(serializers.Serializer):
    success = serializers.BooleanField(source='Success')
    error_code = serializers.IntegerField(source='ErrorCode')
    terminal_key = serializers.CharField(source='TerminalKey')
    status = serializers.CharField(source='Status')
    payment_id = serializers.CharField(source='PaymentId')
    order_id = serializers.CharField(source='OrderId')
    amount = serializers.IntegerField(source='Amount')
    payment_url = serializers.CharField(source='PaymentURL')