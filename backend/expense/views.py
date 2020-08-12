from collections import defaultdict
from decimal import Decimal

from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, HttpResponse, Http404, JsonResponse
from django.shortcuts import render, redirect, reverse, get_object_or_404

from datetime import datetime

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .forms import NewExpenseForm, PaymentForm
from .models import Group, Expense, ExpenseEntry, PaymentHistory

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status, permissions
from .serializers import *
from django.db.models import Q, Sum
import uuid


def index(request):
    if request.user.is_authenticated:
        allExpenses = ExpenseEntry.objects.filter(user=request.user).all()
        serializer = ExpenseEntrySerializer(allExpenses, many=True)
        return JsonResponse(serializer.data, safe=False)
    else:
        return redirect("user:new")

@api_view(['GET'])
def owing(request):
    """get expense entries the user is owing"""
    if request.user.is_authenticated:
        all_user_expenses = ExpenseEntry.objects.filter(user=request.user).exclude(amount=0.0)
        amount = all_user_expenses.aggregate(Sum('amount'))['amount__sum'] if all_user_expenses.count() else 0
        serializer = ExpenseEntrySerializer(all_user_expenses, many=True)
        return JsonResponse({
            "amount": amount,
            "expenses": serializer.data
        }, safe=False)
    else:
        return Http404()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def owed(request):
    """get expense entries the user is owed"""
    if request.user.is_authenticated:
        # get all user expenses that the user has paid for
        expenses = ExpenseEntry.objects.filter(
            ~Q(user=request.user), groupExpense__paid_by=request.user).exclude(amount=0.0)
        amount = expenses.aggregate(Sum('amount'))['amount__sum'] if expenses.count() else 0
        owed = defaultdict(int)
        for expense in expenses:
            owed[expense.user.username] += expense.amount
        return JsonResponse({
            "amount": amount,
            "expenses": owed,
        }, safe=False)
    else:
        return Http404()


@api_view(['GET'])
def details(request, expense_id):
    if request.user.is_authenticated:
        expense = Expense.objects.get(pk=expense_id)

        if request.user not in expense.users.all():
            raise Http404("Expense not found")

        serializer = ExpenseSerializer(expense)
        return JsonResponse(serializer.data, safe=False)

    else:
        return Http404()


@api_view(['GET', 'POST'])
def new(request, group_id):
    def handle_splitting(amount, split_key, members, distribution):
        if split_key == "equal":
            owes = round(amount / members.count(), 2)
            return [(users, owes) for users in members]
        elif split_key == "percentage":
            distribution = [v / 100 * float(amount) for v in distribution]  # values come in as whole numbers
            return [(user, owing_amount) for user, owing_amount in zip(members, distribution)]
        elif split_key == "amount":
            return [(user, owing_amount) for user, owing_amount in zip(members, distribution)]
        else:
            raise Exception("Invalid split key")

    def check_split(amount, expense_tuples):
        sum = 0
        for _, owes in expense_tuples:
            sum += owes
        if sum == amount:
            return True
        else:
            return False

    if request.user.is_authenticated:
        group = get_object_or_404(Group, pk=group_id)

        if request.user not in group.users.all():
            raise Http404("Group not found")

        if request.method == 'POST':
            try:
                paid_by = User.objects.get(username=request.data["paid_by"])
            except User.DoesNotExist:
                return Response({
                    "message": "Please select a valid user who paid the expense."
                }, status=status.HTTP_400_BAD_REQUEST)

            request.data['paid_by'] = paid_by.id
            serializer = SimpleExpenseSerializer(data=request.data)
            if serializer.is_valid():
                member_list = group.users.all()
                try:
                    expense_tuples = handle_splitting(float(request.data['amount']), request.data['splitKey'],
                                                      member_list,
                                                      request.data['splitDistribution'])
                except Exception:
                    return Response({
                        "message": "Invalid split type"
                    }, status=status.HTTP_400_BAD_REQUEST)

                if not check_split(float(request.data['amount']), expense_tuples):
                    return Response({"message": "Bill amount not fully allocated. Please check again."},
                                    status=status.HTTP_400_BAD_REQUEST)
                    # Response("Bill amount not fully allocated. Please check again.",status=status.HTTP_400_BAD_REQUEST)

                new_expense = serializer.save()

                for member, owes in expense_tuples:
                    new_expense.users.add(member)
                    user_expense_entry = ExpenseEntry()
                    user_expense_entry.user = member
                    user_expense_entry.name = new_expense.name
                    user_expense_entry.date = new_expense.date
                    # set the person who paid the bill amount to 0
                    if new_expense.paid_by.id == member.id:
                        user_expense_entry.amount = 0
                    else:
                        user_expense_entry.amount = owes
                    user_expense_entry.groupExpense = new_expense
                    user_expense_entry.save()
                    new_expense.expenseentry_set.add(user_expense_entry)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Http404()


@api_view(['GET', 'POST'])
def pay(request, expense_id):
    if request.user.is_authenticated:
        # expense = ExpenseEntry.objects.get(pk=expense_id)
        expense = Expense.objects.get(pk=expense_id)
        # request.data['name'] = expense.name

        if request.user not in expense.users.all():
            raise Http404("Expense not found")

        expenseEntry = ExpenseEntry.objects.get(groupExpense=expense, user=request.user)

        if expenseEntry.amount == 0:
            raise Http404("Expense not found")

        if request.method == 'POST':

            request.data[
                'name'] = expense.name  # Not sure how to retrieve this from the POST request, so manually queried it and placed it here
            serializer = ExpenseEntrySerializer(expenseEntry, data=request.data)

            if serializer.is_valid():

                if float(request.data['amount']) > float(expenseEntry.amount):
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                updatedExpense = serializer.save()

                newPayment = PaymentHistory()
                newPayment.name = expense.name
                newPayment.user = request.user
                newPayment.amount = round(float(request.data['amount']), 2)
                newPayment.date = datetime.date
                newPayment.inidividualExpense = expenseEntry
                newPayment.groupExpense = expense
                newPayment.save()

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            expenseEntry = ExpenseEntry.objects.get(groupExpense=expense, user=request.user)
            serializer = ExpenseEntrySerializer(expenseEntry)
            return JsonResponse(serializer.data, safe=False)

    else:
        return Http404()


@api_view(['DELETE'])
def delete(request, expense_id):
    if request.user.is_authenticated:
        expense = Expense.objects.get(pk=expense_id)

        if request.user not in expense.users.all():
            raise Http404("Expense not found")

        expense.delete()
        return Response()

    else:
        return Http404()


@api_view(['GET'])
def getPayments(request):
    if request.user.is_authenticated:
        payments = PaymentHistory.objects.filter(user=request.user).order_by(
            '-pk')  # Reverse order of pk (ids) should give the most recent payments

        serializer = PaymentHistorySerializer(payments, many=True)

        return JsonResponse(serializer.data, safe=False)

    else:
        return Http404()


class PayAnonView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, anon_link, *args, **kwargs):
        print(anon_link)
        try:
            expense = Expense.objects.get(anon_link=anon_link)
        except Expense.DoesNotExist:
            return Response({"message": "unrecognized url"}, status=status.HTTP_400_BAD_REQUEST)
        # return the names of people who still have amounts due
        expense_entries = expense.expenseentry_set.filter(amount__gt=0)
        # return members and their amounts due
        if not expense_entries.count():
            return Response({"status": "complete"})
        else:
            amounts = {et.user.username: et.amount for et in expense_entries.all()}
            members = [et.user.username for et in expense_entries.all()]
            return JsonResponse({
                "status": "incomplete",
                "members": members,
                "amounts": amounts,
                "name": expense.name
            }, safe=False)

    def post(self, request, anon_link):
        amount = Decimal(request.data["amount"])
        email = request.data["email"]

        # get models
        user = get_object_or_404(User, username=email)
        expense = get_object_or_404(Expense, anon_link=anon_link)
        if expense.amount > 0:
            # update expense entry
            expense_entry = expense.expenseentry_set.get(user=user)

            expense_entry.amount = round(expense_entry.amount - amount, 2)

            expense_entry.save()
            group = expense_entry.groupExpense
            group.amount = round(group.amount - amount, 2)
            group.save()

            # Update payment history
            newPayment = PaymentHistory()
            newPayment.name = expense.name
            newPayment.user = user
            newPayment.amount = round(float(request.data['amount']), 2)
            newPayment.date = datetime.date
            newPayment.inidividualExpense = expense_entry
            newPayment.groupExpense = expense
            newPayment.save()
            return Response({"message": "payment success"})
        else:
            return Response({"error": "payment already made"}, status=status.HTTP_400_BAD_REQUEST)
