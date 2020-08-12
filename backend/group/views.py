from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.validators import validate_email
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.shortcuts import render, get_object_or_404, reverse, redirect
from django.views.decorators.csrf import csrf_exempt

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import *

from user.models import UserProfile
from .models import Group
from .forms import GroupForm, AddFriendForm


@api_view(['GET'])
def index(request):
    if request.user.is_authenticated:
        userGroups = request.user.group_set.all()
        serializer = GroupSerializer(userGroups, many=True)
        return JsonResponse(serializer.data, safe=False)
    else:
        return HttpResponse('Unauthorized', status=401)


@api_view(['GET'])
def detail(request, group_id):
    if request.user.is_authenticated:
        group = get_object_or_404(Group, pk=group_id)
        if not group.users.filter(id=request.user.id).exists():
            raise Http404("Group not found")
        serializer = GroupSerializer(group)
        return JsonResponse(serializer.data)
    return Http404("Not found")


@api_view(['POST'])
def create(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            serializer = GroupSerializer(data=request.data)
            if serializer.is_valid():
                group = serializer.save()
                group.users.add(request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # else:
        #     form = GroupForm(request.POST)
        #     return render(request, 'group/create.html', {'form': form})
    else:
       return HttpResponse('Unauthorized', status=401)


@api_view(['POST'])
def add_friend(request, group_id):
    group = Group.objects.get(id=group_id)
    if request.method == "POST":
        user, is_new_user = User.objects.get_or_create(username=request.data.get('email'))
        group.users.add(user)
        if is_new_user:
            UserProfile.objects.create(user=user, is_active=False)
        group.save()
        serializer = GroupSerializer(group)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Http404("Not found")

@api_view(['DELETE'])
def delete(request, group_id):
    if request.user.is_authenticated:
        group = Group.objects.get(id=group_id)

        if request.user in group.users.all():

            group.delete()
            return Response()
        
        else:
            return Http404("Not found")
    
    else:
        return Http404("Not found")
