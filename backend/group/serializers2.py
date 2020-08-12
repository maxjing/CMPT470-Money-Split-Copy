from rest_framework import serializers
from .models import Group
from user.serializers import UserSerializer

class AlternateGroupSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    users = UserSerializer(many=True, required=False)
    #expenses = SimpleExpenseSerializer(many=True, required=False)

    class Meta:
        model = Group
        fields = ('users', 'id', 'name', 'description', 'dateCreated', 'groupMessage')