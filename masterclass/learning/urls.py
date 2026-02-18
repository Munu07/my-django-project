from django.urls import path
from . import views

urlpatterns = [
    path('sections/', views.get_sections),
    path('topics/<int:section_id>/', views.get_topics),
    path('questions/<int:topic_id>/', views.get_questions),
    path('run-java/', views.run_java),

]
