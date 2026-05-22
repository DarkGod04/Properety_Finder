import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proj.settings')
django.setup()

from property.models import Property, Country, City, PropertyMainType, PropertySubTypes, PropertyPurpose
from users.models import CustomUser

admin_user = CustomUser.objects.filter(role='admin').first()
if not admin_user:
    admin_user = CustomUser.objects.create_superuser('admin@example.com', 'adminpass123')
    admin_user.role = 'admin'
    admin_user.save()

saudi = Country.objects.get(country_name='Saudi Arabia')
riyadh = City.objects.get(city_name='Riyadh')
residential = PropertyMainType.objects.get(maintype_name='residential')
apartment = PropertySubTypes.objects.get(subtype_name='Apartment', main_type=residential)
sale = PropertyPurpose.objects.get(purpose_name='sale')

for i in range(5):
    prop, created = Property.objects.get_or_create(
        title=f'Luxury Apartment {i} in Riyadh',
        defaults={
            'owner': admin_user,
            'description': f'This is a luxury apartment {i} located in the heart of Riyadh.',
            'country': saudi,
            'city': riyadh,
            'area': 'Olaya',
            'district': 'Olaya District',
            'latitude': Decimal('24.7136'),
            'longitude': Decimal('46.6753'),
            'pmain_type': residential,
            'psub_type': apartment,
            'purpose': sale,
            'property_size': Decimal('180.0'),
            'bedrooms': 3,
            'bathrooms': 3,
            'property_age': 2,
            'price': Decimal('850000.00'),
            'currency': 'SAR',
            'is_published': True
        }
    )
    if created:
        print(f"Created property: {prop.title}")
    else:
        print(f"Property already exists: {prop.title}")
