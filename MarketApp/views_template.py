from django.shortcuts import render
from django.templatetags.static import static
from rest_framework.utils import json

image_sources = [
    static('MarketApp/img/promo1.png'),
    static('MarketApp/img/promo2.png'),
    static('MarketApp/img/promo3.png')
]

def render_template(request, template_name):
    return render(request, f'MarketApp/{template_name}.html', {'image_sources': json.dumps(image_sources)})

# Определяем представления динамически
views = ['authorization', 'favorites', 'index', 'money', 'orders', 'products', 'profile', 'register', 'subcategories']

# Создаём функции представлений автоматически
globals().update({name: (lambda request, name=name: render_template(request, name)) for name in views})