from django.db import models


class Brand(models.Model):
    name = models.CharField(max_length=80, blank=False)


class Category(models.Model):
    name = models.CharField(max_length=80, blank=False)
