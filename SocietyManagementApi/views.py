from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from Society.models import FlatSharesDetails




class MeetingsViewSet(viewsets.ModelViewSet):
    queryset = Meetings.objects.all()
    serializer_class = MeetingsSerializer


class MemberVehicleView(viewsets.ModelViewSet):
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

        for data in request.data:
            serializer = self.get_serializer(data=data)
            try:
                serializer.is_valid(raise_exception=True)
            except ValidationError as e:
                errors.append(e.detail)

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

    # def print_request_data(self, request):
    #     print("Request Data:", request.data)

    # def create(self, request, *args, **kwargs):
    #     self.print_request_data(request)

    # def update(self, request, *args, **kwargs):
    #     self.print_request_data(request)
    #     # Your update logic here
    #     return super().update(request, *args, **kwargs)

    # def partial_update(self, request, *args, **kwargs):
    #     self.print_request_data(request)
    #     # Your partial update logic here
    #     return super().partial_update(request, *args, **kwargs)