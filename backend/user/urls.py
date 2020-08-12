from django.urls import path

from . import views
from django.contrib import admin
from django.urls import path, include
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

app_name = 'user'
urlpatterns = [
    # path('', views.index, name='index'),
    path('token-auth/', obtain_jwt_token),
    path('refresh/', refresh_jwt_token),
    path('api-token-verify/', verify_jwt_token),
    path('current_user/', views.get_current_user),
    path('create/', views.CreateUserView.as_view()),
    path('update/', views.update),
    path('new/', views.new, name="new"),
    path('login/', views.userLogin, name="login"),
    path('logout/', views.userLogout, name="logout"),
    path('info/', views.info, name="info")
]
