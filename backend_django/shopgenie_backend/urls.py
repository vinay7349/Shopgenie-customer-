from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def root_health_check(request):
    return JsonResponse({
        'status': 'online',
        'service': 'ShopGenie Django REST API',
        'version': '1.0.0',
        'endpoints': {
            'admin': '/admin/',
            'api_root': '/api/',
            'shops': '/api/shops/',
            'products': '/api/products/',
            'barcode_lookup': '/api/products/lookup_barcode/?barcode=...',
            'offers': '/api/offers/',
            'orders': '/api/orders/',
            'loyalty': '/api/loyalty/',
            'feed': '/api/feed/',
            'notifications': '/api/notifications/',
        }
    })

urlpatterns = [
    path('', root_health_check, name='health_check'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
