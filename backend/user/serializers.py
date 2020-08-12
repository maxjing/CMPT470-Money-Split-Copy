from rest_framework import serializers
from .models import Preference, UserProfile
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    username = serializers.CharField(read_only=True)
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'username')

class PreferenceSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Preference
        fields = ('id', 'currency', 'timezone', 'language')

class UserProfileSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    preference = PreferenceSerializer()
    user = UserSerializer()

    class Meta:
        model = UserProfile
        fields = ('id', 'user', 'preference', 'is_active')

class GetFullUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','first_name', 'last_name')
class UserSerializerWithToken(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    token = serializers.SerializerMethodField()

    def get_token(self, object):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(object)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    class Meta:
        model = User
        fields = ('token', 'username', 'password', 'first_name',
        'last_name')