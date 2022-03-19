from django.urls import path
from . import views
urlpatterns = [
    path('room/', views.Home.as_view({'get':'list', 'post':'create'})),
    path('room/<str:code>/', views.Home.as_view({'get':'retrieve', 'patch':'partial_update'})),
    path("join-room/", views.Join.as_view()),
    path("user-in-room/", views.user_in_room.as_view()),
    path("user-leave-room/", views.user_leave_room.as_view())
]
