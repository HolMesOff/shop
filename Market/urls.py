from django.urls import path
from django.contrib import admin
from MarketApp.views import CategoryListView, SubcategoryListView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/categories/', CategoryListView.as_view(), name='category-list'),
    path('api/subcategories/<int:parent_id>/', SubcategoryListView.as_view(), name='subcategory-list'),
]
