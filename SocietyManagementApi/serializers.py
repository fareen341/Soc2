from rest_framework import serializers
from .models import *
from Society.models import *
from Society.models import SocietyUnitFlatCreation, MemberMasterCreation



class UnitWingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocietyUnitFlatCreation
        fields = ['unit_flat_unique']


class MembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberMasterCreation
        fields = '__all__'


class MeetingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meetings
        fields = '__all__'


class MemberVehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberVehicle
        fields = '__all__'


class HouseHelpSerializer(serializers.ModelSerializer):
    class Meta:
        model = HouseHelp
        fields = '__all__'


class SuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suggestion
        fields = '__all__'

class HouseHelpAllocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = HouseHelpAllocationMaster
        fields = [
            'wing_flat',
            'member_name',  # Assuming member_name is a ForeignKey to MemberMasterCreation
            'aadhar',
            'pan',
            'name',         # Assuming name is a ForeignKey to HouseHelp
            'role',
            'house_help_period_from',
            'house_help_period_to',
        ]


    # wing_flat_together = serializers.CharField(source='wing_flat.unit_flat_unique', read_only=True)
    # flat_member_name = serializers.CharField(source='member_name.member_name', read_only=True)
    # house_help_aadhar = serializers.CharField(source='aadhar.house_help_aadhar_number', read_only=True)
    # house_help_pan_num = serializers.CharField(source='pan.house_help_pan_number', read_only=True)
    # house_help_name = serializers.CharField(source='name.house_help_name', read_only=True)

    # class Meta:
    #     model = HouseHelpAllocationMaster
    #     fields = [
    #         'wing_flat_together',
    #         'flat_member_name',
    #         'house_help_aadhar',
    #         'house_help_pan_num',
    #         'house_help_name',
    #         'role',
    #         'house_help_period_from',
    #         'house_help_period_to',
    #     ]

    # def validate(self, data):
    #     # Ensure that house_help_period_from is provided during creation
    #     if not self.instance and not data.get('house_help_period_from'):
    #         raise serializers.ValidationError("period from date is required.")

    #     # Ensure that house_help_period_to is provided during update
    #     if self.instance and 'house_help_period_to' in data and not data['house_help_period_to']:
    #         raise serializers.ValidationError("period to date is required.")

    #     return data


class SocietyCreationNewSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocietyCreationNew
        fields = '__all__'

class SocietyRegistrationDocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocietyRegistrationDocuments
        fields = '__all__'


class BankSerializerNew(serializers.ModelSerializer):
    class Meta:
        model = SocietyBankCreationNew
        fields = [
            'beneficiary_name',
            'beneficiary_code',
            'beneficiary_acc_number',
            'beneficiary_bank',
            'is_primary'
        ]


class GetSingleSocSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocietyCreationNew
        fields = ['id']


class FlatWingSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlatWing
        fields = ['wing', 'flat']


class DocumentCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocietyDocumentCreationNew
        fields = ['society_creation', 'other_document', 'other_document_specification']

    # def validate(self, data):
    #     other_document = data.get('other_document')
    #     other_document_specification = data.get('other_document_specification')

    #     if other_document and not other_document_specification:
    #         raise serializers.ValidationError("Other document specification is required if other document is provided.")

    #     if other_document_specification and not other_document:
    #         raise serializers.ValidationError("Other document is required if other document specification is provided.")

    #     return data


class SocietyRegistrationDocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocietyRegistrationDocuments
        fields = [
            'completion_cert',
            'occupancy_cert',
            'deed_of_conveyance',
            'society_by_law',
            'soc_other_document',
            'soc_other_document_spec',
        ]


class FlatSharesSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlatSharesDetails
        fields = '__all__'


class FlatHomeLoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlatHomeLoanDetails
        fields = '__all__'


class FlatGSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlatGSTDetails
        fields = '__all__'


class NomineesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nominees
        fields = [
            # 'member_name',
            'nominee_name',
            'date_of_nomination',
            'relation_with_nominee',
            'nominee_sharein_percent',
            'nominee_dob',
            'nominee_aadhar_no',
            'nominee_pan_no',
            'nominee_email',
            'nominee_address',
            'nominee_state',
            'nominee_pin_code',
            'nominee_contact',
            'nominee_emergency_contact',
        ]


class MembersSerializer(serializers.ModelSerializer):
    nominees = NomineesSerializer(many=True, required=False)

    class Meta:
        model = Members
        fields = '__all__'

    # def create(self, validated_data):
    #     print("VALIDATON===", validated_data)
    #     nominees_data = validated_data.pop('nominees', [])
    #     print("SERIALIZERS==============", nominees_data)
    #     member = Members.objects.create(**validated_data)
    #     for nominee_data in nominees_data:
    #         Nominees.objects.create(member_name=member, **nominee_data)
    #     return member

    # def create(self, validated_data):
    #     nominees_data = validated_data.pop('nominees', [])
    #     member = Members.objects.create(**validated_data)
    #     for nominee_data in nominees_data:
    #         nominee_serializer = NomineesSerializer(data=nominee_data)
    #         if nominee_serializer.is_valid():
    #             Nominees.objects.create(member_name=member, **nominee_data)
    #         else:
    #             # Handle the case where the nominee data is invalid
    #             # You might raise an exception, log the error, or handle it in a different way
    #             pass
    #     return member



class OldFlatSerializers(serializers.ModelSerializer):

    class Meta:
        model = SocietyUnitFlatCreation
        fields = '__all__'


class VehicleSerializers(serializers.ModelSerializer):

    class Meta:
        model = FlatVehicleDetails
        fields = '__all__'