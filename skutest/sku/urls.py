from django.conf.urls import url, include
from sku import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'brands', views.BrandViewSet)
router.register(r'items', views.ItemViewSet)

urlpatterns = [
    url('^', include(router.urls)),
    ]
