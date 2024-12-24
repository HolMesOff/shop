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
        categories = Category.objects.filter(models.Q(id=parent_id) | models.Q(parent__id=parent_id))
        return Product.objects.filter(category__in=categories)