from django.urls import path

from . import views

app_name = 'expense'
urlpatterns = [
    path('', views.index, name='index'),
    path('owing/', views.owing, name="owing"),
    path('pay/<uuid:anon_link>', views.PayAnonView.as_view()),
    path('owed/', views.owed, name="owed"),
    path('<int:expense_id>', views.details, name='details'),
    path('<int:group_id>/new/', views.new, name='new'),
    path('<int:expense_id>/pay/', views.pay, name='pay'),
    path('<int:expense_id>/delete/', views.delete, name='delete'),
    path('payments/', views.getPayments, name='getPayments')
]
