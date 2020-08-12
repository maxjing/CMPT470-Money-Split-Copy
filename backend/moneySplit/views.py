from django.shortcuts import render, redirect

from expense.models import PaymentHistory
from group.models import Group


def index(request):
    if request.user.is_authenticated:
        groups = Group.objects.filter(users__in=[request.user])
        payments = PaymentHistory.objects.filter(user=request.user).order_by(
            '-pk')  # Reverse order of pk (ids) should give the most recent payments
        return render(request, 'root.html', {
            "groups": groups,
            "payments": payments
        })
    else:
        return redirect("user:new")
