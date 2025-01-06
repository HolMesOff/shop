from django.contrib import admin
from .models import Category, Product, User

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent')
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent', 'price', 'quantity', 'unit')
    search_fields = ('name', 'description')
    list_filter = ('parent', 'unit')
@admin.register(User)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('email', 'password', 'birth_date')
    search_fields = ('email', 'birth_date')

