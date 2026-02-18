from django.contrib import admin
from django.urls import path, include
from learning import views

urlpatterns = [
    path('', views.home, name="home"),
    path('section/', views.section_page, name="section"),
    path('topic/', views.topic_page, name="topic"),
    path('admin/', admin.site.urls),
    path('api/', include('learning.urls')),  # include learning app
]
# masterclass/urls.py
from learning import views
