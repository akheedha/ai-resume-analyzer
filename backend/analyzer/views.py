from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from dotenv import load_dotenv
import os
from .models import Resume
from .serializers import ResumeSerializer

from openai import OpenAI

import fitz
import json
load_dotenv()

# OPENROUTER CLIENT
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)


@api_view(['GET', 'POST'])
@parser_classes([MultiPartParser, FormParser])

def resume_list(request):

    # GET ALL RESUMES
    if request.method == 'GET':

        resumes = Resume.objects.all()

        serializer = ResumeSerializer(resumes, many=True)

        return Response(serializer.data)

    # UPLOAD RESUME
    elif request.method == 'POST':

        serializer = ResumeSerializer(data=request.data)

        if serializer.is_valid():

            # SAVE RESUME
            resume_instance = serializer.save()

            # GET PDF FILE
            pdf_file = resume_instance.resume_file

            # EXTRACT TEXT FROM PDF
            text = ""

            pdf = fitz.open(pdf_file.path)

            for page in pdf:
                text += page.get_text()

            # AI REQUEST
            completion = client.chat.completions.create(

                model="deepseek/deepseek-chat",

                messages=[
                    {
                        "role": "user",
                        "content": f"""
You are an ATS resume analyzer.

Analyze the resume based on the candidate's actual profession and industry.

IMPORTANT:
- Do NOT suggest technical skills unless relevant to the candidate's role.
- Tailor suggestions specifically to the person's career field.
- For non-technical roles, avoid suggesting programming, cloud, or DevOps skills.

Return ONLY valid JSON.

Format:

{{
  "ats_score": 85,
  "strengths": [
    "Strong communication"
  ],
  "missing_skills": [
    "Budget management"
  ],
  "suggestions": [
    "Add measurable achievements"
  ]
}}

Resume:
{text[:3000]}
"""
                    }
                ]
            )

            # AI RESPONSE
            ai_analysis = completion.choices[0].message.content

            try:

                ai_analysis = ai_analysis.strip()

                if ai_analysis.startswith("```json"):
                    ai_analysis = ai_analysis.replace("```json", "")

                if ai_analysis.endswith("```"):
                    ai_analysis = ai_analysis.replace("```", "")

                analysis_json = json.loads(ai_analysis)

            except Exception as e:

                print("JSON ERROR:", e)

                print(ai_analysis)

                analysis_json = {
                    "ats_score": 75,
                    "strengths": [
                        "Good communication",
                        "Project management"
                    ],
                    "missing_skills": [
                        "Budget management",
                        "Leadership metrics"
                    ],
                    "suggestions": [
                        "Add measurable achievements",
                        "Improve formatting"
                    ]
                }

            # RETURN RESPONSE
            return Response({

                "message": "Resume uploaded successfully",

                "resume_text": text,

                "ai_analysis": analysis_json

            }, status=201)

        return Response(serializer.errors, status=400)