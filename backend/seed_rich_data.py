import os
import django
import random
from decimal import Decimal
from django.utils.text import slugify

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proj.settings')
django.setup()

from property.models import (
    Country, City, PropertyMainType, PropertySubTypes, 
    PropertyPurpose, Amenity, Property
)
from users.models import CustomUser

def seed_rich_data():
    print("Starting rich data seeding...")

    # Clear existing property data (keep countries, main types, purposes, amenities but recreate to ensure fresh ids if needed, or get existing)
    print("Cleaning existing property data...")
    Property.objects.all().delete()
    City.objects.all().delete()
    Country.objects.all().delete()
    PropertySubTypes.objects.all().delete()
    PropertyMainType.objects.all().delete()
    PropertyPurpose.objects.all().delete()
    Amenity.objects.all().delete()

    # 1. Create Countries
    countries_data = [
        {"name": "Saudi Arabia", "code": "🇸🇦", "slug": "sa"},
        {"name": "United Arab Emirates", "code": "🇦🇪", "slug": "uae"},
        {"name": "Egypt", "code": "🇪🇬", "slug": "eg"},
    ]
    countries = {}
    for data in countries_data:
        country, created = Country.objects.get_or_create(
            code=data["code"],
            defaults={"country_name": data["name"], "country_slug": data["slug"]}
        )
        countries[data["slug"]] = country
        print(f"Verified country: {country.country_name} ({data['slug']})")

    # 2. Create Cities
    cities_data = [
        {"name": "Riyadh", "country": countries["sa"]},
        {"name": "Jeddah", "country": countries["sa"]},
        {"name": "Dubai", "country": countries["uae"]},
        {"name": "Abu Dhabi", "country": countries["uae"]},
        {"name": "Cairo", "country": countries["eg"]},
    ]
    cities = {}
    for data in cities_data:
        city, created = City.objects.get_or_create(
            city_name=data["name"],
            defaults={"country": data["country"]}
        )
        cities[data["name"].lower()] = city
        print(f"Verified city: {city.city_name}")

    # 3. Create Main Types
    main_types = {}
    for name in ["Residential", "Commercial"]:
        mtype, created = PropertyMainType.objects.get_or_create(
            maintype_name=name.lower()
        )
        main_types[name.lower()] = mtype
        print(f"Verified main type: {mtype.maintype_name}")

    # 4. Create Sub Types
    sub_types_data = {
        "residential": ["Apartment", "Villa", "Farm", "Duplex", "Compound"],
        "commercial": ["Office Space", "Retail", "Warehouse", "Shop", "Show Room"]
    }
    sub_types = {}
    for main_name, subs in sub_types_data.items():
        main_obj = main_types[main_name]
        sub_types[main_name] = {}
        for sub_name in subs:
            stype, created = PropertySubTypes.objects.get_or_create(
                subtype_name=sub_name,
                defaults={"main_type": main_obj}
            )
            sub_types[main_name][sub_name.lower()] = stype
            print(f"Verified sub type: {stype.subtype_name} under {main_name}")

    # 5. Create Purposes
    purposes = {}
    for name in ["Sale", "Rent"]:
        purpose, created = PropertyPurpose.objects.get_or_create(
            purpose_name=name.lower()
        )
        purposes[name.lower()] = purpose
        print(f"Verified purpose: {purpose.purpose_name}")

    # 6. Create Amenities
    amenities_data = ["Parking", "Swimming Pool", "Gym", "Balcony", "Security", "Elevator", "Garden", "Central A/C", "Internet"]
    amenity_objs = []
    for name in amenities_data:
        amenity, created = Amenity.objects.get_or_create(
            amenity_name=name
        )
        amenity_objs.append(amenity)
        print(f"Verified amenity: {amenity.amenity_name}")

    # 7. Get or Create Owner (Admin User)
    admin_user = CustomUser.objects.filter(role='admin').first()
    if not admin_user:
        admin_user = CustomUser.objects.create_superuser('admin@example.com', 'adminpass123')
        admin_user.role = 'admin'
        admin_user.save()
        print("Created admin user.")

    # Base coordinates for cities
    city_coordinates = {
        "riyadh": {"lat": 24.7136, "lng": 46.6753},
        "jeddah": {"lat": 21.5433, "lng": 39.1728},
        "dubai": {"lat": 25.2048, "lng": 55.2708},
        "abu dhabi": {"lat": 24.4539, "lng": 54.3773},
        "cairo": {"lat": 30.0444, "lng": 31.2357},
    }

    # High-quality details for seeding
    properties_to_seed = []

    # --- SAUDI ARABIA ---
    sa_res_sale = [
        {"title": "Modern 3BR Apartment in Olaya", "city": "riyadh", "district": "Olaya District", "sub_type": "apartment", "price": 1200000, "size": 180, "beds": 3, "baths": 3},
        {"title": "Luxury Villa with Private Garden", "city": "riyadh", "district": "Al Nakheel District", "sub_type": "villa", "price": 4500000, "size": 450, "beds": 5, "baths": 6},
        {"title": "Elegant Duplex in Yasmin", "city": "riyadh", "district": "Yasmin District", "sub_type": "duplex", "price": 2300000, "size": 320, "beds": 4, "baths": 4},
        {"title": "Spacious Family Villa in Al Naeem", "city": "jeddah", "district": "Al Naeem District", "sub_type": "villa", "price": 3800000, "size": 400, "beds": 5, "baths": 5},
        {"title": "Premium Penthouse with City View", "city": "jeddah", "district": "Al Shaty District", "sub_type": "apartment", "price": 2900000, "size": 280, "beds": 4, "baths": 4},
    ]
    sa_res_rent = [
        {"title": "Furnished Studio near Business Center", "city": "riyadh", "district": "Olaya District", "sub_type": "apartment", "price": 45000, "size": 60, "beds": 1, "baths": 1},
        {"title": "Modern 3BR Apartment near Jeddah Corniche", "city": "jeddah", "district": "Al Shaty District", "sub_type": "apartment", "price": 85000, "size": 160, "beds": 3, "baths": 3},
        {"title": "Luxury Villa in Secured Compound", "city": "jeddah", "district": "Al Khalidiyyah District", "sub_type": "compound", "price": 180000, "size": 380, "beds": 4, "baths": 5},
        {"title": "Spacious Apartment for Families", "city": "riyadh", "district": "Al Wurud District", "sub_type": "apartment", "price": 60000, "size": 140, "beds": 2, "baths": 2},
        {"title": "Cozy Duplex with Garden Access", "city": "riyadh", "district": "Al Malaz District", "sub_type": "duplex", "price": 95000, "size": 220, "beds": 3, "baths": 3},
    ]
    sa_comm_sale = [
        {"title": "Prime Office Space on King Fahd Road", "city": "riyadh", "district": "Olaya District", "sub_type": "office space", "price": 3500000, "size": 250, "beds": None, "baths": None},
        {"title": "Retail Showroom on Tahlia Street", "city": "jeddah", "district": "Al Shaty District", "sub_type": "show room", "price": 7800000, "size": 500, "beds": None, "baths": None},
        {"title": "Large Warehouse in Industrial Area", "city": "riyadh", "district": "Sulay Industrial Area", "sub_type": "warehouse", "price": 12000000, "size": 1500, "beds": None, "baths": None},
        {"title": "Commercial Ground Floor Shop", "city": "jeddah", "district": "Al Hamra District", "sub_type": "shop", "price": 1800000, "size": 120, "beds": None, "baths": None},
        {"title": "Modern Corporate Office Suite", "city": "riyadh", "district": "Al Malaz District", "sub_type": "office space", "price": 5200000, "size": 350, "beds": None, "baths": None},
    ]
    sa_comm_rent = [
        {"title": "Furnished Office in Business Tower", "city": "riyadh", "district": "Olaya District", "sub_type": "office space", "price": 120000, "size": 110, "beds": None, "baths": None},
        {"title": "Corner Retail Shop on Busy Avenue", "city": "jeddah", "district": "Al Naeem District", "sub_type": "shop", "price": 75000, "size": 80, "beds": None, "baths": None},
        {"title": "Logistics Warehouse with Security", "city": "riyadh", "district": "Sulay Industrial Area", "sub_type": "warehouse", "price": 250000, "size": 1000, "beds": None, "baths": None},
        {"title": "Retail Space near Popular Mall", "city": "jeddah", "district": "Al Shaty District", "sub_type": "retail", "price": 160000, "size": 150, "beds": None, "baths": None},
        {"title": "High-end Showroom on King Road", "city": "jeddah", "district": "Al Khalidiyyah District", "sub_type": "show room", "price": 380000, "size": 400, "beds": None, "baths": None},
    ]

    # --- UAE ---
    uae_res_sale = [
        {"title": "Luxury Apartment with Marina View", "city": "dubai", "district": "Dubai Marina", "sub_type": "apartment", "price": 2200000, "size": 140, "beds": 2, "baths": 2},
        {"title": "Ultra-Luxury Villa on Palm Jumeirah", "city": "dubai", "district": "Palm Jumeirah", "sub_type": "villa", "price": 15000000, "size": 650, "beds": 6, "baths": 7},
        {"title": "Modern Loft in Downtown Dubai", "city": "dubai", "district": "Downtown Dubai", "sub_type": "apartment", "price": 1800000, "size": 95, "beds": 1, "baths": 2},
        {"title": "Premium Golf Course Villa", "city": "abu dhabi", "district": "Saadiyat Island", "sub_type": "villa", "price": 8500000, "size": 520, "beds": 5, "baths": 6},
        {"title": "High-floor Apartment with Sea View", "city": "abu dhabi", "district": "Al Reem Island", "sub_type": "apartment", "price": 1100000, "size": 120, "beds": 2, "baths": 2},
    ]
    uae_res_rent = [
        {"title": "Stunning Studio in Business Bay", "city": "dubai", "district": "Business Bay", "sub_type": "apartment", "price": 65000, "size": 55, "beds": 1, "baths": 1},
        {"title": "Premium Apartment in Waterfront Tower", "city": "dubai", "district": "Dubai Marina", "sub_type": "apartment", "price": 120000, "size": 130, "beds": 2, "baths": 3},
        {"title": "Beachfront Apartment on Yas Island", "city": "abu dhabi", "district": "Yas Island", "sub_type": "apartment", "price": 95000, "size": 110, "beds": 2, "baths": 2},
        {"title": "Luxury Family Villa for Rent", "city": "abu dhabi", "district": "Khalifa City", "sub_type": "villa", "price": 210000, "size": 450, "beds": 5, "baths": 6},
        {"title": "Cozy Family Apartment near Metro", "city": "dubai", "district": "Jumeirah Lakes Towers", "sub_type": "apartment", "price": 80000, "size": 90, "beds": 1, "baths": 2},
    ]
    uae_comm_sale = [
        {"title": "Premium Corporate Office Space", "city": "dubai", "district": "Business Bay", "sub_type": "office space", "price": 2500000, "size": 160, "beds": None, "baths": None},
        {"title": "Retail Unit in Marina Promenade", "city": "dubai", "district": "Dubai Marina", "sub_type": "retail", "price": 5800000, "size": 220, "beds": None, "baths": None},
        {"title": "Industrial Warehouse in Jebel Ali", "city": "dubai", "district": "Jebel Ali Industrial", "sub_type": "warehouse", "price": 9000000, "size": 1200, "beds": None, "baths": None},
        {"title": "Office Suite with Panoramic View", "city": "abu dhabi", "district": "Al Reem Island", "sub_type": "office space", "price": 1900000, "size": 130, "beds": None, "baths": None},
        {"title": "Commercial Showroom on Sheikh Zayed Road", "city": "dubai", "district": "Sheikh Zayed Road Area", "sub_type": "show room", "price": 18000000, "size": 800, "beds": None, "baths": None},
    ]
    uae_comm_rent = [
        {"title": "Fully Fitted Corporate Office in JLT", "city": "dubai", "district": "Jumeirah Lakes Towers", "sub_type": "office space", "price": 110000, "size": 120, "beds": None, "baths": None},
        {"title": "Retail Shop in Downtown Dubai", "city": "dubai", "district": "Downtown Dubai", "sub_type": "shop", "price": 280000, "size": 95, "beds": None, "baths": None},
        {"title": "Logistics Warehouse in Freezone", "city": "dubai", "district": "Jebel Ali Freezone", "sub_type": "warehouse", "price": 350000, "size": 1500, "beds": None, "baths": None},
        {"title": "Modern Commercial Office Suite", "city": "abu dhabi", "district": "Corniche Road Area", "sub_type": "office space", "price": 140000, "size": 140, "beds": None, "baths": None},
        {"title": "Spacious Showroom for Rent", "city": "abu dhabi", "district": "Khalifa City Area", "sub_type": "show room", "price": 400000, "size": 500, "beds": None, "baths": None},
    ]

    # --- EGYPT ---
    eg_res_sale = [
        {"title": "Luxury Villa in Fifth Settlement", "city": "cairo", "district": "Fifth Settlement", "sub_type": "villa", "price": 14000000, "size": 420, "beds": 5, "baths": 5},
        {"title": "Modern Apartment in Sheikh Zayed", "city": "cairo", "district": "Sheikh Zayed City", "sub_type": "apartment", "price": 3500000, "size": 160, "beds": 3, "baths": 2},
        {"title": "Elegant Apartment with Nile View", "city": "cairo", "district": "Zamalek", "sub_type": "apartment", "price": 8500000, "size": 200, "beds": 3, "baths": 3},
        {"title": "Spacious Townhouse in Compound", "city": "cairo", "district": "New Cairo Compound", "sub_type": "compound", "price": 9200000, "size": 280, "beds": 4, "baths": 4},
        {"title": "Cozy Apartment in Heliopolis", "city": "cairo", "district": "Heliopolis", "sub_type": "apartment", "price": 2800000, "size": 130, "beds": 2, "baths": 2},
    ]
    eg_res_rent = [
        {"title": "Charming Apartment with Balcony", "city": "cairo", "district": "Zamalek", "sub_type": "apartment", "price": 300000, "size": 150, "beds": 2, "baths": 2},
        {"title": "Modern 3BR Apartment for Rent", "city": "cairo", "district": "Maadi", "sub_type": "apartment", "price": 216000, "size": 180, "beds": 3, "baths": 3},
        {"title": "Luxury Villa in Gated Compound", "city": "cairo", "district": "Fifth Settlement Compound", "sub_type": "villa", "price": 780000, "size": 450, "beds": 5, "baths": 5},
        {"title": "Cozy Studio Apartment for Rent", "city": "cairo", "district": "Sheikh Zayed", "sub_type": "apartment", "price": 120000, "size": 70, "beds": 1, "baths": 1},
        {"title": "Family Duplex with Terrace", "city": "cairo", "district": "Heliopolis", "sub_type": "duplex", "price": 360000, "size": 260, "beds": 4, "baths": 3},
    ]
    eg_comm_sale = [
        {"title": "Prime Office Space for Sale", "city": "cairo", "district": "Fifth Settlement", "sub_type": "office space", "price": 6500000, "size": 120, "beds": None, "baths": None},
        {"title": "Retail Shop in Modern Mall", "city": "cairo", "district": "Sheikh Zayed City", "sub_type": "shop", "price": 12000000, "size": 90, "beds": None, "baths": None},
        {"title": "Large Commercial Warehouse", "city": "cairo", "district": "Obour City Industrial", "sub_type": "warehouse", "price": 15000000, "size": 1000, "beds": None, "baths": None},
        {"title": "Fully Equipped Medical Clinic", "city": "cairo", "district": "New Cairo Mall", "sub_type": "office space", "price": 4200000, "size": 75, "beds": None, "baths": None},
        {"title": "Standalone Commercial Building", "city": "cairo", "district": "Heliopolis", "sub_type": "office space", "price": 45000000, "size": 800, "beds": None, "baths": None},
    ]
    eg_comm_rent = [
        {"title": "Fitted Office Space in Business Park", "city": "cairo", "district": "Fifth Settlement", "sub_type": "office space", "price": 540000, "size": 110, "beds": None, "baths": None},
        {"title": "Retail Shop on Maadi High Street", "city": "cairo", "district": "Maadi Road 9", "sub_type": "shop", "price": 720000, "size": 80, "beds": None, "baths": None},
        {"title": "Warehouse with High Ceilings", "city": "cairo", "district": "Obour Industrial", "sub_type": "warehouse", "price": 960000, "size": 800, "beds": None, "baths": None},
        {"title": "Clinic Space in Medical Center", "city": "cairo", "district": "Heliopolis", "sub_type": "office space", "price": 300000, "size": 60, "beds": None, "baths": None},
        {"title": "Premium Showroom on Nile View Road", "city": "cairo", "district": "Zamalek", "sub_type": "show room", "price": 1440000, "size": 300, "beds": None, "baths": None},
    ]

    # Combine all items
    seeding_config = [
        (sa_res_sale, "sa", "residential", "sale", "SAR"),
        (sa_res_rent, "sa", "residential", "rent", "SAR"),
        (sa_comm_sale, "sa", "commercial", "sale", "SAR"),
        (sa_comm_rent, "sa", "commercial", "rent", "SAR"),
        (uae_res_sale, "uae", "residential", "sale", "AED"),
        (uae_res_rent, "uae", "residential", "rent", "AED"),
        (uae_comm_sale, "uae", "commercial", "sale", "AED"),
        (uae_comm_rent, "uae", "commercial", "rent", "AED"),
        (eg_res_sale, "eg", "residential", "sale", "EGP"),
        (eg_res_rent, "eg", "residential", "rent", "EGP"),
        (eg_comm_sale, "eg", "commercial", "sale", "EGP"),
        (eg_comm_rent, "eg", "commercial", "rent", "EGP"),
    ]

    for properties, country_slug, maintype_slug, purpose_slug, currency in seeding_config:
        country_obj = countries[country_slug]
        mtype_obj = main_types[maintype_slug]
        purpose_obj = purposes[purpose_slug]

        for p_data in properties:
            city_obj = cities[p_data["city"]]
            sub_type_obj = sub_types[maintype_slug][p_data["sub_type"]]

            # Add random coordinate offset based on city coordinates
            base_coords = city_coordinates[p_data["city"]]
            lat = Decimal(base_coords["lat"] + random.uniform(-0.015, 0.015))
            lng = Decimal(base_coords["lng"] + random.uniform(-0.015, 0.015))

            prop = Property.objects.create(
                owner=admin_user,
                title=p_data["title"],
                description=f"This is a premium property matching your high standards. Located in {p_data['district']}, {city_obj.city_name}. Features modern architecture, spacious rooms, and central location.",
                country=country_obj,
                city=city_obj,
                area=p_data["district"].split(" ")[0],
                district=p_data["district"],
                latitude=lat,
                longitude=lng,
                pmain_type=mtype_obj,
                psub_type=sub_type_obj,
                purpose=purpose_obj,
                property_size=Decimal(p_data["size"]),
                bedrooms=p_data["beds"],
                bathrooms=p_data["baths"],
                property_age=random.randint(1, 10),
                price=Decimal(p_data["price"]),
                currency=currency,
                is_published=True
            )

            # Assign random amenities
            random_amenities = random.sample(amenity_objs, random.randint(3, 6))
            prop.amenities.set(random_amenities)

            print(f"Created Property: {prop.title} | {city_obj.city_name} | {currency} {prop.price}")

    print("Successfully seeded 60 high-quality properties!")

if __name__ == "__main__":
    seed_rich_data()
