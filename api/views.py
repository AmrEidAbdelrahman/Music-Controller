from django.shortcuts import render
from .models import Room
from .serializers import RoomSerializer
from rest_framework.views import APIView

from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet 
# Create your views here.
class Home(ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    lookup_field = 'code'

    def create(self, request, *args, **kwargs):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                request.session['room'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause,
                            votes_to_skip=votes_to_skip)
                room.save()
                request.session['room'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        print(self.request.session.session_key)
        data = serializer.data
        data['is_host'] = True if self.request.session.session_key == serializer.data['host'] else False
        return Response(data)

    def update(self, request, *args, **kwargs):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        print(serializer.validated_data)
        if not Room.objects.filter(code=serializer.validated_data['code'], host=self.request.session.session_key).exists():
            return Response({"Bad Request": "You don't Have Authority to change this room settings"}, status=status.HTTP_403_FORBIDDEN)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)


class Join(APIView):
    def post(self, request, format=None):
        room_code = request.data.get('room_code')
        if not request.session.exists(request.session.session_key):
            self.request.session.create()
        if room_code != None:
            rooms = Room.objects.filter(code=room_code)
            if len(rooms) > 0:
                room = rooms[0]
                request.session['room'] = room_code
                return Response({"Sucess": "You Joined The Room"}, status=status.HTTP_200_OK)
            else:
                return Response({"Faild":"The Room Not Exist"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"Bad Request": "The Room Code Not Provided"})

class user_in_room(APIView):
    def get(self, request, format=None):
        if not request.session.exists(request.session.session_key):
            self.request.session.create()
        data = {
            'code': request.session.get('room')
        }
        return Response(data, status=status.HTTP_200_OK)

class user_leave_room(APIView):
    def post(self, request, format=None):
        if not request.session.exists(request.session.session_key):
            self.request.session.create()
        if request.session['room'] == request.data['code']:
            request.session.pop('room')
            host = request.session.session_key
            rooms = Room.objects.filter(host=host)
            if len(rooms) > 0 :
                rooms[0].delete()
        else:
            return Response({"Bad Request": "You are Not in this Room"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"Sucess":"you left the room"}, status=status.HTTP_200_OK)