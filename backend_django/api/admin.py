from django.contrib import admin
from .models import (
    User, Shop, Product, LoyaltyPoints, Transaction,
    Offer, Order, OrderItem, FeedPost, Notification
)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'phone_number', 'role', 'wallet_balance', 'is_verified', 'created_at')
    list_filter = ('role', 'is_active', 'is_verified')
    search_fields = ('username', 'email', 'phone_number', 'full_name')

@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'area', 'rating', 'isOpen', 'supportsSelfCheckout')
    list_filter = ('category', 'area', 'is_open', 'supports_self_checkout')
    search_fields = ('name', 'address', 'area', 'phone')

    def isOpen(self, obj):
        return obj.is_open
    isOpen.boolean = True

    def supportsSelfCheckout(self, obj):
        return obj.supports_self_checkout
    supportsSelfCheckout.boolean = True

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'shop', 'category', 'price', 'mrp', 'stock', 'barcode', 'featured')
    list_filter = ('category', 'featured', 'shop')
    search_fields = ('name', 'barcode', 'sku')

@admin.register(LoyaltyPoints)
class LoyaltyPointsAdmin(admin.ModelAdmin):
    list_display = ('id', 'shop', 'user_phone', 'tier', 'points', 'next_reward_at', 'updated_at')
    list_filter = ('tier', 'shop')
    search_fields = ('user_phone', 'shop__name')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'shop', 'customer_phone', 'total', 'status', 'payment_method', 'exit_pass_verified', 'created_at')
    list_filter = ('status', 'payment_method', 'exit_pass_verified')
    search_fields = ('id', 'customer_phone', 'payment_id')
    inlines = [OrderItemInline]

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'shop', 'transaction_type', 'amount', 'payment_method', 'status', 'payment_gateway_ref', 'created_at')
    list_filter = ('transaction_type', 'payment_method', 'status')
    search_fields = ('id', 'payment_gateway_ref', 'customer_phone')

@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ('title', 'shop', 'code', 'type', 'value', 'valid_to', 'is_ending_soon')
    list_filter = ('type', 'is_ending_soon', 'shop')
    search_fields = ('title', 'code')

@admin.register(FeedPost)
class FeedPostAdmin(admin.ModelAdmin):
    list_display = ('id', 'shop', 'area', 'likes', 'created_at')
    search_fields = ('text',)

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'read', 'created_at')
    list_filter = ('type', 'read')
