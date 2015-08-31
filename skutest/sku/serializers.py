from rest_framework.serializers import (
    ModelSerializer)
from sku.models import (
    Brand,
    Category,
    Item)


class BrandSerializer(ModelSerializer):
    class Meta:
        model = Brand
        fields = ("id", "name")
        read_only_fields = ("id", )


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name")
        read_only_fields = ("id", )


class ItemSerializer(ModelSerializer):
    class Meta:
        model = Item
        fields = ("id", "sku", "category", "brand", "name")
        read_only_fields = ("id", "sku")
