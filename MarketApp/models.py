from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='subcategories', on_delete=models.CASCADE)
    photo_url = models.URLField()

    def __str__(self):
        return self.name

from django.db import models

class Unit(models.TextChoices):
    KG = 'kg', 'Килограмм'
    L = 'l', 'Литр'
    PCS = 'pcs', 'Штука'

class Product(models.Model):
    name = models.CharField(max_length=200)
    photo_url = models.URLField()
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1.0)  # Новое поле
    unit = models.CharField(max_length=3, choices=Unit.choices, default=Unit.PCS)
    parent = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} ({self.quantity} {self.get_unit_display()})"
