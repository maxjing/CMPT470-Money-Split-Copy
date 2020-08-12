from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from .forms import LoginForm, RegistrationForm
from .models import UserProfile

from .serializers import *
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import permissions


@api_view(['GET'])
def get_current_user(request):
    serializer = GetFullUserSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
def update(request, firstName, lastName):
    user = request.data.get('user')
    if not user:
        return Response({'response' : 'error', 'message' : 'No data found'})
    targetUser = User.objects.filter(username = user['username'])
    if not targetUser:
        return Response({'response' : 'error', 'message' : 'No data found'})
    print(user)
    targetUser.first_name = firstName
    targetUser.last_name = lastName
    targetUser.save()
    return Response({"response" : "success", "message" : "user created succesfully"})

class CreateUserView(APIView):
    permission_classes = (permissions.AllowAny, )    
    def post(self,request):
        user = request.data.get('user')
        if not user:
            return Response({'response' : 'error', 'message' : 'No data found'})
        print(user)
        serializer = UserSerializerWithToken(data = user)        
        if serializer.is_valid():
            saved_user = serializer.save()
        else:
            return Response({"response" : "error", "message" : serializer.errors})        
        return Response({"response" : "success", "message" : "user created succesfully"})

# Some functionality (notably the user log in / log out / sign up) works in the backend, but are deprecated
# Functions beneath this are deprecated

def new(request):
    if request.method == 'POST':
        user_form = RegistrationForm(request.POST)
        if user_form.is_valid():  # this cleans and validates the fields
            user, was_created = User.objects.get_or_create(username=user_form.cleaned_data['email'])
            user.set_password(user_form.cleaned_data['password1'])
            user.save()
            UserProfile.objects.update_or_create(user=user, is_active=True)
            login(request, user)
            return HttpResponseRedirect("/")
    else:
        user_form = RegistrationForm()
    return render(request, 'user/new.html', {'form': user_form})


def userLogin(request):
    loginForm = LoginForm(request.POST or None)
    if request.POST and loginForm.is_valid():
        user = loginForm.login(request)
        if user:
            login(request, user)
            return HttpResponseRedirect("/")
    return render(request, 'user/login.html', {'form': loginForm})


def userLogout(request):
    if request.user.is_authenticated:
        logout(request)
        return HttpResponseRedirect("/")
    else:
        return HttpResponse("Not signed in")


def info(request):
    if request.user.is_authenticated:
        currentProfile = request.user.userprofile
        currentId = currentProfile.id

        context = {
            "current_profile": currentProfile,
            "current_id": currentId
        }
        return render(request, "user/info.html", context)
    else:
        return HttpResponse("Not signed in")
