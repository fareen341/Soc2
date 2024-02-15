from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from Society.models import FlatSharesDetails
from django.db.models import F
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from Society.models import *
from django.db.models import Q
from rest_framework import generics
from rest_framework.response import Response
from django.db import transaction






class MeetingsViewSet(viewsets.ModelViewSet):
    queryset = Meetings.objects.all()
    serializer_class = MeetingsSerializer


# class MemberVehicleViewSet(viewsets.ModelViewSet):
#     queryset = MemberVehicle.objects.all()  # Queryset for the model
#     serializer_class = MemberVehicleSerializer  # Serializer class for the model

#     def create(self, request, *args, **kwargs):
#         form_data_list = request.data
#         errors = []
#         print("ERROR: ->", errors)

#         with transaction.atomic():
#             for form_data in form_data_list:
#                 serializer = MemberVehicleSerializer(data=form_data)
#                 if serializer.is_valid():
#                     serializer.save()
#                 else:
#                     print(serializer.errors)
#                     print(serializer.errors[form_data])
#                     # errors.append(serializer.errors)
#                     # errors[form_data] = serializer.errors

#             if errors:
#                 # If there are errors, rollback the transaction
#                 transaction.set_rollback(True)
#                 return Response(errors, status=status.HTTP_400_BAD_REQUEST)
#             else:
#                 return Response("Bulk operation completed successfully", status=status.HTTP_200_OK)





class MemberVehicleViewSet(viewsets.ModelViewSet):
    queryset = MemberVehicle.objects.all()
    serializer_class = MemberVehicleSerializer

    def print_request_data(self, request):
        # Access request data without overriding create method
        # print("Request Data:", request.data)
        pass

    def create(self, request, *args, **kwargs):
        self.print_request_data(request)

        errors = []
        saved_data = []

        for index, data in enumerate(request.data):
            serializer = self.get_serializer(data=data)
            if not serializer.is_valid():
                error_detail = serializer.errors
                error_detail['index'] = index  # Include the index number
                errors.append(error_detail)

        if errors:
            print("ERRORS=========", errors)
            return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            for data in request.data:
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)
                saved_data.append(serializer.data)
            return Response(saved_data, status=status.HTTP_201_CREATED)


# ==================================


        # Usefull at the time of update
        # for data in request.data:
        #     serializer = self.get_serializer(data=data)
        #     try:
        #         serializer.is_valid(raise_exception=True)
        #         self.perform_create(serializer)
        #         saved_data.append(serializer.data)
        #     except ValidationError as e:
        #         errors.append(e.detail)

        # if errors:
        #     print("ERRORS=========", errors)
        #     return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
        # else:
        #     return Response(saved_data, status=status.HTTP_201_CREATED)



class FlatSharesView(viewsets.ModelViewSet):
    queryset = FlatSharesDetails.objects.all()
    serializer_class = FlatSharesSerializer


class HouseHelpView(viewsets.ModelViewSet):
    queryset = HouseHelp.objects.all()
    serializer_class = HouseHelpSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['=house_help_aadhar_number','=house_help_aadhar_number']


class suggestionView(viewsets.ModelViewSet):
    queryset = Suggestion.objects.all()
    serializer_class = SuggestionSerializer


# class UnitWingView(viewsets.ModelViewSet):
#     queryset = SocietyUnitFlatCreation.objects.all()
#     serializer_class = UnitWingSerializer

class UnitWingView(viewsets.ViewSet):
    def list(self, request):
        units = SocietyUnitFlatCreation.objects.values_list('id', 'unit_flat_unique').distinct()
        return Response(units)


from django.core.exceptions import ObjectDoesNotExist

class MemberView(viewsets.ModelViewSet):
    queryset = MemberMasterCreation.objects.all()
    serializer_class = MembersSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['=wing_flat__id']

    def get_queryset(self):
        queryset = super().get_queryset()
        wing_flat_id = self.request.query_params.get('wing_flat__id')

        if wing_flat_id:
            queryset = queryset.filter(wing_flat__id=wing_flat_id)
            queryset = queryset.filter(member_is_primary=True, date_of_cessation__isnull=True)
        return queryset.distinct()
    
    def retrieve(self, request, *args, **kwargs):
        queryset = super().get_queryset()
        instance_id = kwargs.get('pk')
        if instance_id:
            try:
                # instance = queryset.get(pk=instance_id, member_is_primary=True, date_of_cessation__isnull=True)
                instance = MemberNomineeCreation.objects.select_related('related_model').get(pk=instance_id, member_is_primary=True, member__date_of_cessation__isnull=True)
            except ObjectDoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            serializer = self.get_serializer(instance)
            return Response(serializer.data)

        return Response(status=status.HTTP_400_BAD_REQUEST)

        # instance = self.get_object()
        # queryset = YourModel.objects.filter(id=instance.id, ...)  # Add your filtering logic here
        # serializer = self.get_serializer(queryset)
        # return Response(serializer.data)



class HouseHelpAllocationView(viewsets.ModelViewSet):
    print("ADDDDD==================")
    queryset = HouseHelpAllocationMaster.objects.all()
    serializer_class = HouseHelpAllocationSerializer

    def create(self, request, *args, **kwargs):
        print("d==============", request.data)
        # qs = MemberMasterCreation.objects.get(wing_flat=request.data.get('member_name')).id
        # print("qs==========", request.data.get('member_name'))
        return super().create(request, *args, **kwargs)
        # house_help_name = request.data.get('name')
        # house_help = HouseHelp.objects.filter(house_help_name=house_help_name).first()

        # house_help = HouseHelp.objects.filter(house_help_name=house_help_name).first()

        # flat_member_name = serializers.CharField(source='member_name.member_name')
        # house_help_name = serializers.CharField(source='name.house_help_name')

        # if not house_help:
        #     return Response({"error": "House help with the provided name does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate house_help_period_from
        # house_help_period_from = self.request.data.get('house_help_period_from')
        # if not house_help_period_from:
        #     return Response({"error": "house_help_period_from is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Perform the creation of HouseHelpAllocationMaster instance
        # serializer.save()



class SocietyCreationNewView(viewsets.ModelViewSet):
    queryset = SocietyCreationNew.objects.all()
    serializer_class = SocietyCreationNewSerializer


class SocietyRegistrationDocumentsView(viewsets.ModelViewSet):
    queryset = SocietyRegistrationDocuments.objects.all()
    serializer_class = SocietyRegistrationDocumentsSerializer





class BankNewView(viewsets.ModelViewSet):
    queryset = SocietyBankCreationNew.objects.all()
    serializer_class = BankSerializerNew

    def print_request_data(self, request):
        # Access request data without overriding create method
        # print("Request Data:", request.data)
        pass

    def create(self, request, *args, **kwargs):
        print("DATA=======", request.data)
        self.print_request_data(request)

        errors = []
        saved_data = []

        for index, data in enumerate(request.data):
            serializer = self.get_serializer(data=data)
            if not serializer.is_valid():
                error_detail = serializer.errors
                error_detail['index'] = index  # Include the index number
                errors.append(error_detail)

        if errors:
            print("ERRORS=========", errors)
            return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            for data in request.data:
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)
                saved_data.append(serializer.data)
            return Response(saved_data, status=status.HTTP_201_CREATED)


from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse
from rest_framework.renderers import JSONRenderer


# class GetSingleSocView(APIView):
#     def get(self, request):
#         my_object = SocietyBankCreationNew.objects.first()  # Get the first object from the database
#         serializer = GetSingleSocSerializer(my_object)  # Remove `many=False`
#         return Response(serializer.data)


def GetSingleSocView(request):
    stu = SocietyCreationNew.objects.first()              #without primary key
    serializer = GetSingleSocSerializer(stu)
    json_data = JSONRenderer().render(serializer.data)
    return HttpResponse(json_data, content_type='application/json')



class FlatWingView(viewsets.ModelViewSet):
    queryset = FlatWing.objects.all()
    serializer_class = FlatWingSerializer

    def create(self, request, *args, **kwargs):
        errors = []
        saved_data = []

        for index, data in enumerate(request.data):
            serializer = self.get_serializer(data=data)
            if not serializer.is_valid():
                error_detail = serializer.errors
                error_detail['index'] = index  # Include the index number
                errors.append(error_detail)

        if errors:
            print("ERRORS=========", errors)
            return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            for data in request.data:
                print("DATA=======", request.data)
                # LOOP OVER FLATS AND STORE
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)
                saved_data.append(serializer.data)
            return Response(saved_data, status=status.HTTP_201_CREATED)



class SocDocumentNewView(viewsets.ModelViewSet):
    queryset = SocietyDocumentCreationNew.objects.all()
    serializer_class = DocumentCreationSerializer

    def create(self, request, *args, **kwargs):
        errors = []
        saved_data = []

        for index, data in enumerate(request.data):
            serializer = self.get_serializer(data=data)
            if not serializer.is_valid():
                error_detail = serializer.errors
                error_detail['index'] = index  # Include the index number
                errors.append(error_detail)

        if errors:
            print("ERRORS=========", errors)
            return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            for data in request.data:
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)
                saved_data.append(serializer.data)
            return Response(saved_data, status=status.HTTP_201_CREATED)



class SocietyRegistrationDocumentsView(viewsets.ModelViewSet):
    queryset = SocietyRegistrationDocuments.objects.all()
    serializer_class = SocietyRegistrationDocumentsSerializer


class FlatSharesView(viewsets.ModelViewSet):
    queryset = FlatSharesDetails.objects.all()
    serializer_class = FlatSharesSerializer


class FlatHomeLoanView(viewsets.ModelViewSet):
    queryset = FlatHomeLoanDetails.objects.all()
    serializer_class = FlatHomeLoanSerializer

class FlatGSTView(viewsets.ModelViewSet):
    queryset = FlatGSTDetails.objects.all()
    serializer_class = FlatGSTSerializer


import json
from rest_framework.parsers import MultiPartParser, JSONParser
from .utils import MultipartJsonParser


class MemberNomineeView(viewsets.ModelViewSet):
    queryset = Members.objects.all()
    serializer_class = MembersSerializer
    parser_classes = (MultipartJsonParser, JSONParser)

    # def create(self, request, *args, **kwargs):
    #     print("ALL DATA", request.data)
    #     nominees_data = request.POST.getlist('nominees') 
    #     print("NOMINEE DATA", nominees_data[0])
    #     return super().create(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        print("ALL DATA", request.data)
        nominees_data = request.POST.getlist('nominees')[0]
        # nominees_data = request.POST.getlist('nominees')
        print("NOM----", nominees_data)
        member_serializer = self.get_serializer(data=request.data)
        if member_serializer.is_valid():
            member_instance = member_serializer.save()

            # Loop through nominee data and save each nominee
            for nominee_dict in nominees_data:
                print("NOMINEE", nominee_dict)
                nominee_serializer = NomineesSerializer(data=nominee_dict)
                if nominee_serializer.is_valid():
                    # Associate the nominee with the member instance
                    nominee_serializer.save(member_name=member_instance)
                else:
                    return Response(nominee_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response(member_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(member_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def create(self, request, *args, **kwargs):
    #     # Extract the JSON data string from the QueryDict
    #     json_data_str = list(request.data.keys())[0]

    #     # Parse the JSON string into a Python dictionary
    #     try:
    #         json_data = json.loads(json_data_str)
    #         print("DDDDDDDDDD", json_data)
    #     except json.JSONDecodeError as e:
    #         return Response({'error': 'Invalid JSON format'}, status=400)

    #     serializer = MembersSerializer(data=json_data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response({'message': 'Data saved successfully'}, status=status.HTTP_201_CREATED)
    #     else:
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    # def create(self, request, *args, **kwargs):
    #     errors = []
    #     saved_data = []

    #     for index, data in enumerate(request.data):
    #         serializer = self.get_serializer(data=data)
    #         if not serializer.is_valid():
    #             error_detail = serializer.errors
    #             error_detail['index'] = index  # Include the index number
    #             errors.append(error_detail)

    #     if errors:
    #         print("ERRORS=========", errors)
    #         return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
    #     else:
    #         for data in request.data:
    #             print("DATA=======", request.data)
    #             # LOOP OVER FLATS AND STORE
    #             serializer = self.get_serializer(data=data)
    #             serializer.is_valid(raise_exception=True)
    #             self.perform_create(serializer)
    #             saved_data.append(serializer.data)
    #         return Response(saved_data, status=status.HTTP_201_CREATED)



class AttendanceView(viewsets.ViewSet):
    def list(self, request):
        units = SocietyUnitFlatCreation.objects.filter(
            membermastercreation__member_name__isnull=False, 
            membermastercreation__date_of_cessation__isnull=True, 
            membermastercreation__member_is_primary=True).values_list(
            'id', 'unit_flat_unique', 'membermastercreation__member_name'
        ).distinct()
        return Response(units)
    



class VehicleView(viewsets.ModelViewSet):
    queryset = FlatVehicleDetails.objects.all()
    serializer_class = VehicleSerializers
