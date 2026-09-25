from django.core.management.base import BaseCommand
from api.models import Shop, Product, Offer, LoyaltyCard, FeedPost, Notification

class Command(BaseCommand):
    help = 'Seeds initial ShopGenie shops, products, offers, and posts'

    def handle(self, *args, **options):
        self.stdout.write("Seeding ShopGenie initial data...")

        # 1. Shops
        shops_data = [
            {
                'id': 'shop-1',
                'name': 'The Old Coffee Roasters',
                'category': 'Bakery & Cafe',
                'logo_url': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80',
                'cover_url': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
                'lat': 12.9248,
                'lng': 77.5218,
                'distance_m': 320,
                'rating': 4.8,
                'review_count': 142,
                'follower_count': 384,
                'product_count': 5,
                'is_open': True,
                'hours': '8:00 AM - 10:30 PM',
                'address': '14, 5th Cross, Rajarajeshwari Nagar',
                'area': 'Rajarajeshwari Nagar',
                'phone': '+91 98450 12091',
                'supports_self_checkout': True,
                'verified': True,
                'payment_methods': ['UPI', 'Card', 'Cash'],
                'description': 'Freshly roasted single-estate Arabica beans, handcrafted pour-overs, sourdough toast, and artisanal baked croissants.'
            },
            {
                'id': 'shop-2',
                'name': 'Fresh Farm Produce Hub',
                'category': 'Supermarket',
                'logo_url': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
                'cover_url': 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80',
                'lat': 12.9255,
                'lng': 77.5230,
                'distance_m': 410,
                'rating': 4.6,
                'review_count': 320,
                'follower_count': 890,
                'product_count': 8,
                'is_open': True,
                'hours': '7:00 AM - 10:00 PM',
                'address': '88, Ideal Homes Circle, RR Nagar',
                'area': 'Rajarajeshwari Nagar',
                'phone': '+91 80 2860 1199',
                'supports_self_checkout': True,
                'verified': True,
                'payment_methods': ['UPI', 'Card', 'Cash', 'Sodexo'],
                'description': 'Direct-from-farm crisp greens, organic vegetables, seasonal Alphonso mangoes, and essential staples.'
            },
            {
                'id': 'shop-3',
                'name': 'CircuitGenie Electronics',
                'category': 'Electronics & Gadgets',
                'logo_url': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80',
                'cover_url': 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1200&q=80',
                'lat': 12.9262,
                'lng': 77.5210,
                'distance_m': 480,
                'rating': 4.7,
                'review_count': 215,
                'follower_count': 540,
                'product_count': 4,
                'is_open': True,
                'hours': '10:00 AM - 9:30 PM',
                'address': 'Plot 4, Remco Layout, RR Nagar',
                'area': 'Rajarajeshwari Nagar',
                'phone': '+91 94801 88320',
                'supports_self_checkout': True,
                'verified': True,
                'payment_methods': ['UPI', 'Card', 'No-Cost EMI'],
                'description': 'Authorised electronics dealer. Flagship tablets, ANC noise-cancelling headphones, high-speed GaN chargers, and smart home gear.'
            },
            {
                'id': 'shop-4',
                'name': 'Ivory Thread Atelier',
                'category': 'Fashion & Apparel',
                'logo_url': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
                'cover_url': 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',
                'lat': 12.9230,
                'lng': 77.5201,
                'distance_m': 560,
                'rating': 4.5,
                'review_count': 98,
                'follower_count': 412,
                'product_count': 6,
                'is_open': True,
                'hours': '11:00 AM - 9:00 PM',
                'address': '22, BEML Layout 3rd Stage',
                'area': 'Rajarajeshwari Nagar',
                'phone': '+91 97422 66012',
                'supports_self_checkout': False,
                'verified': True,
                'payment_methods': ['UPI', 'Card'],
                'description': 'Contemporary handloom linen shirts, breezy kurtas, indigo-dyed jackets, and sustainable casual wear.'
            }
        ]

        for s_data in shops_data:
            shop, created = Shop.objects.update_or_create(id=s_data['id'], defaults=s_data)
            action_str = 'Created' if created else 'Updated'
            self.stdout.write(f"  [{action_str}] Shop: {shop.name}")

        # 2. Products
        products_data = [
            {
                'id': 'p-1',
                'shop_id': 'shop-1',
                'name': 'Single Origin Ethiopian Pour-Over (250g)',
                'category': 'Bakery & Cafe',
                'price': 420.00,
                'mrp': 480.00,
                'discount_pct': 12,
                'stock': 18,
                'image_urls': ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'],
                'barcode': '8901030456121',
                'description': 'Light roast beans with bright notes of jasmine, bergamot, and sweet stone fruit.',
                'featured': True,
            },
            {
                'id': 'p-2',
                'shop_id': 'shop-1',
                'name': 'Artisanal Butter Almond Croissant',
                'category': 'Bakery & Cafe',
                'price': 160.00,
                'mrp': 180.00,
                'discount_pct': 11,
                'stock': 12,
                'image_urls': ['https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80'],
                'barcode': '8901030456138',
                'description': 'Double baked flaky French croissant generously filled with frangipane cream and toasted sliced almonds.',
                'featured': True,
            },
            {
                'id': 'p-3',
                'shop_id': 'shop-2',
                'name': 'Devgad Ratnagiri Alphonso Mangoes (1 Dozen)',
                'category': 'Supermarket',
                'price': 850.00,
                'mrp': 1050.00,
                'discount_pct': 19,
                'stock': 24,
                'image_urls': ['https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80'],
                'barcode': '8901030456206',
                'description': 'Naturally ripened GI-tagged Devgad Alphonso mangoes with rich saffron pulp and heavenly aroma.',
                'featured': True,
            },
            {
                'id': 'p-4',
                'shop_id': 'shop-2',
                'name': 'Cold-Pressed Virgin Coconut Oil (500ml)',
                'category': 'Supermarket',
                'price': 299.00,
                'mrp': 350.00,
                'discount_pct': 14,
                'stock': 35,
                'image_urls': ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80'],
                'barcode': '8901030456213',
                'description': 'Wood-pressed pure raw coconut oil processed without chemical refining or bleaching.',
                'featured': False,
            },
            {
                'id': 'p-5',
                'shop_id': 'shop-3',
                'name': 'SonicPulse Pro ANC Wireless Earbuds',
                'category': 'Electronics & Gadgets',
                'price': 2499.00,
                'mrp': 3999.00,
                'discount_pct': 37,
                'stock': 15,
                'image_urls': ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80'],
                'barcode': '8901030456305',
                'description': 'Hybrid active noise cancellation, 40-hour battery life with fast Qi wireless charging case.',
                'featured': True,
            }
        ]

        for p_data in products_data:
            prod, created = Product.objects.update_or_create(id=p_data['id'], defaults=p_data)
            action_str = 'Created' if created else 'Updated'
            self.stdout.write(f"  [{action_str}] Product: {prod.name}")

        # 3. Offers
        offers_data = [
            {
                'id': 'off-1',
                'shop_id': 'shop-1',
                'title': 'Morning Caffeine Kick: 20% OFF',
                'description': 'Get flat 20% discount on all manual pour-overs and cold brew bottles before 11:30 AM.',
                'type': 'percentage',
                'value': 20,
                'code': 'BREW20',
                'valid_from': '08:00 AM',
                'valid_to': '11:30 AM Daily',
                'banner_gradient': 'from-amber-600 via-orange-600 to-amber-700',
                'min_order_value': 200,
                'is_ending_soon': False
            },
            {
                'id': 'off-2',
                'shop_id': 'shop-2',
                'title': 'Weekend Fresh Harvest BOGO',
                'description': 'Buy any 1kg Organic Hydroponic greens and get fresh Italian sweet basil bunch free.',
                'type': 'bogo',
                'value': 100,
                'code': 'GREENSFREE',
                'valid_from': 'Fri 6 PM',
                'valid_to': 'Sun 9 PM',
                'banner_gradient': 'from-emerald-600 via-teal-600 to-green-700',
                'min_order_value': 350,
                'is_ending_soon': True
            }
        ]

        for o_data in offers_data:
            offer, created = Offer.objects.update_or_create(id=o_data['id'], defaults=o_data)
            action_str = 'Created' if created else 'Updated'
            self.stdout.write(f"  [{action_str}] Offer: {offer.title}")

        # 4. Loyalty Card
        LoyaltyCard.objects.update_or_create(
            id='card-1',
            defaults={
                'shop_id': 'shop-1',
                'points': 140,
                'next_reward_at': 200,
                'tier': 'Silver',
                'barcode': 'CARD-99120',
                'available_rewards': [
                    {'id': 'r-1', 'title': 'Free Specialty Espresso Shot', 'pointsRequired': 80, 'discountValue': 120, 'description': 'Single-origin espresso of your choice.'},
                    {'id': 'r-2', 'title': '₹150 Off Pour-Over Beans (250g)', 'pointsRequired': 150, 'discountValue': 150, 'description': 'Valid on any whole bean pouch.'}
                ],
                'history': [
                    {'id': 'tx-1', 'date': 'Yesterday', 'points': 42, 'type': 'earned', 'description': 'In-store scan purchase'}
                ]
            }
        )

        self.stdout.write(self.style.SUCCESS("ShopGenie Django backend seed data completed successfully!"))
