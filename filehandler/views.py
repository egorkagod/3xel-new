from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiResponse

from online_shop.schema import ErrorResponseSerializer

from . import statuses

from .repositories import file_rep
from .serializers import ChunkViewSerializer, FileUploadResponseSerializer


class UploadFileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    @extend_schema(
        operation_id='upload_file_chunk',
        summary='Загрузка файла по частям',
        description='Принимает очередной чанк файла и собирает итоговый файл после получения всех частей.',
        request=ChunkViewSerializer,
        responses={
            status.HTTP_200_OK: OpenApiResponse(
                response=FileUploadResponseSerializer,
                description='Чанк принят. После загрузки всех частей возвращается `file_id`.'
            ),
            status.HTTP_500_INTERNAL_SERVER_ERROR: OpenApiResponse(
                response=ErrorResponseSerializer,
                description='Ошибка при сохранении чанка.'
            ),
        },
    )
    def post(self, request):
        serializer = ChunkViewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        filename = serializer.validated_data['fileId']
        chunk = serializer.validated_data['chunk'].read()
        chunk_number = serializer.validated_data['chunkIndex']
        total_chunks = serializer.validated_data['totalChunks']
        format = serializer.validated_data['format']
        
        user_id = request.user.id
        file_id, result = file_rep.upload_chunk(user_id, filename, format, chunk, chunk_number, total_chunks)
        if result == statuses.ALL_UPLOADED:
            return Response({'message': 'File uploaded successfully', 'file_id': file_id}, status=status.HTTP_200_OK)
        elif result == statuses.UPLOADED:
            return Response({'message': 'Chunk uploaded successfully'}, status=200)
        return Response({'message': 'Error uploading file'}, status=500)
