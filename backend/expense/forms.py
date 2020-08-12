from django import forms
import datetime

class NewExpenseForm(forms.Form):
    name = forms.CharField(max_length=255, required=True)
    amount = forms.DecimalField(max_digits=7, decimal_places=2)
    date = forms.DateField(initial=datetime.date.today)
    notes = forms.CharField(widget=forms.Textarea, required=False, max_length=500)

class PaymentForm(forms.Form):
    amount = forms.DecimalField(max_digits=7, decimal_places=2)