from django.urls import path
from . import views

urlpatterns = [
    path('', views.Home),
    path('join/', views.Home),
    path('create/', views.Home),
    path('room/<str:roomCode>/', views.Home),

]
