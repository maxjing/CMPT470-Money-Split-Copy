from rest_framework import serializers
from .models import Group
from user.serializers import UserSerializer
from expense.serializers import SimpleExpenseSerializer


class GroupSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    users = UserSerializer(many=True, required=False)
    expense_set = SimpleExpenseSerializer(many=True, required=False)

    class Meta:
        model = Group
        fields = ('users', 'expense_set', 'id', 'name', 'description', 'dateCreated', 'groupMessage')
