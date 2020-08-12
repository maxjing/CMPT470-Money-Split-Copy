from django.contrib import admin

# Register your models here.
from expense.models import Expense, ExpenseEntry, PaymentHistory


@admin.register(ExpenseEntry)
@admin.register(PaymentHistory)
class GeneralExpenseAdmin(admin.ModelAdmin):
    pass


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    readonly_fields = ('anon_link',)
