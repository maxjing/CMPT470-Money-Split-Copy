from django.contrib import admin

# Register your models here.
from group.models import Group


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    pass
