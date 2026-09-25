from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Shop, Product, Offer, Order, LoyaltyCard, FeedPost, Notification
from .serializers import (
    ShopSerializer, ProductSerializer, OfferSerializer,
    OrderSerializer, LoyaltyCardSerializer, FeedPostSerializer,
    NotificationSerializer
)

class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all().order_by('-rating')
    serializer_class = ShopSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        area = self.request.query_params.get('area')
        search = self.request.query_params.get('search')
        supports_self_checkout = self.request.query_params.get('supports_self_checkout')

        if category and category != 'All':
            qs = qs.filter(category=category)
        if area:
            qs = qs.filter(area__icontains=area)
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(description__icontains=search))
        if supports_self_checkout is not None:
            val = supports_self_checkout.lower() in ('true', '1')
            qs = qs.filter(supports_self_checkout=val)
        return qs

    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        shop = self.get_object()
        products = shop.products.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-featured', 'name')
    serializer_class = ProductSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        shop_id = self.request.query_params.get('shop_id') or self.request.query_params.get('shopId')
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')
        barcode = self.request.query_params.get('barcode')

        if shop_id:
            qs = qs.filter(shop_id=shop_id)
        if category and category != 'All':
            qs = qs.filter(category=category)
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(description__icontains=search))
        if barcode:
            qs = qs.filter(barcode=barcode)
        return qs

    @action(detail=False, methods=['get'])
    def lookup_barcode(self, request):
        barcode = request.query_params.get('barcode')
        shop_id = request.query_params.get('shop_id') or request.query_params.get('shopId')

        if not barcode:
            return Response({'error': 'Barcode query parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

        qs = Product.objects.filter(barcode=barcode)
        if shop_id:
            qs = qs.filter(shop_id=shop_id)

        product = qs.first()
        if not product:
            return Response({'found': False, 'message': f'No product found with barcode {barcode}'}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(product)
        return Response({'found': True, 'product': serializer.data})

class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all().order_by('-created_at')
    serializer_class = OfferSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        shop_id = self.request.query_params.get('shop_id') or self.request.query_params.get('shopId')
        if shop_id:
            qs = qs.filter(shop_id=shop_id)
        return qs

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        shop_id = self.request.query_params.get('shop_id') or self.request.query_params.get('shopId')
        if shop_id:
            qs = qs.filter(shop_id=shop_id)
        return qs

    @action(detail=True, methods=['post'])
    def verify_exit_pass(self, request, pk=None):
        order = self.get_object()
        order.exit_pass_verified = True
        order.status = 'collected'
        order.save()
        serializer = self.get_serializer(order)
        return Response({
            'success': True,
            'message': 'Exit pass verified successfully. Customer is cleared for exit.',
            'order': serializer.data
        })

class LoyaltyCardViewSet(viewsets.ModelViewSet):
    queryset = LoyaltyCard.objects.all()
    serializer_class = LoyaltyCardSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        shop_id = self.request.query_params.get('shop_id') or self.request.query_params.get('shopId')
        if shop_id:
            qs = qs.filter(shop_id=shop_id)
        return qs

    @action(detail=False, methods=['post'])
    def add_points(self, request):
        shop_id = request.data.get('shopId')
        points = int(request.data.get('points', 0))
        description = request.data.get('description', 'Earned from purchase')

        card, _ = LoyaltyCard.objects.get_or_create(
            shop_id=shop_id,
            defaults={'points': 0, 'tier': 'Silver', 'barcode': f"CARD-{shop_id[-4:]}"}
        )
        card.points += points
        history_item = {
            'id': f"tx-{len(card.history) + 1}",
            'date': 'Today',
            'points': points,
            'type': 'earned',
            'description': description
        }
        card.history = [history_item] + card.history
        card.save()

        return Response(LoyaltyCardSerializer(card).data)

class FeedPostViewSet(viewsets.ModelViewSet):
    queryset = FeedPost.objects.all().order_by('-created_at')
    serializer_class = FeedPostSerializer

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        post.likes += 1
        post.save()
        return Response({'likes': post.likes})

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notif = self.get_object()
        notif.read = True
        notif.save()
        return Response({'success': True})
