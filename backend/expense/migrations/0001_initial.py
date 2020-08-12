# Generated by Django 2.2.15 on 2020-08-07 05:59

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('group', '0002_delete_test'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=7)),
                ('bill_amount', models.DecimalField(decimal_places=2, max_digits=7)),
                ('date', models.DateField(auto_now_add=True)),
                ('notes', models.TextField(max_length=500)),
                ('category', models.CharField(blank=True, max_length=50, null=True)),
                ('group', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='group.Group')),
                ('paid_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='paid_by', to=settings.AUTH_USER_MODEL)),
                ('users', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ExpenseEntry',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=7)),
                ('date', models.DateField(auto_now_add=True)),
                ('groupExpense', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='expense.Expense')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PaymentHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=7)),
                ('date', models.DateField(auto_now_add=True)),
                ('inidividualExpense', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='expense.ExpenseEntry')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
