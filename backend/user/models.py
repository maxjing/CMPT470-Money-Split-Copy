from django.contrib.auth.models import User
from django.db import models


class Preference(models.Model):
    USD = 'USD'
    CAD = 'CAD'
    CURRENCY_CHOICES = [
        (USD, 'USD'),
        (CAD, 'CAD'),
    ]
    currency = models.CharField(
        max_length=3,
        choices=CURRENCY_CHOICES,
        default=CAD,
    )
    currency = models.CharField(max_length=50, blank=False)
    timeZone = models.CharField(max_length=50, blank=False)
    language = models.CharField(max_length=50, blank=False)

    def __str__(self):
        return "%s %s %s" % (self.currency, self.timeZone, self.language)


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    preference = models.OneToOneField(Preference, on_delete=models.CASCADE, null=True)
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username
