from django.urls import path, include
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from MarketApp.views import CategoryListView, SubcategoryListView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/categories/', CategoryListView.as_view(), name='category-list'),  # Эндпоинт для получения категорий
    path('api/subcategories/<int:parent_id>/', SubcategoryListView.as_view(), name='subcategory-list'),  # Эндпоинт для получения подкатегорий
]
