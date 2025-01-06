from django.urls import path
from django.contrib import admin
from MarketApp.views import LoginView, RegisterView, CheckEmailView, CategoryListView, SubcategoryListView, ProductListView, ProductSearchView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/categories/', CategoryListView.as_view(), name='category-list'),
    path('api/subcategories/<int:parent_id>/', SubcategoryListView.as_view(), name='subcategory-list'),
    path('api/products/<int:parent_id>/', ProductListView.as_view(), name='product-list'),
    path('api/products/search/', ProductSearchView.as_view(), name='product-search'),
    path('api/check-email/', CheckEmailView.as_view(), name='check_email'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
]
