from django.urls import path

from . import views

app_name = 'group'
urlpatterns = [
    path('', views.index, name='index'),
    path('<int:group_id>/', views.detail, name='detail'),
    path('<int:group_id>/add_friend', views.add_friend, name='add_friend'),
    path('create/', views.create, name='create'),
    path('<int:group_id>/delete', views.delete, name='delete')
]
