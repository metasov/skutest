# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sku', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('sku', models.CharField(default=b'', max_length=12, blank=True)),
                ('brand', models.ForeignKey(related_name='items', to='sku.Brand')),
                ('category', models.ForeignKey(related_name='items', to='sku.Category')),
            ],
        ),
    ]
