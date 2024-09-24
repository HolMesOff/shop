from django.urls import path, include
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from MarketApp.views import CategoryListView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/categories/', CategoryListView.as_view(), name='category-list'),
]