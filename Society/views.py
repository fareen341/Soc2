from django.shortcuts import render
import json
from django.http import JsonResponse
from .models import SocietyCreation, SocietyBankCreation, SocietyDocumentCreation, SocietyUnitFlatCreation
from SocietyManagementProject import constants


# Create your views here.
def login(request):
    return render(request,'login.html')


def society_creation(request):
    state_names = constants.state_names
    city_names = constants.city_names
    society_creation_fields = dict()

    if request.method == "POST":
        print("POST REQUEST==============")
        form_name = request.POST.get("form_name")
        reg_number = 123
        if form_name == "Societyform":
            form_fields = [
                'society_name', 'admin_email', 'alternate_email', 'admin_mobile_number',
                'alternate_mobile_number', 'registration_number', 'pan_number',
                'gst_number','interest', 'society_reg_address', 'society_city',
                'socity_state', 'pin_code', 'society_corr_reg_address', 'society_corr_city', 'socity_corr_state',
                'pin_corr_code'
            ]
            society_creation_fields = {}

            for field in form_fields:
                society_creation_fields[field] = request.POST.get(field)

            registration_doc = request.FILES.get('registration_doc', None)
            pan_number_doc = request.FILES.get('pan_number_doc', None)
            gst_number_doc = request.FILES.get('gst_number_doc', None)

            society_instance = SocietyCreation.objects.create(**society_creation_fields)

            # Assign file fields and save again
            society_instance.registration_doc = registration_doc
            society_instance.pan_number_doc = pan_number_doc
            society_instance.gst_number_doc = gst_number_doc
            society_instance.save()

            last_instance = SocietyCreation.objects.last()
            if last_instance:
                reg_number = last_instance.registration_number
            return JsonResponse(({'reg_number': reg_number}))

        elif form_name == "bankForm":
            get_registration_number = request.POST.get("unique_reg_number")
            # form_fields = [
            #     'beneficiary_name', 'beneficiary_code', 'beneficiary_acc_number', 'beneficiary_bank'
            # ]
            # for field in form_fields:
            #     society_creation_fields[field] = request.POST.get(field)

            soc_object = SocietyCreation.objects.get(registration_number=get_registration_number)
            # SocietyBankCreation.objects.create(
            #     society_creation = soc_object,
            #     beneficiary_name = request.POST.get("beneficiary_name"),
            #     beneficiary_code = request.POST.get("beneficiary_code"),
            #     beneficiary_acc_number = request.POST.get("beneficiary_acc_number"),
            #     beneficiary_bank = request.POST.get("beneficiary_bank")
            # )
            bankDataJson = json.loads(request.POST.get("bankDataJson"))
            for data_dict in bankDataJson:
                # print("DATA ==============", data_dict)
                # if 'wing' in data_dict and 'flat' in data_dict:
                    # Create an instance of the model and save it to the database
                SocietyBankCreation.objects.create(
                    society_creation = soc_object,
                    **data_dict
                )
        elif form_name == "documentForm":
            get_registration_number = request.POST.get("unique_reg_number")
            jsonData = json.loads(request.POST.get('jsonData'))
            print("=======================", jsonData)
            soc_object = SocietyCreation.objects.get(registration_number=get_registration_number)
            # soc_object = SocietyCreation.objects.get(registration_number=1234567890)
            soc_object.completion_cert = request.FILES.get('completion_cert', None)
            soc_object.occupancy_cert = request.FILES.get('occupancy_cert', None)
            soc_object.deed_of_conveyance = request.FILES.get('deed_of_conveyance', None)
            soc_object.society_by_law = request.FILES.get('society_by_law', None)
            soc_object.soc_other_document = request.FILES.get('soc_other_document', None)
            soc_object.soc_other_document_spec = request.POST.get('soc_other_document_spec', None)
            soc_object.save()

            for key in jsonData:
                SocietyDocumentCreation.objects.create(
                    society_creation = soc_object,
                    other_document = request.FILES.get(key),
                    other_document_specification = key
                )
        elif form_name == "wingUnit":
            get_registration_number = request.POST.get("unique_reg_number")
            soc_object = SocietyCreation.objects.get(registration_number=get_registration_number)
            unitWingJson = json.loads(request.POST.get("unitWingJson"))
            for data_dict in unitWingJson:
                if 'wing' in data_dict and 'flat' in data_dict:
                    # Create an instance of the model and save it to the database
                    SocietyUnitFlatCreation.objects.create(
                        society_creation = soc_object,
                        unit=data_dict['wing'],
                        flat=data_dict['flat']
                    )

    return render(request, 'society_creation.html', {"state_names": state_names, "city_names": city_names})


def society_details_view(request):
    return render(request, 'society_details_view.html')

def get_checkbox_value(request):
    if request.method == "POST":
        flatSelectedValue = request.POST.get("flatSelectedValue")
     

def member_master(request):
    state_names = constants.state_names
    city_names = constants.city_names
    wing_flat_no = {
        "#": "Select Flat No",
        "A-Wing100": "A-Wing-100",
        "B-Wing200": "B-Wing-200",
        "C-Wing300": "C-Wing-300",
        "D-Wing400": "D-Wing-400",
    }
    member_position = {
        "#": "Select Member Position",
        "associate_member": "Associate Member",
        "chairman": "Chairman",
        "secretary": "Secretary",
        "treasurer": "Treasurer",
        
    }
    is_primary = True
    if request.method == "POST":
        flatSelectedValue = request.POST.get("flatSelectedValue")
        is_primary = False
        if flatSelectedValue:
            return JsonResponse({'is_primary': is_primary})
        member_ownership = request.POST.get('member_ownership')
        wing_flat_number = request.POST.get('wing_flat_number')
        if member_ownership:
            if int(member_ownership) < 50:
                return JsonResponse({'ownership': "Ownership should be less than 50 %"})
            
        memberData = request.POST.get("memberData")
        nomineeData = request.POST.get("nomineeData")
        form_name = request.POST.get("form_name")
        shares_json = request.POST.get("shares_json")
        if form_name == "member_form" and (memberData and nomineeData):
            memberData = json.loads(request.POST.get("memberData"))
            nomineeData = json.loads(request.POST.get("nomineeData"))
            print(f"MEMBER DATA: {memberData} \n, NOMINEE: {nomineeData}")
        if form_name == "shared_form" and shares_json:
            shares_json_deserialized = json.loads(shares_json)
            print("SHARES========", shares_json_deserialized)


        # validate_ownership = json.loads(request.POST.get("validate_ownership"))
        # get the aggregrate sum data minus 100
        # if int(validate_ownership) < 50:
        #     return JsonResponse({'ownership': "Ownership should be less than 50 %"})
        
        # orm to filter the checkbox data
        # validation when shares exceed the shares percentage, if member1 assigned to 60% then 40% is remaining for that flat share
        # print("member_ownership------------------", validate_ownership)
        # print("wing_flat_number============", wing_flat_number)
    return render(request,'member_master.html', {
        'is_primary': is_primary, "state_names": state_names, 
        "city_names": city_names,
        "wing_flat_no": wing_flat_no,
        "member_position": member_position
    })


def tenant(request):
    return render(request,'tenant.html')


def house_help_master(request):
    return render(request,'house_help_master.html')


def income_expense_ledger(request):
    return render(request,'income_expense_ledger.html')


def asset_liability_ledger(request):
    return render(request,'asset_liability_ledger.html')


def extra1(request):
    return render(request,'extra1.html')


def extra2(request):
    if request.method == "POST":
        print("POST==============")
        data = request.POST.get("name")
        data2 = request.FILES.get('file', None)
        print("data===================", data)
        print("data===================", data2)
    return render(request,'extra2.html')


def extra3(request):
    return render(request,'extra3.html')