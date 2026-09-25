from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ShopViewSet, ProductViewSet, OfferViewSet,
    OrderViewSet, LoyaltyCardViewSet, FeedPostViewSet,
    NotificationViewSet
)

router = DefaultRouter()
router.register(r'shops', ShopViewSet, basename='shop')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'offers', OfferViewSet, basename='offer')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'loyalty', LoyaltyCardViewSet, basename='loyalty')
router.register(r'feed', FeedPostViewSet, basename='feed')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
]
