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
import json
from rest_framework.parsers import MultiPartParser, JSONParser
from .utils import MultipartJsonParser
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import action
from django.db.models import Count
from collections import defaultdict
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse
from rest_framework.renderers import JSONRenderer
from django.db.models import Sum




class MeetingsViewSet(viewsets.ModelViewSet):
    queryset = Meetings.objects.all()
    serializer_class = MeetingsSerializer


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


class UnitWingView(viewsets.ViewSet):
    def list(self, request):
        units = SocietyUnitFlatCreation.objects.values_list('id', 'unit_flat_unique').distinct()
        return Response(units)


def hide_non_primary_member_checkbox(request, id):
    member_status = True
    member = MemberMasterCreation.objects.filter(
        wing_flat=id, 
        member_is_primary=True, 
        date_of_cessation__isnull=True
    )

    if member:
        print("MEMBER NAME==", member)
        member_status = False
    data = {
        "member_status": member_status,
    }
    return JsonResponse(data)


def get_ownership(request, flat_id):
    ownership_total = MemberMasterCreation.objects.filter(
        wing_flat=flat_id, 
        member_is_primary=True, 
        date_of_cessation__isnull=True
    ).aggregate(ownership_sum=Sum('ownership_percent'))
    
    data = {
        "ownership_total": ownership_total['ownership_sum'],
    }
    return JsonResponse(data)
 
    

class MemberView(viewsets.ModelViewSet):
    # queryset = MemberMasterCreation.objects.all()
    queryset = MemberMasterCreation.objects.prefetch_related('nominees')
    serializer_class = MembersSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['=wing_flat__id']
    parser_classes = (MultipartJsonParser, JSONParser)

    def create(self, request, *args, **kwargs):
        print("ALL DATA=========================", request.data)
        
        try:
            member_data = MemberMasterCreation.objects.get(
                wing_flat=request.data.get('wing_flat'), 
                member_is_primary=True, 
                date_of_cessation__isnull=True
            ).same_flat_member_identification
            print("ALL member_data=========================", member_data)
        except MemberMasterCreation.DoesNotExist:
            member_data = None
            print("No member data found")

        nominees_data = request.POST.getlist('nominees')[0]
        # nominees_data = request.POST.getlist('nominees')
        print("NOM----", nominees_data)

        modified_data = request.data
        if member_data:
            modified_data = request.data.copy()
            modified_data['same_flat_member_identification'] = member_data 

        member_serializer = self.get_serializer(data=modified_data)
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

    def get_queryset(self):
        queryset = super().get_queryset()
        wing_flat_id = self.request.query_params.get('wing_flat__id')

        if wing_flat_id:
            try:
                queryset = queryset.get(wing_flat=wing_flat_id, member_is_primary=True, date_of_cessation__isnull=True)
                print("NUMBER================1", queryset)
            except Exception as e:
                print("NOT EXISTS")
                return Response({"error": "Object not found."})
        return queryset
    
    def list(self, request, *args, **kwargs):
        print("NUMBER================2")
        # queryset = MemberMasterCreation.objects.filter(member_is_primary=True, date_of_cessation__isnull=True)
        queryset = MemberMasterCreation.objects.filter(member_is_primary=True, date_of_cessation__isnull=True)
        serializer = MembersSerializer(queryset, many=True)
        return Response(serializer.data)
    
    
    def retrieve(self, request, *args, **kwargs):
        print("NUMBER================3")
        print("METHOD NAME IS================_______________", request.method)
        # if request.method == 'PATCH':
            # Handle partial update differently
            # return self.partial_update(request, *args, **kwargs)
    
        instance_id = kwargs.get('pk')
        if instance_id:
            try:
                instance = MemberMasterCreation.objects.get(pk=instance_id, date_of_cessation__isnull=True)
                identification_name = instance.same_flat_member_identification
                print("INST=====>", identification_name)
                instance = MemberMasterCreation.objects.filter(same_flat_member_identification=identification_name)
            except MemberMasterCreation.DoesNotExist:
                return Response(data={"message": "Member not found"})

            serializer = MembersSerializer(instance, many=True)
            return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    


    @action(detail=False, methods=['get'])
    def member_history_retrieve(self, request, *args, **kwargs):
        print("NUMBER================4")
        wing_flat_id = self.request.query_params.get('wing_flat__id')
        try:
            instances = MemberMasterCreation.objects.filter(wing_flat=wing_flat_id, date_of_cessation__isnull=False)
            print("INSTANCE:", instances)
        except MemberMasterCreation.DoesNotExist:
            return Response(data={"message": "Member not found"})

        serializer = MembersSerializer(instances, many=True) 
        return Response(serializer.data)
    

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        print("NOM---->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", request.data)
        nominees_data = request.POST.getlist('nominees')[0]
        member_serializer = self.get_serializer(instance, data=request.data, partial=True)
        if member_serializer.is_valid():
            member_instance = member_serializer.save()

            # If there are nominee data, process them
            if nominees_data:
                # Loop through nominee data and either create or update each nominee
                for nominee_dict in nominees_data:
                    nominee_id = nominee_dict.get('id')  # Assuming nominee has an 'id' field
                    print("NOMINEE UPDATE=====", nominee_id)
                    if nominee_id:
                        # If nominee has an id, try to get existing nominee
                        nominee_instance = MemberNomineeCreation.objects.get(pk=nominee_id)
                        nominee_serializer = NomineesSerializer(
                            nominee_instance, data=nominee_dict, partial=True
                        )
                    # else:
                    #     # If nominee doesn't have an id, it's a new nominee
                    #     nominee_serializer = NomineesSerializer(data=nominee_dict)

                        if nominee_serializer.is_valid():
                            nominee_serializer.save(member_name=member_instance)
                        else:
                            return Response(nominee_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response(member_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(member_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class HouseHelpAllocationView(viewsets.ModelViewSet):
    print("ADDDDD==================")
    queryset = HouseHelpAllocationMaster.objects.all()
    serializer_class = HouseHelpAllocationSerializer

    def create(self, request, *args, **kwargs):
        print("d==============", request.data)
        return super().create(request, *args, **kwargs)
        

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
    parser_classes = (MultipartJsonParser, JSONParser)

    def create(self, request, *args, **kwargs):
        print("DOCUMENTS===>", request.data)
        return super().create(request, *args, **kwargs)


class SocietyRegistrationDocumentsView(viewsets.ModelViewSet):
    queryset = SocietyRegistrationDocuments.objects.all()
    serializer_class = SocietyRegistrationDocumentsSerializer


class FlatSharesView(viewsets.ModelViewSet):
    queryset = FlatSharesDetails.objects.all()
    serializer_class = FlatSharesSerializer


class MemberNomineeView(viewsets.ModelViewSet):
    queryset = Members.objects.all()
    serializer_class = MembersSerializer
    parser_classes = (MultipartJsonParser, JSONParser)

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


def get_last_object(request):
    try:
        last_society_creation = SocietyCreationNew.objects.first()
        if last_society_creation:
            data = {
                'id': last_society_creation.id,
            }
            return JsonResponse(data)
    except SocietyCreationNew.DoesNotExist:
        return JsonResponse({'message': 'No objects found'}, status=404)
    

class SharesDetailsView(viewsets.ModelViewSet):
    queryset = SharesDetailsMaster.objects.all()
    serializer_class = SharesDetailsSerializers

    def retrieve(self, request, *args, **kwargs):
        try:
            instance_id = kwargs.get('pk')
            instance = SharesDetailsMaster.objects.get(unique_member_shares=instance_id)
            print("INSTANCE==>", instance)
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except SharesDetailsMaster.DoesNotExist:
            pass

    def create(self, request, *args, **kwargs):
        unique_member_share = None
        if request.data.get('wing_flat'):
            unique_member_share = MemberMasterCreation.objects.get(
                wing_flat=request.data.get('wing_flat'), member_is_primary=True,
                date_of_cessation__isnull=True
            ).pk

        modified_data = request.data.copy()
        modified_data['unique_member_shares'] = unique_member_share 
        serializer = self.get_serializer(data=modified_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class HomeLoanDetailsView(viewsets.ModelViewSet):
    queryset = HomeLoanDetails.objects.all()
    serializer_class = HomeLoanDetailsSerializers

    def retrieve(self, request, *args, **kwargs):
        try:
            instance_id = kwargs.get('pk')
            instance = HomeLoanDetails.objects.get(unique_member_shares=instance_id)
            print("INSTANCE==>", instance)
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except HomeLoanDetails.DoesNotExist:
            pass

    def create(self, request, *args, **kwargs):
        unique_member_share = None
        if request.data.get('wing_flat'):
            unique_member_share = MemberMasterCreation.objects.get(
                wing_flat=request.data.get('wing_flat'), member_is_primary=True,
                date_of_cessation__isnull=True
            ).pk

        modified_data = request.data.copy()
        modified_data['unique_member_shares'] = unique_member_share 
        serializer = self.get_serializer(data=modified_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class FlatGSTView(viewsets.ModelViewSet):
    queryset = FlatGSTDetails.objects.all()
    serializer_class = FlatGSTSerializer


class GSTDetailsView(viewsets.ModelViewSet):
    queryset = GSTDetails.objects.all()
    serializer_class = GSTDetailsSerializers

    def retrieve(self, request, *args, **kwargs):
        try:
            instance_id = kwargs.get('pk')
            instance = GSTDetails.objects.get(unique_member_shares=instance_id)
            print("INSTANCE==>", instance)
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except GSTDetails.DoesNotExist:
            pass

    def create(self, request, *args, **kwargs):
        unique_member_share = None
        if request.data.get('wing_flat'):
            unique_member_share = MemberMasterCreation.objects.get(
                wing_flat=request.data.get('wing_flat'), member_is_primary=True,
                date_of_cessation__isnull=True
            ).pk

        modified_data = request.data.copy()
        modified_data['unique_member_shares'] = unique_member_share 
        serializer = self.get_serializer(data=modified_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MemberVehicleViewSet(viewsets.ModelViewSet):
    queryset = MemberVehicleRegister.objects.all()
    serializer_class = MemberVehicleSerializer
    parser_classes = (MultipartJsonParser, JSONParser)

    def retrieve(self, request, *args, **kwargs):
        try:
            instance_id = kwargs.get('pk')
            instance = MemberVehicleRegister.objects.filter(unique_member_shares=instance_id)
            print("INSTANCE==>", instance)
            serializer = self.get_serializer(instance, many=True)
            return Response(serializer.data)
        except MemberVehicleRegister.DoesNotExist:
            pass

    def create(self, request, *args, **kwargs):
        unique_member_share = None
        if request.data.get('wing_flat'):
            unique_member_share = MemberMasterCreation.objects.get(
                wing_flat=request.data.get('wing_flat'), member_is_primary=True,
                date_of_cessation__isnull=True
            ).pk

        modified_data = request.data.copy()
        modified_data['unique_member_shares'] = unique_member_share 
        serializer = self.get_serializer(data=modified_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)