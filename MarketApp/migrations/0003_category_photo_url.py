# Generated by Django 5.0.7 on 2024-09-24 04:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MarketApp', '0002_rename_category2_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='photo_url',
            field=models.URLField(blank=True, max_length=255, null=True, verbose_name='Ссылка на фото'),
        ),
    ]
