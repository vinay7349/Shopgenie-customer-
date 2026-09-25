from django.db import models
import uuid

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

def generate_post_id():
    return f"post-{uuid.uuid4().hex[:8]}"

def generate_notif_id():
    return f"notif-{uuid.uuid4().hex[:8]}"

class Shop(models.Model):
    id = models.CharField(max_length=64, primary_key=True, default=generate_shop_id)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
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
    area = models.CharField(max_length=200, default='Rajarajeshwari Nagar')
    phone = models.CharField(max_length=50, blank=True, default='')
    supports_self_checkout = models.BooleanField(default=True)
    verified = models.BooleanField(default=True)
    payment_methods = models.JSONField(default=list, blank=True)
    description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.area})"

class Product(models.Model):
    id = models.CharField(max_length=64, primary_key=True, default=generate_prod_id)
    shop = models.ForeignKey(Shop, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    mrp = models.DecimalField(max_digits=10, decimal_places=2)
    discount_pct = models.IntegerField(default=0)
    stock = models.IntegerField(default=10)
    image_urls = models.JSONField(default=list, blank=True)
    barcode = models.CharField(max_length=64, db_index=True)
    description = models.TextField(blank=True, default='')
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.shop.name}"

class Offer(models.Model):
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
    code = models.CharField(max_length=64)
    valid_from = models.CharField(max_length=64, default='')
    valid_to = models.CharField(max_length=64, default='')
    banner_gradient = models.CharField(max_length=255, default='from-amber-500 to-orange-600')
    applicable_categories = models.JSONField(default=list, blank=True)
    min_order_value = models.IntegerField(default=0)
    is_ending_soon = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.code})"

class Order(models.Model):
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
    shop = models.ForeignKey(Shop, related_name='orders', on_delete=models.CASCADE)
    customer_phone = models.CharField(max_length=50, blank=True, default='')
    customer_email = models.CharField(max_length=100, blank=True, default='')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    loyalty_points_used = models.IntegerField(default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='paid')
    payment_method = models.CharField(max_length=32, choices=PAYMENT_CHOICES, default='upi')
    payment_id = models.CharField(max_length=128, blank=True, default='')
    exit_pass_qr = models.TextField(blank=True, default='')
    exit_pass_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.shop.name} (Total: ₹{self.total})"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product_id = models.CharField(max_length=64)
    product_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=1)
    image_url = models.URLField(max_length=1024, blank=True, default='')

    def __str__(self):
        return f"{self.quantity}x {self.product_name} in {self.order.id}"

class LoyaltyCard(models.Model):
    TIER_CHOICES = (
        ('Bronze', 'Bronze'),
        ('Silver', 'Silver'),
        ('Gold', 'Gold'),
        ('Diamond', 'Diamond'),
    )
    id = models.CharField(max_length=64, primary_key=True, default=generate_loyalty_id)
    shop = models.ForeignKey(Shop, related_name='loyalty_cards', on_delete=models.CASCADE)
    user_phone = models.CharField(max_length=50, blank=True, default='')
    points = models.IntegerField(default=0)
    next_reward_at = models.IntegerField(default=200)
    tier = models.CharField(max_length=32, choices=TIER_CHOICES, default='Silver')
    barcode = models.CharField(max_length=64, default='')
    available_rewards = models.JSONField(default=list, blank=True)
    history = models.JSONField(default=list, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Loyalty {self.shop.name} ({self.points} pts)"

class FeedPost(models.Model):
    id = models.CharField(max_length=64, primary_key=True, default=generate_post_id)
    shop = models.ForeignKey(Shop, related_name='feed_posts', on_delete=models.CASCADE)
    area = models.CharField(max_length=200, default='')
    time_ago = models.CharField(max_length=100, default='Just now')
    text = models.TextField()
    image_url = models.URLField(max_length=1024, blank=True, default='')
    offer_tag = models.CharField(max_length=100, blank=True, default='')
    likes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post by {self.shop.name}: {self.text[:40]}"

class Notification(models.Model):
    TYPE_CHOICES = (
        ('offer', 'Offer'),
        ('reward', 'Reward'),
        ('order', 'Order'),
        ('update', 'Update'),
    )
    id = models.CharField(max_length=64, primary_key=True, default=generate_notif_id)
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=32, choices=TYPE_CHOICES, default='update')
    read = models.BooleanField(default=False)
    action_url = models.CharField(max_length=500, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.type}] {self.title}"
