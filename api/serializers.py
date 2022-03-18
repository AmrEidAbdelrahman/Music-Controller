from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(read_only=True)
    host = serializers.CharField(read_only=True)
    class Meta:
        model = Room
        fields = "__all__"

    