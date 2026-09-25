"""
ShopGenie Django ORM Models
Compatible with PostgreSQL (JSONB, Decimal, B-Tree indexes, UUIDs) and SQLite.

Core Models defined:
1. User: Shoppers, merchants, cashiers, and admins with wallet and profile data.
2. Shop: Local retail storefronts with geolocation, categories, and checkout capability.
3. Product: Inventory items with barcode scanning, pricing, stock, and PostgreSQL JSONB images.
4. LoyaltyPoints: Tiered loyalty program, points balance, rewards, and redemption history.
5. Transaction: Immutable financial ledger for purchases, refunds, and payments.

Additional ShopGenie Models:
- Offer: Dynamic discounts, flash deals, and promo codes.
- Order: Customer self-checkout carts and completed orders.
- OrderItem: Line items within an order.
- FeedPost: Hyperlocal social updates from neighborhood stores.
- Notification: Order, loyalty, and store alerts for shoppers.
"""

from django.db import models
from decimal import Decimal
import uuid


def generate_user_id():
    return f"usr-{uuid.uuid4().hex[:10]}"


def generate_shop_id():
    return f"shop-{uuid.uuid4().hex[:8]}"


def generate_prod_id():
    return f"prod-{uuid.uuid4().hex[:8]}"


def generate_offer_id():
    return f"offer-{uuid.uuid4().hex[:8]}"


def generate_order_id():
    return f"ord-{uuid.uuid4().hex[:8]}"


def generate_loyalty_id():
    return f"loyalty-{uuid.uuid4().hex[:8]}"


def generate_transaction_id():
    return f"txn-{uuid.uuid4().hex[:12]}"


def generate_post_id():
    return f"post-{uuid.uuid4().hex[:8]}"


def generate_notif_id():
    return f"notif-{uuid.uuid4().hex[:8]}"


# =============================================================================
# 1. USER MODEL
# =============================================================================
class User(models.Model):
    """
    ShopGenie User model representing shoppers, store owners (merchants),
    cashiers, and administrators. Compatible with PostgreSQL.
    """
    ROLE_CHOICES = (
        ('shopper', 'Shopper / Customer'),
        ('merchant', 'Store Merchant / Owner'),
        ('cashier', 'Store Staff / Cashier'),
        ('admin', 'Platform Administrator'),
    )

    id = models.CharField(max_length=64, primary_key=True, default=generate_user_id)
    username = models.CharField(max_length=150, unique=True, db_index=True)
    email = models.EmailField(max_length=254, unique=True, db_index=True)
    phone_number = models.CharField(max_length=32, unique=True, db_index=True)
    full_name = models.CharField(max_length=255, blank=True, default='')
    role = models.CharField(max_length=32, choices=ROLE_CHOICES, default='shopper', db_index=True)
    avatar_url = models.URLField(max_length=1024, blank=True, default='')
    wallet_balance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Stored as PostgreSQL NUMERIC for exact financial math"
    )
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=True)
    address = models.CharField(max_length=500, blank=True, default='')
    area = models.CharField(max_length=200, default='Rajarajeshwari Nagar')
    city = models.CharField(max_length=100, default='Bengaluru')
    pincode = models.CharField(max_length=20, blank=True, default='560098')
    # PostgreSQL native JSONB field for flexible user settings & cart recovery
    preferences = models.JSONField(default=dict, blank=True, help_text="Stored as PostgreSQL JSONB")
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'shopgenie_users'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['phone_number']),
            models.Index(fields=['role']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


# =============================================================================
# 2. SHOP MODEL
# =============================================================================
class Shop(models.Model):
    """
    Hyperlocal retail store model. Holds location, operating parameters,
    and self-checkout verification flags.
    """
    id = models.CharField(max_length=64, primary_key=True, default=generate_shop_id)
    owner = models.ForeignKey(
        User,
        related_name='managed_shops',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Optional link to merchant user account"
    )
    name = models.CharField(max_length=255, db_index=True)
    category = models.CharField(max_length=100, db_index=True)
    logo_url = models.URLField(max_length=1024, blank=True, default='')
    cover_url = models.URLField(max_length=1024, blank=True, default='')
    lat = models.FloatField(default=12.9248)
    lng = models.FloatField(default=77.5218)
    distance_m = models.IntegerField(default=300)
    rating = models.FloatField(default=4.5)
    review_count = models.IntegerField(default=0)
    follower_count = models.IntegerField(default=0)
    product_count = models.IntegerField(default=0)
    is_open = models.BooleanField(default=True)
    hours = models.CharField(max_length=100, default='8:00 AM - 10:00 PM')
    address = models.CharField(max_length=500)
    area = models.CharField(max_length=200, default='Rajarajeshwari Nagar', db_index=True)
    phone = models.CharField(max_length=50, blank=True, default='')
    supports_self_checkout = models.BooleanField(default=True, db_index=True)
    verified = models.BooleanField(default=True)
    # PostgreSQL native JSONB for flexible payment method arrays
    payment_methods = models.JSONField(default=list, blank=True, help_text="Stored as PostgreSQL JSONB")
    description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'shopgenie_shops'
        ordering = ['-rating', 'name']
        indexes = [
            models.Index(fields=['category', 'area']),
            models.Index(fields=['supports_self_checkout']),
            models.Index(fields=['rating']),
        ]

    def __str__(self):
        return f"{self.name} ({self.area})"


# =============================================================================
# 3. PRODUCT MODEL
# =============================================================================
class Product(models.Model):
    """
    Retail inventory product model with barcode indexing for instant
    in-store barcode scanning and self-checkout cart building.
    """
    id = models.CharField(max_length=64, primary_key=True, default=generate_prod_id)
    shop = models.ForeignKey(Shop, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=255, db_index=True)
    category = models.CharField(max_length=100, db_index=True)
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="PostgreSQL NUMERIC(10,2) selling price"
    )
    mrp = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="PostgreSQL NUMERIC(10,2) maximum retail price"
    )
    discount_pct = models.IntegerField(default=0)
    stock = models.IntegerField(default=10)
    # PostgreSQL JSONB list of product images
    image_urls = models.JSONField(default=list, blank=True, help_text="Stored as PostgreSQL JSONB")
    barcode = models.CharField(max_length=64, db_index=True, help_text="EAN-13, UPC or QR barcode")
    sku = models.CharField(max_length=64, blank=True, default='')
    description = models.TextField(blank=True, default='')
    featured = models.BooleanField(default=False, db_index=True)
    metadata = models.JSONField(default=dict, blank=True, help_text="Custom product specs/nutritional info in JSONB")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'shopgenie_products'
        ordering = ['-featured', 'name']
        indexes = [
            models.Index(fields=['shop', 'category']),
            models.Index(fields=['barcode']),
            models.Index(fields=['featured']),
        ]

    def __str__(self):
        return f"{self.name} - {self.shop.name} (₹{self.price})"


# =============================================================================
# 4. LOYALTY POINTS MODEL
# =============================================================================
class LoyaltyPoints(models.Model):
    """
    Core loyalty program and reward points ledger for each user/customer per shop.
    Compatible with PostgreSQL.
    """
    TIER_CHOICES = (
        ('Bronze', 'Bronze Tier'),
        ('Silver', 'Silver Tier'),
        ('Gold', 'Gold Tier'),
        ('Diamond', 'Diamond Tier'),
    )

    id = models.CharField(max_length=64, primary_key=True, default=generate_loyalty_id)
    user = models.ForeignKey(
        User,
        related_name='loyalty_points',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    shop = models.ForeignKey(Shop, related_name='loyalty_accounts', on_delete=models.CASCADE)
    user_phone = models.CharField(max_length=50, blank=True, default='', db_index=True)
    points = models.IntegerField(default=0, help_text="Current redeemable loyalty points")
    lifetime_points = models.IntegerField(default=0, help_text="Total loyalty points earned since inception")
    points_redeemed = models.IntegerField(default=0, help_text="Total loyalty points redeemed")
    next_reward_at = models.IntegerField(default=200)
    tier = models.CharField(max_length=32, choices=TIER_CHOICES, default='Silver', db_index=True)
    barcode = models.CharField(max_length=64, blank=True, default='')
    # PostgreSQL JSONB fields for rewards catalog and transaction history
    available_rewards = models.JSONField(default=list, blank=True, help_text="Stored as PostgreSQL JSONB")
    history = models.JSONField(default=list, blank=True, help_text="Audit trail of points in JSONB")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'shopgenie_loyalty_points'
        ordering = ['-points']
        indexes = [
            models.Index(fields=['shop', 'user_phone']),
            models.Index(fields=['tier']),
        ]

    def __str__(self):
        return f"Loyalty {self.shop.name} - {self.user_phone or self.user}: {self.points} pts ({self.tier})"

# Backward compatibility alias for existing serializers/views
LoyaltyCard = LoyaltyPoints


# =============================================================================
# 5. TRANSACTION MODEL
# =============================================================================
class Transaction(models.Model):
    """
    Core financial transaction model for ShopGenie.
    Tracks all purchases, refunds, UPI settlements, and wallet debits/credits.
    Uses PostgreSQL NUMERIC for exact currency math and JSONB for gateway metadata.
    """
    TRANSACTION_TYPES = (
        ('purchase', 'Purchase / Self-Checkout'),
        ('refund', 'Refund'),
        ('wallet_topup', 'Wallet Top-up'),
        ('loyalty_cashback', 'Loyalty Cashback Credit'),
    )

    PAYMENT_METHODS = (
        ('upi', 'UPI Payment (GPay, PhonePe, Paytm)'),
        ('card', 'Debit / Credit Card'),
        ('wallet', 'ShopGenie Cash Wallet'),
        ('counter_cash', 'Counter Cash Payment'),
        ('loyalty_points', 'Loyalty Points Redemption'),
    )

    STATUS_CHOICES = (
        ('initiated', 'Initiated'),
        ('pending', 'Pending Confirmation'),
        ('successful', 'Successful / Settled'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )

    id = models.CharField(max_length=64, primary_key=True, default=generate_transaction_id)
    user = models.ForeignKey(
        User,
        related_name='transactions',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    shop = models.ForeignKey(Shop, related_name='transactions', on_delete=models.CASCADE)
    order = models.ForeignKey(
        'Order',
        related_name='transactions',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    transaction_type = models.CharField(max_length=32, choices=TRANSACTION_TYPES, default='purchase')
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="Total transaction amount in INR (PostgreSQL NUMERIC)"
    )
    fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Gateway processing fee"
    )
    tax = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Taxes applied (GST)"
    )
    payment_method = models.CharField(max_length=32, choices=PAYMENT_METHODS, default='upi')
    payment_gateway_ref = models.CharField(
        max_length=128,
        blank=True,
        default='',
        db_index=True,
        help_text="UPI UTR number, Razorpay ID, or Stripe Intent ID"
    )
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='successful', db_index=True)
    currency = models.CharField(max_length=10, default='INR')
    customer_phone = models.CharField(max_length=50, blank=True, default='')
    customer_email = models.CharField(max_length=100, blank=True, default='')
    # PostgreSQL native JSONB field for payment gateway receipts & breakdown
    metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text="Gateway payload, item breakdown, and device info in PostgreSQL JSONB"
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'shopgenie_transactions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['shop', 'status']),
            models.Index(fields=['payment_gateway_ref']),
            models.Index(fields=['created_at']),
            models.Index(fields=['status', 'created_at']),
        ]

    def __str__(self):
        return f"Txn {self.id} | ₹{self.amount} via {self.payment_method} | {self.status.upper()}"


# =============================================================================
# ADDITIONAL SHOPGENIE MODELS (Orders, Offers, Posts, Notifications)
# =============================================================================

class Offer(models.Model):
    """
    Store promotions, percentage discounts, flat cashback, and flash deals.
    """
    OFFER_TYPES = (
        ('percentage', 'Percentage'),
        ('flat', 'Flat Amount'),
        ('bogo', 'Buy 1 Get 1'),
    )
    id = models.CharField(max_length=64, primary_key=True, default=generate_offer_id)
    shop = models.ForeignKey(Shop, related_name='offers', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    type = models.CharField(max_length=32, choices=OFFER_TYPES, default='percentage')
    value = models.IntegerField(default=10)
    code = models.CharField(max_length=64, db_index=True)
    valid_from = models.CharField(max_length=64, default='')
    valid_to = models.CharField(max_length=64, default='')
    banner_gradient = models.CharField(max_length=255, default='from-amber-500 to-orange-600')
    applicable_categories = models.JSONField(default=list, blank=True, help_text="Stored as PostgreSQL JSONB")
    min_order_value = models.IntegerField(default=0)
    is_ending_soon = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'shopgenie_offers'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['shop', 'code']),
        ]

    def __str__(self):
        return f"{self.title} ({self.code})"


class Order(models.Model):
    """
    Customer self-checkout basket and completed store orders.
    Generates cryptographic Exit Pass QR code for store exit gate verification.
    """
    STATUS_CHOICES = (
        ('paid', 'Paid'),
        ('collected', 'Collected'),
        ('refunded', 'Refunded'),
        ('cancelled', 'Cancelled'),
    )
    PAYMENT_CHOICES = (
        ('upi', 'UPI Payment'),
        ('card', 'Debit / Credit Card'),
        ('counter_cash', 'Counter Cash'),
    )
    id = models.CharField(max_length=64, primary_key=True, default=generate_order_id)
    user = models.ForeignKey(
        User,
        related_name='orders',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    shop = models.ForeignKey(Shop, related_name='orders', on_delete=models.CASCADE)
    customer_phone = models.CharField(max_length=50, blank=True, default='', db_index=True)
    customer_email = models.CharField(max_length=100, blank=True, default='')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    loyalty_points_used = models.IntegerField(default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='paid', db_index=True)
    payment_method = models.CharField(max_length=32, choices=PAYMENT_CHOICES, default='upi')
    payment_id = models.CharField(max_length=128, blank=True, default='', db_index=True)
    exit_pass_qr = models.TextField(blank=True, default='')
    exit_pass_verified = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'shopgenie_orders'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['shop', 'status']),
            models.Index(fields=['customer_phone']),
            models.Index(fields=['exit_pass_verified']),
        ]

    def __str__(self):
        return f"Order {self.id} - {self.shop.name} (Total: ₹{self.total})"


class OrderItem(models.Model):
    """
    Individual scanned product line-item inside an Order.
    """
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product_id = models.CharField(max_length=64, db_index=True)
    product_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=1)
    image_url = models.URLField(max_length=1024, blank=True, default='')

    class Meta:
        db_table = 'shopgenie_order_items'

    def __str__(self):
        return f"{self.quantity}x {self.product_name} in {self.order.id}"


class FeedPost(models.Model):
    """
    Hyperlocal discovery social feed posts published by neighborhood stores.
    """
    id = models.CharField(max_length=64, primary_key=True, default=generate_post_id)
    shop = models.ForeignKey(Shop, related_name='feed_posts', on_delete=models.CASCADE)
    area = models.CharField(max_length=200, default='', db_index=True)
    time_ago = models.CharField(max_length=100, default='Just now')
    text = models.TextField()
    image_url = models.URLField(max_length=1024, blank=True, default='')
    offer_tag = models.CharField(max_length=100, blank=True, default='')
    likes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'shopgenie_feed_posts'
        ordering = ['-created_at']

    def __str__(self):
        return f"Post by {self.shop.name}: {self.text[:40]}"


class Notification(models.Model):
    """
    Real-time push notifications and alerts for orders, offers, and loyalty rewards.
    """
    TYPE_CHOICES = (
        ('offer', 'Offer'),
        ('reward', 'Reward'),
        ('order', 'Order'),
        ('update', 'Update'),
    )
    id = models.CharField(max_length=64, primary_key=True, default=generate_notif_id)
    user = models.ForeignKey(
        User,
        related_name='notifications',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=32, choices=TYPE_CHOICES, default='update', db_index=True)
    read = models.BooleanField(default=False)
    action_url = models.CharField(max_length=500, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'shopgenie_notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.type}] {self.title}"
