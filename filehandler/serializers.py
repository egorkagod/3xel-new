from rest_framework import serializers


class ChunkViewSerializer(serializers.Serializer):
    chunk_number = serializers.IntegerField()
    total_chunks = serializers.IntegerField()
    filename = serializers.CharField()
    chunk = serializers.FileField()