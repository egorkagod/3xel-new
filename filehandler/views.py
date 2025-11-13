from pydantic import ValidationError

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from . import statuses
from .api_schema import ChunkUploadSchema
from .services import file_service
from .services.dto import ChunkUploadServiceDTO


class UploadFileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)


    def post(self, request):
        try:
            chunk = request.FILES.get('chunk', None)
            data = ChunkUploadSchema(
                **request.data,
            )
        except ValidationError as e:
            return Response({'error': e.errors()})
        
        dto = file_service.upload_chunk(
            ChunkUploadServiceDTO(
                **data.model_dump(),
                user_id=request.user.id
            ),
            chunk=chunk
        )
        if dto.status == statuses.ALL_UPLOADED:
            return Response({'message': 'Файл успешно загружен', 'file_id': dto.file_id}, status=status.HTTP_200_OK)
        elif dto.status == statuses.UPLOADED:
            return Response({'message': 'Фрагмент загружен'}, status=status.HTTP_200_OK)
        return Response({'message': 'Не удалось загрузить файл'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
