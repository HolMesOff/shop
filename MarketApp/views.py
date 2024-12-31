from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

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


from django.db.models import Q
import re

class ProductSearchView(APIView):
    def get(self, request, *args, **kwargs):
        query = request.query_params.get('query', '').strip()

        if query:
            # Преобразуем запрос в нижний регистр
            query_lower = query.lower()

            # Фильтрация товаров с использованием регулярных выражений для игнорирования регистра
            products = Product.objects.filter(
                Q(name__iregex=r'{}'.format(re.escape(query_lower))) | Q(name__iregex=r'{}'.format(re.escape(query)))
            )

            # Сериализация результатов
            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data, status=200)
        else:
            # Если строка поиска пуста, возвращаем пустой список
            products = Product.objects.none()
            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data, status=200)








