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

    # @extend_schema(
    #     operation_id='upload_file_chunk',
    #     summary='Загрузка файла по частям',
    #     description='Принимает очередной чанк файла и собирает итоговый файл после получения всех частей.',
    #     request=ChunkUploadSchema,
    #     responses={
    #         status.HTTP_200_OK: OpenApiResponse(
    #             response=FileUploadResponseSerializer,
    #             description='Чанк принят. После загрузки всех частей возвращается `file_id`.'
    #         ),
    #         status.HTTP_500_INTERNAL_SERVER_ERROR: OpenApiResponse(
    #             response=ErrorResponseSerializer,
    #             description='Ошибка при сохранении чанка.'
    #         ),
    #     },
    # )
    def post(self, request):
        try:
            data = ChunkUploadSchema(
                **request.data,
                chunk=request.FILES.get('chunk', None)
            )
        except ValidationError as e:
            return Response({'error': e.errors()})
        
        dto = file_service.upload_chunk(
            ChunkUploadServiceDTO(
                **data.model_dump(),
                user_id=request.user.id
            )
        )
        if dto.status == statuses.ALL_UPLOADED:
            return Response({'message': 'Файл успешно загружен', 'file_id': dto.file_id}, status=status.HTTP_200_OK)
        elif dto.status == statuses.UPLOADED:
            return Response({'message': 'Фрагмент загружен'}, status=status.HTTP_200_OK)
        return Response({'message': 'Не удалось загрузить файл'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
