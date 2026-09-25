from rest_framework import serializers
from .models import (
    User, Shop, Product, LoyaltyPoints, LoyaltyCard, Transaction,
    Offer, Order, OrderItem, FeedPost, Notification
)

class UserSerializer(serializers.ModelSerializer):
    phoneNumber = serializers.CharField(source='phone_number')
    fullName = serializers.CharField(source='full_name', allow_blank=True, required=False)
    avatarUrl = serializers.CharField(source='avatar_url', allow_blank=True, required=False)
    walletBalance = serializers.DecimalField(source='wallet_balance', max_digits=12, decimal_places=2, required=False)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'phoneNumber', 'fullName',
            'role', 'avatarUrl', 'walletBalance', 'is_active', 'is_verified',
            'address', 'area', 'city', 'pincode', 'preferences', 'createdAt'
        ]

class TransactionSerializer(serializers.ModelSerializer):
    shopId = serializers.CharField(source='shop_id')
    shopName = serializers.CharField(source='shop.name', read_only=True)
    userId = serializers.CharField(source='user_id', allow_null=True, required=False)
    orderId = serializers.CharField(source='order_id', allow_null=True, required=False)
    transactionType = serializers.CharField(source='transaction_type')
    paymentMethod = serializers.CharField(source='payment_method')
    paymentGatewayRef = serializers.CharField(source='payment_gateway_ref', allow_blank=True, required=False)
    customerPhone = serializers.CharField(source='customer_phone', allow_blank=True, required=False)
    customerEmail = serializers.CharField(source='customer_email', allow_blank=True, required=False)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'id', 'userId', 'shopId', 'shopName', 'orderId', 'transactionType',
            'amount', 'fee', 'tax', 'paymentMethod', 'paymentGatewayRef',
            'status', 'currency', 'customerPhone', 'customerEmail', 'metadata', 'createdAt'
        ]

class LoyaltyPointsSerializer(serializers.ModelSerializer):
    shopId = serializers.CharField(source='shop_id')
    shopName = serializers.CharField(source='shop.name', read_only=True)
    userId = serializers.CharField(source='user_id', allow_null=True, required=False)
    userPhone = serializers.CharField(source='user_phone', allow_blank=True, required=False)
    nextRewardAt = serializers.IntegerField(source='next_reward_at', required=False)
    availableRewards = serializers.ListField(source='available_rewards', required=False)
    lifetimePoints = serializers.IntegerField(source='lifetime_points', required=False)
    pointsRedeemed = serializers.IntegerField(source='points_redeemed', required=False)

    class Meta:
        model = LoyaltyPoints
        fields = [
            'id', 'userId', 'shopId', 'shopName', 'userPhone', 'points',
            'lifetimePoints', 'pointsRedeemed', 'nextRewardAt',
            'tier', 'barcode', 'availableRewards', 'history', 'updated_at'
        ]

class ShopSerializer(serializers.ModelSerializer):
    logoUrl = serializers.CharField(source='logo_url', allow_blank=True, required=False)
    coverUrl = serializers.CharField(source='cover_url', allow_blank=True, required=False)
    distanceM = serializers.IntegerField(source='distance_m', required=False)
    reviewCount = serializers.IntegerField(source='review_count', required=False)
    followerCount = serializers.IntegerField(source='follower_count', required=False)
    productCount = serializers.IntegerField(source='product_count', required=False)
    isOpen = serializers.BooleanField(source='is_open', required=False)
    supportsSelfCheckout = serializers.BooleanField(source='supports_self_checkout', required=False)
    paymentMethods = serializers.ListField(source='payment_methods', required=False)

    class Meta:
        model = Shop
        fields = [
            'id', 'name', 'category', 'logoUrl', 'coverUrl', 'lat', 'lng',
            'distanceM', 'rating', 'reviewCount', 'followerCount', 'productCount',
            'isOpen', 'hours', 'address', 'area', 'phone', 'supportsSelfCheckout',
            'verified', 'paymentMethods', 'description', 'created_at', 'updated_at'
        ]

class ProductSerializer(serializers.ModelSerializer):
    shopId = serializers.CharField(source='shop_id')
    shopName = serializers.CharField(source='shop.name', read_only=True)
    discountPct = serializers.IntegerField(source='discount_pct', required=False)
    imageUrls = serializers.ListField(source='image_urls', required=False)

    class Meta:
        model = Product
        fields = [
            'id', 'shopId', 'shopName', 'name', 'category', 'price',
            'mrp', 'discountPct', 'stock', 'imageUrls', 'barcode',
            'description', 'featured', 'created_at'
        ]

class OfferSerializer(serializers.ModelSerializer):
    shopId = serializers.CharField(source='shop_id')
    shopName = serializers.CharField(source='shop.name', read_only=True)
    validFrom = serializers.CharField(source='valid_from', required=False)
    validTo = serializers.CharField(source='valid_to', required=False)
    bannerGradient = serializers.CharField(source='banner_gradient', required=False)
    applicableCategories = serializers.ListField(source='applicable_categories', required=False)
    minOrderValue = serializers.IntegerField(source='min_order_value', required=False)
    isEndingSoon = serializers.BooleanField(source='is_ending_soon', required=False)

    class Meta:
        model = Offer
        fields = [
            'id', 'shopId', 'shopName', 'title', 'description', 'type',
            'value', 'code', 'validFrom', 'validTo', 'bannerGradient',
            'applicableCategories', 'minOrderValue', 'isEndingSoon', 'created_at'
        ]

class OrderItemSerializer(serializers.ModelSerializer):
    productId = serializers.CharField(source='product_id')
    productName = serializers.CharField(source='product_name')
    imageUrl = serializers.CharField(source='image_url', allow_blank=True, required=False)

    class Meta:
        model = OrderItem
        fields = ['productId', 'productName', 'price', 'quantity', 'imageUrl']

class OrderSerializer(serializers.ModelSerializer):
    shopId = serializers.CharField(source='shop_id')
    shopName = serializers.CharField(source='shop.name', read_only=True)
    items = OrderItemSerializer(many=True, required=False)
    loyaltyPointsUsed = serializers.IntegerField(source='loyalty_points_used', required=False, default=0)
    paymentMethod = serializers.CharField(source='payment_method')
    paymentId = serializers.CharField(source='payment_id', allow_blank=True, required=False)
    exitPassQr = serializers.CharField(source='exit_pass_qr', allow_blank=True, required=False)
    exitPassVerified = serializers.BooleanField(source='exit_pass_verified', required=False, default=False)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'shopId', 'shopName', 'items', 'subtotal', 'discount',
            'loyaltyPointsUsed', 'tax', 'total', 'status', 'paymentMethod',
            'paymentId', 'exitPassQr', 'exitPassVerified', 'createdAt'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        order = Order.objects.create(**validated_data)
        for item in items_data:
            OrderItem.objects.create(order=order, **item)
        return order

class LoyaltyCardSerializer(serializers.ModelSerializer):
    shopId = serializers.CharField(source='shop_id')
    shopName = serializers.CharField(source='shop.name', read_only=True)
    nextRewardAt = serializers.IntegerField(source='next_reward_at', required=False)
    availableRewards = serializers.ListField(source='available_rewards', required=False)

    class Meta:
        model = LoyaltyCard
        fields = [
            'id', 'shopId', 'shopName', 'points', 'nextRewardAt',
            'tier', 'barcode', 'availableRewards', 'history', 'updated_at'
        ]

class FeedPostSerializer(serializers.ModelSerializer):
    shopId = serializers.CharField(source='shop_id')
    shopName = serializers.CharField(source='shop.name', read_only=True)
    shopLogo = serializers.CharField(source='shop.logo_url', read_only=True)
    timeAgo = serializers.CharField(source='time_ago', required=False)
    imageUrl = serializers.CharField(source='image_url', allow_blank=True, required=False)
    offerTag = serializers.CharField(source='offer_tag', allow_blank=True, required=False)

    class Meta:
        model = FeedPost
        fields = [
            'id', 'shopId', 'shopName', 'shopLogo', 'area', 'timeAgo',
            'text', 'imageUrl', 'offerTag', 'likes', 'created_at'
        ]

class NotificationSerializer(serializers.ModelSerializer):
    actionUrl = serializers.CharField(source='action_url', allow_blank=True, required=False)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'type', 'read', 'actionUrl', 'createdAt']
