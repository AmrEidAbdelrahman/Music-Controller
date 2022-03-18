from django.shortcuts import render

# Create your views here.
def Home(request, roomCode=None):
    return render(request, 'frontend/index.html')