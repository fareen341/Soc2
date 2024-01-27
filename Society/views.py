from django.shortcuts import render
import json
from django.http import JsonResponse
from .models import (
    SocietyCreation, SocietyBankCreation, SocietyDocumentCreation, SocietyUnitFlatCreation,
    MemberMasterCreation, MemberNomineeCreation, FlatSharesDetails, FlatHomeLoanDetails, FlatGSTDetails,
    FlatVehicleDetails
)
from SocietyManagementProject import constants
from django.db.models import Count, Sum


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
                print("REG SOC===============", reg_number)
            return JsonResponse(({'reg_number': reg_number}))

        elif form_name == "bankForm":
            get_registration_number = request.POST.get("unique_reg_number")
            print("REG NO.", get_registration_number)
            soc_object = SocietyCreation.objects.get(registration_number=get_registration_number)
            bankDataJson = json.loads(request.POST.get("bankDataJson"))
            for data_dict in bankDataJson:
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
                    print("DATA======", data_dict)
                    flat_split = data_dict['flat'].split(',')
                    print("flat_split====", flat_split)
                    for flat_number in flat_split:
                        SocietyUnitFlatCreation.objects.create(
                            society_creation=soc_object,
                            unit=data_dict['wing'],
                            flat=flat_number.strip(),
                            unit_flat_unique = data_dict['wing'] + '-' + str(flat_number)
                        )

    return render(request, 'society_creation.html', {"state_names": state_names, "city_names": city_names})


def get_checkbox_value(request):
    if request.method == "POST":
        flatSelectedValue = request.POST.get("flatSelectedValue")
     

def member_master(request):
    state_names = constants.state_names
    city_names = constants.city_names
    flat_numbers_queryset = SocietyUnitFlatCreation.objects.values_list("unit", "flat")
    wing_flat_no = {
        "#": "Select Flat No",
        **{f"{wing}-{flat}": f"{wing}-{flat}" for wing, flat in flat_numbers_queryset}
    }
    member_position = constants.member_position
    is_primary = False
    if request.method == "POST":
        try:
            # ajax_get_primary = False
            # get_ownership_ajax = False
            flat_selected_value = request.POST.get("flatSelectedValue")
            ajax_get_primary = request.POST.get("ajax_get_primary")
            get_ownership_ajax = request.POST.get("get_ownership_ajax")
            
            print("ajax_get_primary========================", ajax_get_primary)
            if json.loads(ajax_get_primary):
                get_flat = SocietyUnitFlatCreation.objects.get(unit_flat_unique=flat_selected_value)
                is_primary = MemberMasterCreation.objects.filter(wing_flat=get_flat, member_is_primary=True).exists()
                if flat_selected_value and is_primary:
                    return JsonResponse({'is_primary': is_primary})
            
            if json.loads(get_ownership_ajax):
                total_ownership = 0
                wing_flat_number = request.POST.get('wing_flat_number')
                member_ownership = json.loads(request.POST.get('member_ownership'))
                print("OWNSERSHI+=======================", member_ownership)
                ownership_flat_no = SocietyUnitFlatCreation.objects.get(unit_flat_unique=wing_flat_number)
                total_flat_ownership = MemberMasterCreation.objects.filter(wing_flat=ownership_flat_no).aggregate(sum_ownership=Sum('ownership_percent'))
                print("total_flat_ownership===", total_flat_ownership)
                if total_flat_ownership['sum_ownership'] is not None:
                    total_ownership = total_flat_ownership['sum_ownership'] + member_ownership
                if member_ownership and total_ownership > 100:
                    print("TOTAL===================", total_flat_ownership['sum_ownership'])
                    return JsonResponse({'ownership': f"This flat left with {100 - total_flat_ownership['sum_ownership']} % ownership!"})
        except SocietyUnitFlatCreation.DoesNotExist:
            print("Object does not exists!")
    return render(request,'member_master.html', {
        'is_primary': is_primary, "state_names": state_names, 
        "city_names": city_names,
        "wing_flat_no": wing_flat_no,
        "member_position": member_position
    })



def member_master_creation(request):
    form_name = request.POST.get("form_name")
    memberData = request.POST.get("memberData")
    nomineeData = request.POST.get("nomineeData")
    print("IN IF========")
    if form_name == "member_form_creation" and (memberData and nomineeData):
        wing_flat_number = request.POST.get("wing_flat_number")
        print("WING===============", wing_flat_number)
        wing_flat = SocietyUnitFlatCreation.objects.get(unit_flat_unique=wing_flat_number)
        memberData = json.loads(request.POST.get("memberData"))
        nomineeData = json.loads(request.POST.get("nomineeData"))
        print(f"MEMBER DATA: {memberData} \n, NOMINEE: {nomineeData}")
        MemberMasterCreation.objects.create(
            wing_flat = wing_flat,
            **memberData[0]
        )

        for nominee in nomineeData:
            MemberNomineeCreation.objects.create(
                wing_flat = wing_flat,
                **nominee
        )

    if form_name == "shared_form":
        shares_json = json.loads(request.POST.get("shares_json"))
        flat = request.POST.get("id_shared_wing_flat_select")
        wing_flat = SocietyUnitFlatCreation.objects.get(unit_flat_unique=flat)
        FlatSharesDetails.objects.create(
            wing_flat = wing_flat,
            **shares_json
        )
    
    if form_name == "home_loan_form":
        home_loan_json = json.loads(request.POST.get("home_loan_json"))
        home_loan_file = request.FILES.get('id_bank_loan_noc_file', None)
        flat = request.POST.get("wing_flat")
        print("home_loan_json========", type(home_loan_json))
        wing_flat = SocietyUnitFlatCreation.objects.get(unit_flat_unique=flat)
        FlatHomeLoanDetails.objects.create(
            wing_flat = wing_flat,
            bank_noc_file = home_loan_file,
            **home_loan_json
        )

    if form_name == "gst_form":
        gst_json = json.loads(request.POST.get("gst_json"))
        flat = request.POST.get("wing_flat")
        wing_flat = SocietyUnitFlatCreation.objects.get(unit_flat_unique=flat)
        FlatGSTDetails.objects.create(
            wing_flat = wing_flat,
            **gst_json
        )

    if form_name == "vehicle_form":
        flat = request.POST.get("wing_flat")
        wing_flat = SocietyUnitFlatCreation.objects.get(unit_flat_unique=flat) 
        vehicle_data_json = json.loads(request.POST.get("vehicleDataJson"))
        for index, vehicle in enumerate(vehicle_data_json):
            file_field = "file" + str(index)
            FlatVehicleDetails.objects.create(
                wing_flat=wing_flat,
                rc_copy=request.FILES.get(file_field, None),
                **vehicle
            )
    return render(request,'member_master.html')


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

def society_details_view(request):
    soc_object = SocietyCreation.objects.all().values()
    soc_bank_object = SocietyBankCreation.objects.all().values()
    soc_other_document_object = SocietyDocumentCreation.objects.all().values()
    soc_document_object = SocietyCreation.objects.values("completion_cert", "occupancy_cert", "deed_of_conveyance", "society_by_law")     
    soc_wing_flat_object = SocietyUnitFlatCreation.objects.all().values()
    wing = SocietyUnitFlatCreation.objects.all().values_list("unit", flat=True).distinct()
    wing_flat_list = []
    for w in wing:
        flats = list(SocietyUnitFlatCreation.objects.filter(unit=w).values_list("flat", flat=True))
        result_tuple = (w, flats)
        wing_flat_list.append(result_tuple)
        print("Result Tuple:", result_tuple)
    print("wing_flat_list==========", wing_flat_list)
    return render(request, "society_details_view.html", {
        "soc_object": soc_object, "soc_bank_object": soc_bank_object,
        "soc_other_document_object": soc_other_document_object,
        "soc_document_object": soc_document_object,
        "soc_wing_flat_object": soc_wing_flat_object,
        "wing_flat_list": wing_flat_list
        })


from datetime import date

def date_handler(obj):
    if isinstance(obj, date):
        return obj.isoformat()
    raise TypeError("Type not serializable")



def member_details_view(request):
    model_fields = MemberMasterCreation._meta.get_fields()
    member_data_label = [
        "id", "wing_flat", "member_name", "ownership_percent", "member_position", "member_dob", 
        "member_pan_no", "member_aadhar_no", "member_address", "member_state", "member_pin_code", 
        "member_email", "member_contact", "member_emergency_contact", "member_occupation", 
        "member_is_primary" 
    ]
    data = [field.name for field in model_fields if field.name not in ['wing_flat']]
    member_details = MemberMasterCreation.objects.filter(member_is_primary=True).values(
        "wing_flat__id", "wing_flat__unit_flat_unique", "member_name", "ownership_percent", "member_position", "member_dob", 
        "member_pan_no", "member_aadhar_no", "member_address", "member_state", "member_pin_code", 
        "member_email", "member_contact", "member_emergency_contact", "member_occupation", 
        "member_is_primary"
    )
    flat_id = None
    if request.method == "POST":
        flat_id = request.POST.get("member_id")
        wing_flat_number = SocietyUnitFlatCreation.objects.get(pk=flat_id).unit_flat_unique
        # Member detials
        parents = MemberMasterCreation.objects.filter(wing_flat=flat_id)
        children = MemberNomineeCreation.objects.all()
        combined_data = []
        for parent in parents:
            parent_data = {
                'member_id': parent.pk,
                'member_name': parent.member_name,
                'ownership_percent': parent.ownership_percent,
                'member_position': parent.member_position,
                'member_dob': parent.member_dob,
                'member_pan_no': parent.member_pan_no,
                'member_aadhar_no': parent.member_aadhar_no,
                'member_address': parent.member_address,
                'member_state': parent.member_state,
                'member_pin_code': parent.member_pin_code,
                'member_email': parent.member_email,
                'member_contact': parent.member_contact,
                'member_emergency_contact': parent.member_emergency_contact,
                'member_occupation': parent.member_occupation,
                'member_is_primary': parent.member_is_primary,
                
                'nominee_Details': [
                    {
                        'nominee_name': child.nominee_name,
                        'date_of_nomination': child.date_of_nomination,
                        'nominee_name': child.nominee_name,
                        'date_of_nomination': child.date_of_nomination,
                        'relation_with_nominee': child.relation_with_nominee,
                        'nominee_sharein_percent': child.nominee_sharein_percent,
                        'nominee_dob': child.nominee_dob,
                        'nominee_aadhar_no': child.nominee_aadhar_no,
                        'nominee_pan_no': child.nominee_pan_no,
                        'nominee_email': child.nominee_email,
                        'nominee_address': child.nominee_address,
                        'nominee_state': child.nominee_state,
                        'nominee_pin_code': child.nominee_pin_code,
                        'nominee_contact': child.nominee_contact,
                        'nominee_emergency_contact': child.nominee_emergency_contact,
                    } for child in children.filter(member_name=parent.id)
                ]
            }
            combined_data.append(parent_data)
        
        print("parents===========================", combined_data)


        # Shared details
        shares_obj = list(FlatSharesDetails.objects.filter(wing_flat=flat_id).values())
        # Home loan details
        home_loan_obj = list(FlatHomeLoanDetails.objects.filter(wing_flat=flat_id).values())
        # GST details
        gst_obj = list(FlatGSTDetails.objects.filter(wing_flat=flat_id).values())
        # Vehicle details
        vehicle_obj = list(FlatVehicleDetails.objects.filter(wing_flat=flat_id).values())
        return JsonResponse(
            {
                'all_member_json': json.dumps(combined_data, default=date_handler), 
                'flat_id': flat_id, 
                'wing_flat': wing_flat_number,
                'shares_details': json.dumps(shares_obj, default=date_handler),
                'home_loan_obj': json.dumps(home_loan_obj, default=date_handler),
                'gst_obj': json.dumps(gst_obj, default=date_handler),
                'vehicle_obj': json.dumps(vehicle_obj, default=date_handler)
            })

    return render(request, "member_master_table.html", {
        "member_data_label": member_data_label,
        "member_details": member_details,
        "flat_id": flat_id
    })



def member_edit_view(request):
    if request.method == "POST":
        print("edit view==================")
    return render(request, "member_master_table.html", {})













# def member_details_view(request):
#     id = request.POST.get("id")
#     print("id========", id)
#     render(request, "member_master_table.html")