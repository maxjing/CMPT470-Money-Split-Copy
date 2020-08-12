import uuid

from django.contrib.auth.models import User
from django.db import models

from group.models import Group


# Create your models here.
class Expense(models.Model):
    # Add some choices later
    CATEGORIES_CHOICES = []

    group = models.ForeignKey(Group, on_delete=models.CASCADE, null=True)
    users = models.ManyToManyField(User)
    name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=7, decimal_places=2)  # Current amount
    bill_amount = models.DecimalField(max_digits=7, decimal_places=2)  # Original amount
    date = models.DateField()
    notes = models.TextField(max_length=500, blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORIES_CHOICES, blank=True, null=True)
    # the person who paid the bill
    paid_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="paid_by")
    anon_link = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)


class ExpenseEntry(models.Model):
    # the person who created the expense
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # which group the expense belongs to
    groupExpense = models.ForeignKey(Expense, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=7, decimal_places=2)
    date = models.DateField(auto_now_add=True)


class PaymentHistory(models.Model):
    # the person who created the expense
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = name = models.CharField(max_length=255)
    # which individual expense that this payment is made for
    inidividualExpense = models.ForeignKey(ExpenseEntry, on_delete=models.CASCADE, null=True)
    groupExpense = models.ForeignKey(Expense, on_delete=models.CASCADE, null=True)
    amount = models.DecimalField(max_digits=7, decimal_places=2)
    date = models.DateField(auto_now_add=True)