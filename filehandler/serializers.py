from rest_framework import serializers


class ChunkViewSerializer(serializers.Serializer):
    chunk = serializers.FileField()
    chunkIndex = serializers.IntegerField()
    totalChunks = serializers.IntegerField()
    fileId = serializers.CharField()
    format = serializers.CharField()


class FileUploadResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    file_id = serializers.IntegerField(required=False)
