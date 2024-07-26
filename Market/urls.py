from django.urls import path, include
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from MarketApp.views import ProductViewSet, OrderViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]