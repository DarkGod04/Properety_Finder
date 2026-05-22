from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import  Country, City, PropertyMainType, PropertySubTypes, PropertyPurpose, Amenity, Property, PropertyImage, PropertyLike, Message
from users.serializers import CustomUserSerializer
from users.models import CustomUser
from django.utils.text import slugify


# Country #######################################################################3
class CountrySerializer(serializers.ModelSerializer):
    
    country_name  = serializers.CharField(required=True, 
                                    max_length=100,
                                    help_text='Country name must be unique.',
                                    style={'placeholder': 'Country name here...'},
                                    validators=[UniqueValidator(queryset=Country.objects.all())]
                                    )                   
    
    code =  serializers.CharField(required=True, 
                                    max_length=2,
                                    help_text='ISO code like "SA", "AE"',
                                    style={'placeholder': 'ISO code name here...'},
                                    validators=[UniqueValidator(queryset=Country.objects.all())]
                                    )                   
    # cities group(objects) belong to this country - comes from City table - read only field
    cities = serializers.SlugRelatedField(
                                    many=True,
                                    read_only=True,
                                    slug_field='city_name'
                                    )
    
    class Meta:
        model = Country
        fields = ['id', 'country_name', 'code', 'country_slug', 'cities']
        read_only_fields = ('id', 'country_slug', 'cities', )

    
    
    def validate_country_name(self, value):
        if not value:
            raise serializers.ValidationError("Country name is required.")
        if Country.objects.filter(country_name=value).exists():
            raise serializers.ValidationError("This Country is already added.")
        return value
        

    def validate_code(self, value):
        """
        Validate that the code is not empty.
        """
        if not value:
            raise serializers.ValidationError("The Country code is required")
        return value



class UpdateCountrySerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(required=True, 
                                    max_length=100,
                                    help_text='Country name must be unique.',
                                    validators=[UniqueValidator(queryset=Country.objects.all())]
                                    )                   
    code = serializers.CharField(required=True, 
                                    max_length=3,
                                    help_text='IOS Code must be unique.',
                                    validators=[UniqueValidator(queryset=Country.objects.all())]
                                    ) 
    
    class Meta:
        model = Country
        fields = ['id', 'country_name', 'code']
        read_only_fields = ('id', 'country_slug', 'cities', )






# City ##################################################################
class CitySerializer(serializers.ModelSerializer):
    country = serializers.PrimaryKeyRelatedField(
        queryset=Country.objects.all(),
        help_text='Select a Country id for this city.'
    )
    city_name = serializers.CharField(
        required=True,
        max_length=100,
        help_text='City name must be unique.',
        style={'placeholder': 'City name here...'},
        validators=[UniqueValidator(queryset=City.objects.all())]
    )

    class Meta:
        model = City
        fields = ['id', 'city_name', 'city_slug', 'country']
        read_only_fields = ('id', 'city_slug',)

    def validate(self, attrs):
        """Validate uniqueness of city within the selected country."""
        city_name = attrs.get("city_name")
        country = attrs.get("country")

        if not city_name:
            raise serializers.ValidationError({"city_name": "City name is required."})
        if not country:
            raise serializers.ValidationError({"country": "The selected Country is required."})

        # Check if this city already exists under the same country
        if City.objects.filter(city_name__iexact=city_name, country=country).exists():
            raise serializers.ValidationError({
                "city_name": f"The city '{city_name}' already exists in {country.country_name}."
            })
        return attrs


       

class UpdateCitySerializer(serializers.ModelSerializer):
    
    city_name  = serializers.CharField(required=True, 
                                    max_length=100,
                                    help_text='City name must be unique.',
                                    style={'placeholder': 'City name here...'},
                                    validators=[UniqueValidator(queryset=City.objects.all())]
                                    )
    
    class Meta:
        model = City
        fields = ['id', 'city_name']
        read_only_fields = ('id',)
        
       
        
        
# MainType ##################################################################
class PropertyMainTypeSerializer(serializers.ModelSerializer):
    maintype_label = serializers.CharField(source='get_maintype_name_display', read_only=True)
    class Meta:
        model = PropertyMainType
        fields = ['id', 'created_at', 'updated_at', 'maintype_name', 'maintype_label']
        read_only_fields = ('id', 'created_at', 'updated_at', 'maintype_label',)



#  <slug:country_slug>/<slug:maintype_slug>/subtypes/
class PropertySubTypesMainTypeSerializer(serializers.ModelSerializer):
    # must select the primary key of main_type - main_type id - before insert subtype_name
    main_type = serializers.PrimaryKeyRelatedField(
                                        queryset=PropertyMainType.objects.all(),
                                        help_text='Select a property main_type id for this sub type.'
                                        )
    subtype_name = serializers.CharField(required=True, 
                                    max_length=100,
                                    help_text='property sub type name must be unique.',
                                    style={'placeholder': 'sub type name here...'},
                                    validators=[UniqueValidator(queryset=PropertySubTypes.objects.all())]
                                    )
   
     
    class Meta:
        model = PropertySubTypes
        fields = ['id', 'created_at', 'updated_at', 'main_type','subtype_name']
        read_only_fields = ('id', 'created_at', 'updated_at',)


    
            
    
    



class SimplePropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = ['id']

#  <slug:country_slug>/<slug:maintype_slug>/<slug:purpose_slug>/subtypes/
# PropertySubTypes ##################################################################
class PropertySubTypesSerializer(serializers.ModelSerializer):
    # must select the primary key of main_type - main_type id - before insert subtype_name
    main_type = serializers.PrimaryKeyRelatedField(
                                        queryset=PropertyMainType.objects.all(),
                                        help_text='Select a property main_type id for this sub type.'
                                        )
    subtype_name = serializers.CharField(required=True, 
                                    max_length=100,
                                    help_text='property sub type name must be unique.',
                                    style={'placeholder': 'sub type name here...'},
                                    validators=[UniqueValidator(queryset=PropertySubTypes.objects.all())]
                                    )
    properties = serializers.SerializerMethodField() # parentheses added
    # properties = PropertySerializer(many=True, read_only=True)  # you can use it if PropertySerializer is before PropertySubTypesSerializer in the same file.
     
    class Meta:
        model = PropertySubTypes
        fields = ['id', 'created_at', 'updated_at', 'main_type','subtype_name', 'properties']
        read_only_fields = ('id', 'created_at', 'updated_at', 'properties',)


    def get_properties(self, obj):
        country_slug = self.context.get('country_slug')
        purpose_slug = self.context.get('purpose_slug')
        queryset = obj.properties.filter(is_published=True, country__country_slug=country_slug, purpose__purpose_slug=purpose_slug)
        return SimplePropertySerializer(queryset, many=True).data
            
          
            
      
            
    
    
    
    
    
# this for search page only  # 
class SerarchPropertySubTypesSerializer(serializers.ModelSerializer):
    # must select the primary key of main_type - main_type id - before insert subtype_name
    main_type = serializers.PrimaryKeyRelatedField(
                                        queryset=PropertyMainType.objects.all(),
                                        help_text='Select a property main_type id for this sub type.'
                                        )
    subtype_name = serializers.CharField(required=True, 
                                    max_length=100,
                                    help_text='property sub type name must be unique.',
                                    style={'placeholder': 'sub type name here...'},
                                    validators=[UniqueValidator(queryset=PropertySubTypes.objects.all())]
                                    )
    properties = serializers.SerializerMethodField() # parentheses added
    # properties = PropertySerializer(many=True, read_only=True)  # you can use it if PropertySerializer is before PropertySubTypesSerializer in the same file.
     
    class Meta:
        model = PropertySubTypes
        fields = ['id', 'created_at', 'updated_at', 'main_type','subtype_name', 'properties']
        read_only_fields = ('id', 'created_at', 'updated_at', 'properties',)


    def get_properties(self, obj):
        country_slug = self.context.get('country_slug')
        purpose_slug = self.context.get('purpose_slug')
        queryset = obj.properties.filter(
            is_published=True,
            country__country_slug=country_slug,
            purpose__purpose_slug=purpose_slug
        )
        return SimplePropertySerializer(queryset, many=True).data
            
    
        # filters = self.context.get('filters', {})
        # print("serializer-filters=",filters)
        # # Apply filters if provided
        # city = filters.get("city")
        # if city:
        #     queryset = queryset.filter(city__city_slug=slugify(city.lower()))

        # bedrooms = filters.get("bedrooms")
        # if bedrooms:
        #     queryset = queryset.filter(bedrooms=bedrooms)

        # bathrooms = filters.get("bathrooms")
        # if bathrooms:
        #     queryset = queryset.filter(bathrooms=bathrooms)

        # fur = filters.get("fur")
        # if fur:
        #     queryset = queryset.filter(furnishing=fur)

        # # Price range
        # min_price = filters.get("selectedMinPrice")
        # max_price = filters.get("selectedMaxPrice")
        # if min_price and max_price:
        #     try:
        #         queryset = queryset.filter(price__range=[float(min_price), float(max_price)])
        #     except ValueError:
        #         pass

        # # Area range
        # min_area = filters.get("selectedMinArea")
        # max_area = filters.get("selectedMaxArea")
        # if min_area and max_area:
        #     try:
        #         queryset = queryset.filter(property_size__range=[float(min_area), float(max_area)])
        #     except ValueError:
        #         pass

        # # Amenities
        # amenities = filters.get("amenities")
        # if amenities:
        #     queryset = queryset.filter(amenities__amenity_name__in=amenities).distinct()

        







PropertyPurpose ##################################################################
class PropertyPurposeSerializer(serializers.ModelSerializer):
     
    class Meta:
        model = PropertyPurpose
        fields = ['id', 'created_at', 'updated_at', 'purpose_name' ]
        read_only_fields = ('id', 'created_at', 'updated_at',)





# Amenity ##################################################################
class AmenitySerializer(serializers.ModelSerializer):
    
    amenity_name  = serializers.CharField(required=True, 
                                    max_length=100,
                                    help_text='Amenity name must be unique.',
                                    style={'placeholder': 'Amenity name here...'},
                                    validators=[UniqueValidator(queryset=Amenity.objects.all())]
                                    )
    class Meta:
            model = Amenity
            fields = ['id', 'amenity_name']
            read_only_fields = ('id', 'created_at', 'updated_at',)








####################################################################################################################################

## CREATE PROPERTY  way-1 ##################################################################################################################################
#  add images to property selected of params property.id
class PropertyImageSerializer(serializers.ModelSerializer):
    images = serializers.ImageField(use_url=True)   # use_url=True  -- absolute URL   --  Next.js requires full absolute URL, not relative.
   



    class Meta:
        model = PropertyImage
        fields = ["id", "images"]

    def create(self, validated_data):
        # Get the property from the context
        property_obj = self.context.get("property")
        if not property_obj:
            raise serializers.ValidationError("Property is required to upload images.")

        # Handle multiple files
        request = self.context.get("request")
        files = request.FILES.getlist("images") if request else None

        if files:
            images = [PropertyImage.objects.create(property=property_obj, images=file) for file in files]
            return images

        # Single image fallback
        return PropertyImage.objects.create(property=property_obj, **validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        if request and data.get("images"):
            data["images"] = request.build_absolute_uri(data["images"])
        return data
    #  Now the API returns:
    # "http://127.0.0.1:8000/media/property_images/2025/10/13/1.jpg"
    
    





# Creater Property data #######  if we want to create new property with 1 step(data form only-first form) - and at 2step(images form only-second next form)  ###########################################
class PropertySerializer(serializers.ModelSerializer):
    title = serializers.CharField(
                                    max_length=200,
                                    required=True,
                                    allow_blank=False,
                                    validators=[UniqueValidator(queryset=Property.objects.all())]
    )
    # ✅ Nested with property list
    # ForeignKey fields - make ForeignKey fields as this to get all object informations instesd of only id number of that object
    owner      = CustomUserSerializer(many=False,read_only=True) # to get object of owner data with response.data
    country    = CountrySerializer(many=False, read_only=True) # to get object of country data with response.data
    city       = CitySerializer(many=False, read_only=True)
    pmain_type = PropertyMainTypeSerializer(many=False, read_only=True)
    psub_type  = PropertySubTypesSerializer(many=False, read_only=True)
    purpose    = PropertyPurposeSerializer(many=False, read_only=True)
    images     = PropertyImageSerializer(many=True, read_only=True) # to get list of images data with response.data
    amenities  = AmenitySerializer(many=True, read_only=True) # to get list of amenities data with response.data
    
    
    # 👇 Add write-only fields for IDs (because the customer in frontend will insert the id in these foreignkey field )
    country_id = serializers.PrimaryKeyRelatedField(
        queryset=Country.objects.all(), write_only=True, source='country'
    )
    city_id = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(), write_only=True, source='city'
    )
    pmain_type_id = serializers.PrimaryKeyRelatedField(
        queryset=PropertyMainType.objects.all(), write_only=True, source='pmain_type'
    )
    psub_type_id = serializers.PrimaryKeyRelatedField(
        queryset=PropertySubTypes.objects.all(), write_only=True, source='psub_type'
    )
    purpose_id = serializers.PrimaryKeyRelatedField(
        queryset=PropertyPurpose.objects.all(), write_only=True, source='purpose'
    )
    amenities_ids = serializers.PrimaryKeyRelatedField(
        queryset=Amenity.objects.all(), many=True, write_only=True, source='amenities'
    )
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = Property
        fields = [
            'id', 'owner', 'title', 'description',
            'country', 'country_id',
            'city', 'city_id',
            'pmain_type', 'pmain_type_id',
            'psub_type', 'psub_type_id',
            'purpose', 'purpose_id',
            'amenities', 'amenities_ids',
            'area', 'district', 'plot_number', 'land_number', 'address_detail',
            'latitude', 'longitude', 'is_occupied', 'available_from',
            'property_size', 'bedrooms', 'bathrooms', 'plot_length',
            'plot_width', 'street_width', 'facade', 'property_age',
            'price', 'currency', 'furnishing', 'category', 'is_published','images', 'is_liked'
        ]
        read_only_fields = [
            'id', 'is_published','owner', # 👈 add 'owner' here because it come from backend not from frontend -- request.user -- serializer.save(owner=self.request.user) in view.py
            'country', 'city', 'images',
            'pmain_type', 'psub_type', 'purpose','amenities'
        ]  

    
    def validate_title(self, value):
        if not value:
            raise serializers.ValidationError("The Property title is required")
        if Property.objects.filter(title=value).exists():
            raise serializers.ValidationError("The Property title must be unique")
        return value
    
        
    def create(self, validated_data):
        # DRF will automatically map *_id fields to FKs
        # Pop amenities from validated_data because it's M2M
        amenities_data = validated_data.pop('amenities', [])

        # Create property (without amenities yet)
        property_instance = Property.objects.create(**validated_data)

        # Then attach amenities
        if amenities_data:
            property_instance.amenities.set(amenities_data)

        return property_instance

    def get_is_liked(self, obj):
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return False

        return PropertyLike.objects.filter(user=request.user, property=obj).exists()
           
           
      

    
    
class PropertyLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyLike
        fields = "__all__"


class MessagePropertySerializer(serializers.ModelSerializer):
    """Minimal property serializer for message context."""
    class Meta:
        model = Property
        fields = ['id', 'title']


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for reading messages - includes sender/receiver details."""
    sender = CustomUserSerializer(read_only=True)
    receiver = CustomUserSerializer(read_only=True)
    property = MessagePropertySerializer(read_only=True, allow_null=True)

    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'receiver', 'property',
            'subject', 'body', 'is_read',
            'created_at', 'updated_at'
        ]
        read_only_fields = fields


class MessageCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/sending a new message."""
    receiver_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), source='receiver',
        help_text='UUID of the user to receive this message.'
    )
    property_id = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.all(), source='property',
        required=False, allow_null=True,
        help_text='Optional: UUID of the property this message relates to.'
    )

    class Meta:
        model = Message
        fields = ['receiver_id', 'property_id', 'subject', 'body']

    def validate_subject(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Subject is required.")
        return value.strip()

    def validate_body(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Message body is required.")
        return value.strip()
































# ------------------- Property Serializer -------------------
## CREATE PROPERTY  way-2 ##################################################################################################################################
 
# Property #######################  if we want to create new property with (data + images) in the same form - at one step  ###########################################
####################### not applied this type of form

# PropertyImage ##################################################################
# class PropertyImageSerializer(serializers.ModelSerializer): 
#     # must select the primary key of property id - before insert an image for it
#     property = serializers.PrimaryKeyRelatedField(
#                                         queryset=Property.objects.all(),
#                                         help_text='Select a property id for this image.'
#                                         )
#     class Meta:
#         model = PropertyImage
#         fields = ['id','property','images','uploaded_at']




# class PropertySerializer(serializers.ModelSerializer):
#     title            = serializers.CharField(max_length=200, min_length=None,required=True, allow_blank=False,validators=[UniqueValidator(queryset=Property.objects.all())])
#     images_Property  = PropertyImageSerializer(many=True,read_only=True)                                     
#     uploaded_images = serializers.ListField(child = serializers.ImageField(max_length = 1000000, allow_empty_file = False, use_url = False), write_only=True)
     
#     class Meta:
#         model = Property
#         fields = ['id','owner','title','description','country','city','area',
#                   'district','plot_number','land_number','address_detail',
#                   ' latitude','longitude','is_occupied','available_from',
#                   'psub_type','purpose','property_size',
#                   'bedrooms','bathrooms','plot_length','plot_width','street_width',
#                   'facade','property_age','amenities','price','currency','furnishing',
#                   'category']
                  
#         read_only_fields = ['id', 'images_project', 'created_at', 'updated_at']
#         write_only_fields = ['uploaded_images']                   
    
#     def validate_title(self, value):
#         print('value in serializer=',value)
#         if value is None  or value == "" :
#             raise serializers.ValidationError("The Property's title is required") 
#         if Property.objects.filter(name=value).exists():
#             raise serializers.ValidationError("The Property's title must be unique")     
#         print('value of validated title =',value)
#         return value
   
    
#     def validate_uploaded_images(self, value):
#         allowed_extensions = ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'webp', 'tiff']
#         if not value.name.split('.')[-1].lower() in allowed_extensions:
#             raise serializers.ValidationError("Invalid file extension. Allowed extensions are: bmp, gif, jpg, jpeg, png, webp, tiff.")
#         return value
    
    
#     def create(self,validated_data):
#         print('validated_data in serializer=',validated_data) 
#         uploaded_images = validated_data.pop('uploaded_images', [])
#         print('uploaded_images in serializer=',uploaded_images) 
#         property = Property.objects.create(**validated_data)
#         for image in uploaded_images:
#             PropertyImage.objects.create(property=property, images=image)
#         return property



