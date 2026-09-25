from django.contrib import admin
from .models import Shop, Product, Offer, Order, OrderItem, LoyaltyCard, FeedPost, Notification

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
    search_fields = ('name', 'barcode')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'shop', 'total', 'status', 'payment_method', 'exit_pass_verified', 'created_at')
    list_filter = ('status', 'payment_method', 'exit_pass_verified')
    inlines = [OrderItemInline]

@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ('title', 'shop', 'code', 'type', 'value', 'valid_to', 'is_ending_soon')
    list_filter = ('type', 'is_ending_soon', 'shop')
    search_fields = ('title', 'code')

@admin.register(LoyaltyCard)
class LoyaltyCardAdmin(admin.ModelAdmin):
    list_display = ('id', 'shop', 'tier', 'points', 'next_reward_at')
    list_filter = ('tier', 'shop')

@admin.register(FeedPost)
class FeedPostAdmin(admin.ModelAdmin):
    list_display = ('id', 'shop', 'area', 'likes', 'created_at')
    search_fields = ('text',)

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'read', 'created_at')
    list_filter = ('type', 'read')
