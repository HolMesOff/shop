from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password, check_password
from . import models
from .models import Category, Product, User
from .serializers import CategorySerializer, ProductSerializer, UserSerializer, LoginSerializer


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

class CheckEmailView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        user_exists = User.objects.filter(email=email).exists()
        if user_exists:
            return Response({"message": "User exists"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "User does not exist"}, status=status.HTTP_400_BAD_REQUEST)


# Регистрация
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            # Хэшируем пароль перед сохранением
            serializer.validated_data['password'] = make_password(serializer.validated_data['password'])
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Вход
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            try:
                user = User.objects.get(email=email)
                if check_password(password, user.password):
                    return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






