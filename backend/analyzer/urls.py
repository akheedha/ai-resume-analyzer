from django.urls import path
from .views import resume_list

urlpatterns = [
    path('resumes/', resume_list),
]
