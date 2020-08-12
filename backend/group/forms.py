from django import forms
from .models import Group


class GroupForm(forms.ModelForm):
    class Meta:
        model = Group
        fields = [
            'name',
            'description',
            'groupMessage'
        ]


class AddFriendForm(forms.Form):
    email = forms.EmailField(label='Enter email')

    def clean_email(self):
        email = self.cleaned_data['email'].lower()
        return email
