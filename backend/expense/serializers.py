from rest_framework import serializers
from .models import Expense, ExpenseEntry, PaymentHistory
from group.serializers2 import AlternateGroupSerializer
from user.serializers import UserSerializer


class ExpenseEntrySerializer(serializers.ModelSerializer):
    user = UserSerializer(allow_null=True, required=False)
    paid_by_username = serializers.CharField(source="groupExpense.paid_by.username", read_only=True)

    class Meta:
        model = ExpenseEntry
        fields = ('user', 'groupExpense', 'name', 'amount', 'date', "paid_by_username")

    def update(self, instance, validated_data):
        instance.amount = round(instance.amount - validated_data['amount'], 2)
        instance.save()

        group = instance.groupExpense
        group.amount = round(group.amount - validated_data['amount'], 2)
        group.save()

        return instance

class ExpenseSerializer(serializers.ModelSerializer):
    group = AlternateGroupSerializer(allow_null=True, required=False)
    users = UserSerializer(many=True, allow_null=True, required=False)
    expenseentry_set = ExpenseEntrySerializer(many=True, allow_null=True, required=False)
    paid_by_username = serializers.CharField(source="paid_by.username", read_only=True)

    class Meta:
        model = Expense
        fields = (
        'id', 'group', 'users', 'name', 'amount', 'bill_amount', 'date', 'notes', 'category', 'expenseentry_set',
        "paid_by", "paid_by_username", "anon_link")


class SimpleExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ('id', 'group', 'name', 'amount', 'bill_amount', 'date', 'notes', "paid_by")

    def create(self, validated_data):
        expense = Expense(**validated_data)
        expense.save()
        return expense

class SimpleExpenseSerializerWithoutGroup(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ('id', 'name', 'amount', 'bill_amount', 'date', 'notes', "paid_by")

    def create(self, validated_data):
        expense = Expense(**validated_data)
        expense.save()
        return expense

class PaymentHistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = PaymentHistory
        fields = ('id', 'name', 'groupExpense', 'amount', 'date')