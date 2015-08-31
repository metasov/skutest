from django.db import models
from django.conf import settings


class Brand(models.Model):
    name = models.CharField(max_length=80, blank=False)


class Category(models.Model):
    name = models.CharField(max_length=80, blank=False)


class Item(models.Model):
    brand = models.ForeignKey(Brand, related_name="items")
    category = models.ForeignKey(Category, related_name="items")
    name = models.CharField(max_length = 80)
    sku = models.CharField(
        max_length=(
            3 * len(settings.SKU_SEPARATOR) +
            settings.SKU_BRAND_CHARACTERS +
            settings.SKU_CATEGORY_CHARACTERS +
            settings.SKU_DIGITS_COUNT),
        null=False,
        blank=True,
        default=""
        )

    def save(self, *args, **kwargs):
        if not self.sku:
            sku_prefix = settings.SKU_SEPARATOR.join(
                (
                    self.category.name[:settings.SKU_CATEGORY_CHARACTERS],
                    self.brand.name[:settings.SKU_BRAND_CHARACTERS]
                    )
                )
            try:
                max_sku_item = (Item
                    .objects
                    .filter(sku__startswith=sku_prefix)
                    .order_by("-sku")[0])
                sku_num_start = (
                    2 * len(settings.SKU_SEPARATOR) +
                    settings.SKU_BRAND_CHARACTERS +
                    settings.SKU_CATEGORY_CHARACTERS)
                max_sku = int(
                    max_sku_item.sku[sku_num_start:])
                sku_num = "{1:0>{0}}".format(
                    settings.SKU_DIGITS_COUNT,
                    max_sku + 1
                    )
            except IndexError:
                sku_num = "0"*settings.SKU_DIGITS_COUNT
        super(Item, self).save(*args, **kwargs)
