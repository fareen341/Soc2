from rest_framework import serializers
from .models import *
from Society.models import FlatSharesDetails



class MeetingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meetings
        fields = '__all__'


class MemberVehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberVehicle
        fields = '__all__'


class FlatSharesSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlatSharesDetails
        fields = '__all__'


class HouseHelpSerializer(serializers.ModelSerializer):
    class Meta:
        model = HouseHelp
        fields = '__all__'