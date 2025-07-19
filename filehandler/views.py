from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated

from . import statuses

from .repositories import file_rep
from .serializers import ChunkViewSerializer


class UploadFileView(APIView):
    # permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        serializer = ChunkViewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        filename = serializer.validated_data['fileId']
        chunk = serializer.validated_data['chunk'].read()
        chunk_number = serializer.validated_data['chunkIndex']
        total_chunks = serializer.validated_data['totalChunks']
        
        file_id, status = file_rep.upload_chunk(filename, chunk, chunk_number, total_chunks)
        if status == statuses.ALL_UPLOADED:
            return Response({'message': 'File uploaded successfully', 'file_id': file_id}, status=status.H)
        elif status == statuses.UPLOADED:
            return Response({'message': 'Chunk uploaded successfully'}, status=200)
        return Response({'message': 'Error uploading file'}, status=500)