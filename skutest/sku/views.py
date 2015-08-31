from django.shortcuts import render

from sku.models import (
    Category,
    Brand,
    Item)
from sku.serializers import (
    CategorySerializer,
    BrandSerializer,
    ItemSerializer)
from rest_framework import (
    viewsets,
    mixins)


class CategoryViewSet(
                      mixins.CreateModelMixin,
                      mixins.ListModelMixin,
                      mixins.RetrieveModelMixin,
                      viewsets.GenericViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class BrandViewSet(
                   mixins.CreateModelMixin,
                   mixins.ListModelMixin,
                   mixins.RetrieveModelMixin,
                   viewsets.GenericViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer


class ItemViewSet(
                  mixins.CreateModelMixin,
                  mixins.ListModelMixin,
                  mixins.RetrieveModelMixin,
                  viewsets.GenericViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
