from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from .models import Resume
from .serializers import ResumeSerializer


@api_view(['GET', 'POST'])
@parser_classes([MultiPartParser, FormParser])

def resume_list(request):

    if request.method == 'GET':

        resumes = Resume.objects.all()
        serializer = ResumeSerializer(resumes, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':

        serializer = ResumeSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save()

            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)