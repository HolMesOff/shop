from rest_framework import generics

from . import models
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.filter(parent__isnull=True)


class SubcategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        parent_id = self.kwargs['parent_id']
        return Category.objects.filter(parent_id=parent_id)


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        parent_id = self.kwargs['parent_id']
        # Фильтруем категории, в которых родительский элемент соответствует заданному parent_id
        categories = Category.objects.filter(id=parent_id) | Category.objects.filter(parent__id=parent_id)
        # Ищем товары, которые принадлежат этим категориям
        return Product.objects.filter(parent__in=categories)



