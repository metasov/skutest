from django.db import models
from django.conf import settings


class Brand(models.Model):
    name = models.CharField(max_length=80, blank=False)

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ('name', )


class Category(models.Model):
    name = models.CharField(max_length=80, blank=False)

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ('name', )


class Item(models.Model):
    brand = models.ForeignKey(Brand, related_name="items")
    category = models.ForeignKey(Category, related_name="items")
    name = models.CharField(max_length=80)
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

    def __unicode__(self):
        return "{0} ({1})".format(self.sku, self.name)

    class Meta:
        ordering = ('sku', )

    def save(self, *args, **kwargs):
        if not self.sku:
            sku_category = self.category.name.upper()
            sku_category = sku_category[:settings.SKU_CATEGORY_CHARACTERS]
            sku_brand = self.brand.name.upper()
            sku_brand = sku_brand[:settings.SKU_BRAND_CHARACTERS]
            sku_prefix = settings.SKU_SEPARATOR.join(
                (sku_category, sku.brand))
            try:
                max_sku_item = (
                    Item.objects
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
