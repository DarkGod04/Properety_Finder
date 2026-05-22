from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import CountrySerializer, CitySerializer, PropertyMainTypeSerializer, PropertySubTypesSerializer, PropertyPurposeSerializer, AmenitySerializer, PropertySerializer, PropertyImageSerializer,SerarchPropertySubTypesSerializer,PropertySubTypesMainTypeSerializer, PropertyLikeSerializer, MessageSerializer, MessageCreateSerializer
from .models import Country, City, PropertyMainType, PropertySubTypes, PropertyPurpose, Amenity, Property, PropertyLike, Message
from users.models import CustomUser
from rest_framework import  response, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
# permissions
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAllowedToAddProperty
from django.utils.text import slugify
from django.conf import settings


# Country ############
# CreateCountry  -- No pagination
class CreateCountryAPIView(APIView):
    serializer_class = CountrySerializer
    permission_classes = [permissions.IsAdminUser]
    # pagination_class = CustomPagination
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# ListCountry  -- No pagination
class ListCountryAPIView(APIView):
    serializer_class = CountrySerializer
    permission_classes = [permissions.AllowAny]
    def get(self,request):
       queryset = Country.objects.all() 
       serializer = self.serializer_class(queryset,many=True)
       return Response(serializer.data,status=status.HTTP_200_OK)
  
class UpdateCountryAPIView(APIView):
    pass 
class DeleteCountryAPIView(APIView):
    pass 

class PropertyMainTypeAPIView(APIView):
    pass 
    




# City ############
class CreateCityAPIView(APIView):
    serializer_class   = CitySerializer
    permission_classes = [permissions.IsAdminUser]
    # pagination_class = CustomPagination
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListCountryCitiesAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, country_slug, *args, **kwargs):
        country = get_object_or_404(Country, country_slug=country_slug)
        cities = City.objects.filter(country=country)
        serializer = CitySerializer(cities, many=True)
        return response.Response(serializer.data, status=status.HTTP_200_OK)


class ListCityAPIView(APIView):
    pass 
class UpdateCityAPIView(APIView):
    pass 
class DeleteCityAPIView(APIView):
    pass 






# MainType
#  PropertyMainType
class CreateMainTypeAPIView(APIView):
    serializer_class   = PropertyMainTypeSerializer
    permission_classes = [permissions.IsAdminUser]
    # pagination_class = CustomPagination
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
    
class ListMainTypeAPIView(APIView):
    serializer_class   = PropertyMainTypeSerializer
    permission_classes = [permissions.AllowAny]
    def get(self,request):
       queryset = PropertyMainType.objects.all() 
       serializer = self.serializer_class(queryset,many=True)
       return Response(serializer.data,status=status.HTTP_200_OK) 


class UpdateMainTypeAPIView(APIView):
    pass 
class DeleteMainTypeAPIView(APIView):
    pass     
   




# SubTypes
class CreateSubTypesAPIView(APIView):
    serializer_class   = PropertySubTypesSerializer
    permission_classes = [permissions.IsAdminUser]
    # pagination_class = CustomPagination
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 





# SubTypes  - without properties -- for dropdown menu in frontend
# <slug:country_slug>/<slug:maintype_slug>/subtypes/
class ListSubTypesByMaintypeAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PropertySubTypesMainTypeSerializer
    
    def get(self, request, main_type_id, *args, **kwargs):
        try:
            mainType = get_object_or_404(PropertyMainType, id=main_type_id)
            # print('mainType =', mainType)
            subTypes = PropertySubTypes.objects.filter(main_type =mainType.id)
            # print('mainType-subTypes =', subTypes)
            serializer = PropertySubTypesMainTypeSerializer(subTypes, many=True)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        
        except PropertyMainType.DoesNotExist:   
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        
      



   

# SubTypes  - with properties -- for SubTypes card in frontend in 
# <slug:country_slug>/<slug:maintype_slug>-<slug:purpose_slug>/subtypes/
class ListSubTypesByCountryMaintypePurposeAPIView(APIView):
    serializer_class = PropertySubTypesSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, country_slug, maintype_slug, purpose_slug, *args, **kwargs):
        try:
            mainType = get_object_or_404(PropertyMainType, maintype_slug=maintype_slug)
            subTypes = PropertySubTypes.objects.filter(main_type=mainType.id)

            serializer = PropertySubTypesSerializer(
                subTypes,
                many=True,
                context={
                    'request': request,
                    'country_slug': country_slug,
                    'purpose_slug': purpose_slug,
                }
            )
            return Response(serializer.data, status=status.HTTP_200_OK)

        except PropertyMainType.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)






class SearchListSubTypesByCountryMaintypeAPIView(APIView):
    serializer_class = SerarchPropertySubTypesSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        # SubTypes
        queryset = PropertySubTypes.objects.all()
        type = request.query_params.get("type")  
        if type:
            type = slugify(type.lower())
            queryset = queryset.filter(main_type__maintype_slug=type)
            
        serializer = PropertySubTypesSerializer(
            queryset,
            many=True,
            context={
                'request': request,
                'country_slug': "sa",
                
                # pass property filtering parameters
                'filters': {
                    'city': request.query_params.get("selectedCity"),
                    'purpose': request.query_params.get("purpose"),
                    'bedrooms': request.query_params.get("beds"),
                    'bathrooms': request.query_params.get("baths"),
                    'fur': request.query_params.get("fur"),
                    'selectedMinPrice': request.query_params.get("selectedMinPrice"),
                    'selectedMaxPrice': request.query_params.get("selectedMaxPrice"),
                    'selectedMinArea': request.query_params.get("selectedMinArea"),
                    'selectedMaxArea': request.query_params.get("selectedMaxArea"),
                    'amenities': request.query_params.getlist("amenities"),
                }
            }
        )        
        return Response(
            {
                "count": queryset.count(),
                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )









 



class UpdateSubTypesAPIView(APIView):
    pass 
class DeleteSubTypesAPIView(APIView):
    pass 


# PropertyPurpose
class CreatePurposeAPIView(APIView):
    serializer_class   = PropertyPurposeSerializer
    permission_classes = [permissions.IsAdminUser]
    # pagination_class = CustomPagination
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    
     
class ListPurposeAPIView(APIView):
    serializer_class = PropertyPurposeSerializer
    permission_classes = [permissions.AllowAny]
    def get(self,request):
       queryset = PropertyPurpose.objects.all() 
       serializer = self.serializer_class(queryset,many=True)
       return Response(serializer.data,status=status.HTTP_200_OK)
  
  
class UpdatePurposeAPIView(APIView):
    pass 
class DeletePurposeAPIView(APIView):
    pass



# Amenity
class CreateAmenityAPIView(APIView):
    serializer_class = AmenitySerializer
    permission_classes = [permissions.IsAdminUser]
    # pagination_class = CustomPagination
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
      
class ListAmenityAPIView(APIView):
    serializer_class = AmenitySerializer
    permission_classes = [permissions.AllowAny]
    def get(self,request):
       queryset = Amenity.objects.all() 
       serializer = self.serializer_class(queryset,many=True)
       return Response(serializer.data,status=status.HTTP_200_OK)


class UpdateAmenityAPIView(APIView):
    pass 
class DeleteAmenityAPIView(APIView):
    pass 






# Property
class CreatePropertyDataAPIView(APIView): # only property data no images  --step1
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated, IsAllowedToAddProperty]  # 👈 both required
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            serializer.save(owner=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    
     
# PropertyImage
class CreatePropertyImageUploadAPIView(APIView):
    serializer_class = PropertyImageSerializer
    permission_classes = [IsAuthenticated, IsAllowedToAddProperty]

    def post(self, request, *args, **kwargs):
        property_id = self.kwargs.get("property_id")
        property_obj = get_object_or_404(Property, id=property_id)

        serializer = self.serializer_class(
            data=request.data,
            context={"property": property_obj, "request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"detail": "Images uploaded successfully"},
            status=status.HTTP_201_CREATED,
        )


    
     
     
        
# <slug:country_slug>/<slug:maintype_slug>-for-<slug:purpose_slug>/
# List all properties in one country only
class ListPropertyByCountryMaintypePurposeAPIView(APIView):
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, country_slug, maintype_slug, purpose_slug, *args, **kwargs):
        country = get_object_or_404(Country, country_slug=country_slug)
        pmain_type = get_object_or_404(PropertyMainType, maintype_slug=maintype_slug)
        purpose = get_object_or_404(PropertyPurpose, purpose_slug=purpose_slug)
        
        queryset = Property.objects.filter(country=country, pmain_type=pmain_type, purpose=purpose, is_published=True)
        serializer = PropertySerializer(queryset, many=True, context={'request': request})

        return Response(
            {
                "count": queryset.count(),
                "country": country.country_name,
                "type": pmain_type.maintype_slug,
                "purpose": purpose.purpose_slug,
                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    
    
    
# http://localhost:3000/sa/search?selectedCity=Riyadh&type=residential&purpose=buy&selectedSubtype=Villa&beds=3&baths=4&selectedMinPrice=400000&selectedMaxPrice=800000&fur=Unfurnished&selectedMinArea=1500&selectedMaxArea=3000&amenities=Waters&amenities=Electricity&amenities=pool
# filtering -- search from frontend
# queryString=
# selectedCity=Riyadh&
# type=residential&
# purpose=buy&
# selectedSubtype=Floor&
# beds=1&
# baths=4&
# selectedMinPrice=400000&
# selectedMaxPrice=700000&
# fur=Unfurnished&
# selectedMinArea=2000&
# selectedMaxArea=2000&
# amenities=Waters&
# amenities=Electricity&
# amenities=pool
# List all properties in one country only
class ListPropertyByParamsFilteringAPIView(APIView):
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, country_slug, *args, **kwargs):
        country = get_object_or_404(Country, country_slug=country_slug)
        queryset = Property.objects.filter(country=country, is_published=True)
        
        # from searchParams -- come from filtering by buyer in frontend 
        city_name = request.query_params.get("selectedCity")
        pmain_type = request.query_params.get("type")  
        purpose = request.query_params.get("purpose")
        psub_type = request.query_params.get("selectedSubtype")
        bedrooms = request.query_params.get("beds")
        bathrooms = request.query_params.get("baths")  
        selectedMinPrice = request.query_params.get("selectedMinPrice")
        selectedMaxPrice= request.query_params.get("selectedMaxPrice")
        fur = request.query_params.get("fur")
        selectedMinArea = request.query_params.get("selectedMinArea")
        selectedMaxArea= request.query_params.get("selectedMaxArea")
        amenitiesList = request.query_params.getlist("amenities")  # use getlist  insteade of get
        
        # filtering  -- search
        if city_name:
            city_name = slugify(city_name.lower())
            queryset = queryset.filter(city__city_slug=city_name)
        
        if pmain_type:
            pmain_type = slugify(pmain_type.lower())
            queryset = queryset.filter(pmain_type__maintype_slug=pmain_type)
        
        if purpose:
            purpose = slugify(purpose.lower())
            queryset = queryset.filter(purpose__purpose_slug=purpose)
        
        if psub_type:
            psub_type = slugify(psub_type.lower())
            queryset = queryset.filter(psub_type__subtype_name=psub_type)
            
        if bedrooms :
            queryset = queryset.filter(bedrooms=bedrooms)
        
        if bathrooms:
            queryset = queryset.filter(bathrooms=bathrooms)
        if fur:
            queryset = queryset.filter(furnishing=fur)
        
        if selectedMinPrice and selectedMaxPrice:
            try:
                min_price = float(selectedMinPrice)
                max_price = float(selectedMaxPrice)
                queryset = queryset.filter(price__range=[min_price, max_price])
            except ValueError:
                pass
                
        
        if selectedMinArea and selectedMaxArea:
            try:
                min_area = float(selectedMinArea)
                max_area = float(selectedMaxArea)
                queryset = queryset.filter(property_size__range=[min_area, max_area])
            except ValueError:
                pass
        
        if amenitiesList:
            queryset = queryset.filter(amenities__amenity_name__in=amenitiesList).distinct()
                
        
        
        #  ordering -- sort 
        # if order == "latest":
        #     queryset = queryset.order_by("-created_at")
        # elif order == "price-asc":
        #     queryset = queryset.order_by("price")
        # elif order == "price-desc":
        #     queryset = queryset.order_by("-price")

        # ✅ Important line
        serializer = PropertySerializer(queryset, many=True, context={'request': request})

        return Response(
            {
                "count": queryset.count(),
                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )






class TogglePropertyLikeAPIView(APIView):
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, property_id, *args, **kwargs):
        user = request.user    
        property_obj = Property.objects.get(id=property_id)
        like, created = PropertyLike.objects.get_or_create(user=user,property=property_obj)
        if not created:
            like.delete()
            return Response({"liked": False}, status=status.HTTP_200_OK)

        return Response({"liked": True}, status=status.HTTP_201_CREATED)


class PropertiesLikedAPIView(APIView):
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        queryset = PropertyLike.objects.filter(user=user)

        serializer = PropertySerializer(
            [like.property for like in queryset],
            many=True,
            context={"request": request},
        )

        return Response(
            {
                "count": queryset.count(),
                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


            

class MyPropertiesAPIView(APIView):
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        owner = request.user
        queryset = Property.objects.filter(owner=owner)

        serializer = PropertySerializer(queryset, many=True,context={"request": request})
        return Response(
            {
                "count": queryset.count(),
                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
   
   
   
   

class OwnerPropertiesAPIView(APIView):
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, country_slug, owner_id, *args, **kwargs):
        country = get_object_or_404(Country, country_slug=country_slug)
        owner = get_object_or_404(CustomUser, id=owner_id)
        queryset = Property.objects.filter(country=country, owner= owner, is_published=True)
        serializer = PropertySerializer(queryset, many=True, context={'request': request})

        return Response(
            {
                "count": queryset.count(),
                "country": country.country_name,
                "owner": owner.get_full_name(),
                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
   
       
   
    
     
class PropertyDetailsAPIView(APIView):
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, id, *args, **kwargs):
        try:
            property = get_object_or_404(Property, id=id)
            # print('property =', property)
            serializer = PropertySerializer(
                property, many=False, context={"request": request}
            )
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        
        except Property.DoesNotExist:   
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        
    
    




class UpdatePropertyAPIView(APIView):
    pass 
class DeletePropertyAPIView(APIView):
    pass 




class CreatePropertyImageAPIView(APIView):
    pass  
class ListPropertyImageAPIView(APIView):
    pass 
class UpdatePropertyImageAPIView(APIView):
    pass 
class DeletePropertyImageAPIView(APIView):
    pass


# ---------------------------------------------------------------------------
# Messaging API Views
# ---------------------------------------------------------------------------

class ReceivedMessagesAPIView(APIView):
    """List all messages received by the authenticated user."""
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        messages = Message.objects.filter(
            receiver=request.user
        ).select_related('sender', 'receiver', 'property')
        serializer = self.serializer_class(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SentMessagesAPIView(APIView):
    """List all messages sent by the authenticated user."""
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        messages = Message.objects.filter(
            sender=request.user
        ).select_related('sender', 'receiver', 'property')
        serializer = self.serializer_class(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MessageDetailAPIView(APIView):
    """Retrieve a single message and mark it as read if the current user is the receiver."""
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, message_id):
        message = get_object_or_404(
            Message.objects.select_related('sender', 'receiver', 'property'),
            id=message_id
        )
        # Only sender or receiver can view the message
        if request.user not in (message.sender, message.receiver):
            return Response(
                {"detail": "You do not have permission to view this message."},
                status=status.HTTP_403_FORBIDDEN
            )
        # Mark as read if the current user is the receiver
        if request.user == message.receiver and not message.is_read:
            message.is_read = True
            message.save(update_fields=["is_read"])
        serializer = self.serializer_class(message)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SendMessageAPIView(APIView):
    """Send a new message to another user."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = MessageCreateSerializer(data=request.data)
        if serializer.is_valid():
            # Set sender to current user
            message = serializer.save(sender=request.user)
            # Return full message data using read serializer
            return Response(
                MessageSerializer(message).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UnreadMessagesCountAPIView(APIView):
    """Return the count of unread messages for the authenticated user."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        count = Message.objects.filter(
            receiver=request.user, is_read=False
        ).count()
        return Response({"unread_count": count}, status=status.HTTP_200_OK) 