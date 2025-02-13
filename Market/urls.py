from django.urls import path
from django.contrib import admin
from MarketApp.views import LoginView, RegisterView, CheckEmailView, CategoryListView, SubcategoryListView, ProductListView, ProductSearchView
from MarketApp import views_template

urlpatterns = [
    path('authorization/', views_template.authorization, name='template_authorization'),
    path('favorites/', views_template.favorites, name='template_favorites'),
    path('index/', views_template.index, name='template_index'),
    path('money/', views_template.money, name='template_money'),
    path('orders/', views_template.orders, name='template_orders'),
    path('products/', views_template.products, name='template_products'),
    path('profile/', views_template.profile, name='template_profile'),
    path('register/', views_template.register, name='template_register'),
    path('subcategories/', views_template.subcategories, name='template_subcategories'),


    path('admin/', admin.site.urls),
    path('api/categories/', CategoryListView.as_view(), name='category-list'),
    path('api/subcategories/<int:parent_id>/', SubcategoryListView.as_view(), name='subcategory-list'),
    path('api/products/<int:parent_id>/', ProductListView.as_view(), name='product-list'),
    path('api/products/search/', ProductSearchView.as_view(), name='product-search'),
    path('api/check-email/', CheckEmailView.as_view(), name='check_email'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
]
