import os
import django
import random
import uuid
from decimal import Decimal
from django.utils.text import slugify

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proj.settings')
django.setup()

from property.models import (
    Country, City, PropertyMainType, PropertySubTypes, 
    PropertyPurpose, Amenity, Property
)
from users.models import CustomUser

def seed_data():
    print("Starting data seeding...")

    # 1. Countries
    countries_data = [
        {"name": "Saudi Arabia", "code": "SA"},
        {"name": "United Arab Emirates", "code": "AE"},
        {"name": "Egypt", "code": "EG"},
    ]
    countries = []
    for data in countries_data:
        country, created = Country.objects.get_or_create(
            code=data["code"],
            defaults={"country_name": data["name"]}
        )
        countries.append(country)
        if created:
            print(f"Created country: {country.country_name}")

    # 2. Cities
    cities_data = [
        {"name": "Riyadh", "country": countries[0]},
        {"name": "Jeddah", "country": countries[0]},
        {"name": "Dubai", "country": countries[1]},
        {"name": "Abu Dhabi", "country": countries[1]},
        {"name": "Cairo", "country": countries[2]},
    ]
    cities = []
    for data in cities_data:
        city, created = City.objects.get_or_create(
            city_name=data["name"],
            defaults={"country": data["country"]}
        )
        cities.append(city)
        if created:
            print(f"Created city: {city.city_name}")

    # 3. Main Types
    main_types_data = ["Residential", "Commercial"]
    main_types = []
    for name in main_types_data:
        mtype, created = PropertyMainType.objects.get_or_create(
            maintype_name=name.lower()
        )
        main_types.append(mtype)
        if created:
            print(f"Created main type: {mtype.maintype_name}")

    # 4. Sub Types
    sub_types_data = {
        "residential": ["Apartment", "Villa", "Farm", "Duplex", "Compound"],
        "commercial": ["Office Space", "Retail", "Warehouse", "Shop", "Show Room"]
    }
    sub_types = []
    for main_name, subs in sub_types_data.items():
        main_obj = PropertyMainType.objects.get(maintype_name=main_name)
        for sub_name in subs:
            stype, created = PropertySubTypes.objects.get_or_create(
                subtype_name=sub_name,
                defaults={"main_type": main_obj}
            )
            sub_types.append(stype)
            if created:
                print(f"Created sub type: {stype.subtype_name} under {main_name}")

    # 5. Purposes
    purposes_data = ["Sale", "Rent"]
    purposes = []
    for name in purposes_data:
        purpose, created = PropertyPurpose.objects.get_or_create(
            purpose_name=name.lower()
        )
        purposes.append(purpose)
        if created:
            print(f"Created purpose: {purpose.purpose_name}")

    # 6. Amenities
    amenities_data = ["Parking", "Swimming Pool", "Gym", "Balcony", "Security", "Elevator", "Garden"]
    amenities = []
    for name in amenities_data:
        amenity, created = Amenity.objects.get_or_create(
            amenity_name=name
        )
        amenities.append(amenity)
        if created:
            print(f"Created amenity: {amenity.amenity_name}")

    # 7. Properties
    admin_user = CustomUser.objects.filter(role='admin').first()
    if not admin_user:
        print("Error: Admin user not found. Run the admin creation command first.")
        return

    titles = [
        "Luxury Villa with Private Pool",
        "Modern Apartment in City Center",
        "Spacious Office in Business Bay",
        "Charming Duplex with Garden",
        "Commercial Retail Space for Sale",
        "Elegant Penthouse with View",
        "Cozy Studio near Metro",
        "Premium Warehouse for Rent",
        "Family Home in Quiet Suburb",
        "High-end Retail Unit"
    ]

    for i in range(10):
        title = titles[i]
        city = random.choice(cities)
        mtype = random.choice(main_types)
        stype = random.choice([s for s in sub_types if s.main_type == mtype])
        purpose = random.choice(purposes)
        
        prop = Property.objects.create(
            owner=admin_user,
            title=title,
            description=f"Detailed description for {title}. This property is located in {city.city_name} and offers modern amenities.",
            country=city.country,
            city=city,
            area="Main Street",
            district=f"District {random.randint(1, 10)}",
            latitude=Decimal(random.uniform(20.0, 30.0)),
            longitude=Decimal(random.uniform(40.0, 50.0)),
            pmain_type=mtype,
            psub_type=stype,
            purpose=purpose,
            property_size=Decimal(random.uniform(50.0, 500.0)),
            bedrooms=random.randint(1, 6) if mtype.maintype_name == "residential" else None,
            bathrooms=random.randint(1, 4) if mtype.maintype_name == "residential" else None,
            property_age=random.randint(0, 20),
            price=Decimal(random.uniform(10000.0, 5000000.0)),
            currency="SAR",
            is_published=True
        )
        
        # Add random amenities
        random_amenities = random.sample(amenities, random.randint(2, 5))
        prop.amenities.set(random_amenities)
        
        print(f"Created property: {prop.title} in {city.city_name}")

    print("Data seeding completed successfully!")

if __name__ == "__main__":
    seed_data()
