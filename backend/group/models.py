from django.contrib.auth.models import User
from django.db import models
from django.urls import reverse


# Create your models here.
# from expense.models import Expense

class Group(models.Model):
    users = models.ManyToManyField(User)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500, null=True)
    dateCreated = models.DateTimeField('date created', auto_now=True)
    groupMessage = models.TextField(null=True, blank=True)

    def __str__(self):
        return "group name: %s, date created: %s" % (self.name, str(self.dateCreated))

    # def get_absolute_url(self):
    # return reverse("index", kwargs={"id": self.id})

    # each expense has a group
    # create a new group
    # add users to group
    # display expenses 
    # page -> list groups with a create group button
    # create group -> takes you to where you can create groups takes you back after ur done
    # click on a group, displays date, amount, and users

    # index - group name, expenses-> also link to create a new group
    # click on a group, displays date, amount, and users
