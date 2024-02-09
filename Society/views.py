from django.shortcuts import render
import json
from django.http import JsonResponse
from .models import (
    SocietyCreation, SocietyBankCreation, SocietyDocumentCreation, SocietyUnitFlatCreation,
    MemberMasterCreation, MemberNomineeCreation, FlatSharesDetails, FlatHomeLoanDetails, FlatGSTDetails,
    FlatVehicleDetails, TenentMasterCreation, TenantAllocationCreation, HouseHelpCreation, HouseHelpAllocation
)
from SocietyManagementProject import constants
from django.db.models import Count, Sum
from django.db.models import Q


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
        "": "Select Flat No",
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
            
            # print("ajax_get_primary========================", ajax_get_primary)
            if json.loads(ajax_get_primary):
                get_flat = SocietyUnitFlatCreation.objects.get(unit_flat_unique=flat_selected_value)
                is_primary = MemberMasterCreation.objects.filter(Q(wing_flat=get_flat), Q(member_is_primary=True), ~Q(flat_status="vacant")).exists()
                if flat_selected_value and is_primary:
                    print("ISPRIMARY=======================================~~~~~~~~~~~~~~~~~~~~~~~~")
                    return JsonResponse({'is_primary': is_primary})
            
            if json.loads(get_ownership_ajax):
                total_ownership = 0
                wing_flat_number = request.POST.get('wing_flat_number')
                member_ownership = json.loads(request.POST.get('member_ownership'))
                # print("OWNSERSHI+=======================", member_ownership)
                ownership_flat_no = SocietyUnitFlatCreation.objects.get(unit_flat_unique=wing_flat_number)
                total_flat_ownership = MemberMasterCreation.objects.filter(wing_flat=ownership_flat_no, date_of_cessation__isnull=True).aggregate(sum_ownership=Sum('ownership_percent'))
                print("total_flat_ownership===", total_flat_ownership)
                if total_flat_ownership['sum_ownership'] is not None:
                    total_ownership = total_flat_ownership['sum_ownership'] + member_ownership
                if member_ownership and total_ownership > 100:
                    # print("TOTAL===================", total_flat_ownership['sum_ownership'])
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
    if (form_name in ["member_form_creation", "add_member_from_modal"]) and (memberData and nomineeData):
        wing_flat_number = request.POST.get("wing_flat_number")
        print("WING===============", wing_flat_number)
        wing_flat = SocietyUnitFlatCreation.objects.get(unit_flat_unique=wing_flat_number)
        memberData = json.loads(request.POST.get("memberData"))
        nomineeData = json.loads(request.POST.get("nomineeData"))
        print("=================================================")
        print(f"MEMBER DATA: {memberData[0]['member_is_primary']} \n, NOMINEE: {nomineeData}")
        get_identification_number = MemberMasterCreation.objects.filter(wing_flat=wing_flat, member_is_primary=True).values_list('same_flat_member_identification', flat=True)
        if get_identification_number:
            member_creation_obj = MemberMasterCreation.objects.create(
                wing_flat=wing_flat,
                same_flat_member_identification=get_identification_number[0],
                **memberData[0]
            )
        else:
            member_creation_obj = MemberMasterCreation.objects.create(
                wing_flat=wing_flat,
                **memberData[0]
            )

        for nominee in nomineeData:
            MemberNomineeCreation.objects.create(
                member_name = member_creation_obj,
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
    flat_numbers_queryset = SocietyUnitFlatCreation.objects.values_list("unit", "flat")
    wing_flat_no = {
        "": "Select Flat No",
        **{f"{wing}-{flat}": f"{wing}-{flat}" for wing, flat in flat_numbers_queryset}
    }
    
    model_fields = MemberMasterCreation._meta.get_fields()
    member_data_label = [
        "wing_flat__id", "wing_flat__unit_flat_unique", "member_name", "ownership_percent", "member_position", "member_dob", 
        "member_pan_no", "member_aadhar_no", "member_address", "member_state", "member_pin_code", 
        "member_email", "member_contact", "member_emergency_contact", "member_occupation", 
        "member_is_primary", "date_of_admission", "date_of_entrance_fees", "date_of_cessation", "reason_for_cessation",
        "flat_status"
    ]
    data = [field.name for field in model_fields if field.name not in ['wing_flat']]
    member_details = MemberMasterCreation.objects.filter(Q(member_is_primary=True), Q(date_of_cessation__isnull=True)).values(
        "wing_flat__id", "wing_flat__unit_flat_unique", "member_name", "ownership_percent", "member_position", "member_dob", 
        "member_pan_no", "member_aadhar_no", "member_address", "member_state", "member_pin_code", 
        "member_email", "member_contact", "member_emergency_contact", "member_occupation", 
        "member_is_primary", "date_of_admission", "date_of_entrance_fees", "date_of_cessation", "reason_for_cessation", 
        "flat_status"

    )
    flat_id = None
    if request.method == "POST":
        flat_id = request.POST.get("member_id")
        wing_flat_number = SocietyUnitFlatCreation.objects.get(pk=flat_id).unit_flat_unique
        # Member detials
        parents = MemberMasterCreation.objects.filter(wing_flat=flat_id, date_of_cessation__isnull=True)
        children = MemberNomineeCreation.objects.all()
        combined_data = []
        for parent in parents:
            parent_data = {
                'member_id': parent.pk,
                'member_wing': parent.wing_flat.unit_flat_unique,
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
                'date_of_admission': parent.date_of_admission,
                'age_at_date_of_admission': parent.age_at_date_of_admission,
                'sales_agreement': parent.sales_agreement.url if parent.sales_agreement else None,
                'other_attachment': parent.other_attachment if parent.other_attachment else None,
                'date_of_entrance_fees': parent.date_of_entrance_fees,
                'date_of_cessation': parent.date_of_cessation,
                'reason_for_cessation': parent.reason_for_cessation,
                'flat_status': parent.flat_status,
                

                'nominee_Details': [
                    {
                        'nominee_id': child.pk,
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
                'vehicle_obj': json.dumps(vehicle_obj, default=date_handler),
                'wing_flat_no': json.dumps(wing_flat_no)
            })

    return render(request, "member_master_table.html", {
        "member_data_label": member_data_label,
        "member_details": member_details,
        "flat_id": flat_id
    })



def member_edit_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        print("DATA========================================", data)

        # GET CESSATION DATE
        cessation_data = None
        for item in data:
            member_obj = item['member_obj']
            cessation_data = member_obj.get('date_of_cessation')

        for entry in data:
            member_obj_data = entry['member_obj']
            nominee_obj_data = entry['nominee_obj']
            member_id = member_obj_data.pop('member_id')
            member_checkbox = False
            member_is_primary_val = member_obj_data.get('member_is_primary', None)

            if member_is_primary_val == "on":
                member_checkbox = True

            member_instance = MemberMasterCreation.objects.filter(id=int(member_id)).values('member_name')
            member_instance = MemberMasterCreation.objects.filter(id=int(member_id)).update(
                ownership_percent = int(member_obj_data['ownership_percent']) if ['ownership_percent'] else None,
                member_name = member_obj_data['member_name'] if member_obj_data['member_name'] else None,
                member_position = member_obj_data['member_position'] if member_obj_data['member_position'] else None,
                member_dob = member_obj_data['member_dob'] if member_obj_data['member_dob'] else None,
                member_pan_no = member_obj_data['member_pan_no'] if member_obj_data['member_pan_no'] else None,
                member_aadhar_no = member_obj_data['member_aadhar_no'] if member_obj_data['member_aadhar_no'] else None,
                member_address = member_obj_data['member_address'] if member_obj_data['member_address'] else None,
                member_state = member_obj_data['member_state'] if member_obj_data['member_state'] else None,
                member_pin_code = member_obj_data['member_pin_code'] if member_obj_data['member_pin_code'] else None,
                member_email = member_obj_data['member_email'] if member_obj_data['member_email'] else None,
                member_contact = member_obj_data['member_contact'] if member_obj_data['member_contact'] else None,
                member_emergency_contact = member_obj_data['member_emergency_contact'] if member_obj_data['member_emergency_contact'] else None,
                member_occupation = member_obj_data['member_occupation'] if member_obj_data['member_occupation'] else None,
                member_is_primary = member_checkbox,
                date_of_admission = member_obj_data['date_of_admission'] if member_obj_data['date_of_admission'] else None,
                sales_agreement = member_obj_data['sales_agreement'] if member_obj_data['sales_agreement'] else None,
                other_attachment = member_obj_data['other_attachment'] if member_obj_data['other_attachment'] else None,
                date_of_entrance_fees = member_obj_data['date_of_entrance_fees'] if member_obj_data['date_of_entrance_fees'] else None,
                date_of_cessation = cessation_data if cessation_data else None,
                reason_for_cessation = member_obj_data['reason_for_cessation'] if member_obj_data['reason_for_cessation'] else None,
                flat_status = member_obj_data['flat_status'] if member_obj_data['flat_status'] else None
            )


            member_ins = MemberMasterCreation.objects.get(id=int(member_id))
            for nominee_data in nominee_obj_data:
                nominee_id = nominee_data['nominee_data'].pop('nominee_id', None)
                if not nominee_id:
                    nominee_instance = MemberNomineeCreation.objects.create(
                        member_name = member_ins,
                        nominee_name = nominee_data['nominee_data'].get('nominee_name'),
                        date_of_nomination = nominee_data['nominee_data'].get('date_of_nomination'),
                        relation_with_nominee = nominee_data['nominee_data'].get('relation_with_nominee'),
                        nominee_sharein_percent = nominee_data['nominee_data'].get('nominee_sharein_percent'),
                        nominee_dob = nominee_data['nominee_data'].get('nominee_dob'),
                        nominee_aadhar_no = nominee_data['nominee_data'].get('nominee_aadhar_no'),
                        nominee_pan_no = nominee_data['nominee_data'].get('nominee_pan_no'),
                        nominee_email = nominee_data['nominee_data'].get('nominee_email'),
                        nominee_address = nominee_data['nominee_data'].get('nominee_address'),
                        nominee_state = nominee_data['nominee_data'].get('nominee_state'),
                        nominee_pin_code = nominee_data['nominee_data'].get('nominee_pin_code'),
                        nominee_contact = nominee_data['nominee_data'].get('nominee_contact'),
                        nominee_emergency_contact = nominee_data['nominee_data'].get('nominee_emergency_contact')
                    )
                else:
                    nominee_instance = MemberNomineeCreation.objects.filter(id=int(nominee_id)).update(
                        nominee_name = nominee_data['nominee_data'].get('nominee_name'),
                        date_of_nomination = nominee_data['nominee_data'].get('date_of_nomination'),
                        relation_with_nominee = nominee_data['nominee_data'].get('relation_with_nominee'),
                        nominee_sharein_percent = nominee_data['nominee_data'].get('nominee_sharein_percent'),
                        nominee_dob = nominee_data['nominee_data'].get('nominee_dob'),
                        nominee_aadhar_no = nominee_data['nominee_data'].get('nominee_aadhar_no'),
                        nominee_pan_no = nominee_data['nominee_data'].get('nominee_pan_no'),
                        nominee_email = nominee_data['nominee_data'].get('nominee_email'),
                        nominee_address = nominee_data['nominee_data'].get('nominee_address'),
                        nominee_state = nominee_data['nominee_data'].get('nominee_state'),
                        nominee_pin_code = nominee_data['nominee_data'].get('nominee_pin_code'),
                        nominee_contact = nominee_data['nominee_data'].get('nominee_contact'),
                        nominee_emergency_contact = nominee_data['nominee_data'].get('nominee_emergency_contact')

                    )


        flat_with_members = SocietyUnitFlatCreation.objects.filter(id=70).prefetch_related('membermastercreation_set')

        data_dict = {}
        nominees = MemberNomineeCreation.objects.all()

        # Iterate over each flat object in the queryset
        for flat in flat_with_members:
            # Create a list to store member data for this flat
            member_data_list = []
            
            # Iterate over each member related to this flat
            for member in flat.membermastercreation_set.all():
                member_data = {
                        'member_id': member.pk,
                        'member_name': member.member_name,                        
                        'nominee_Details': [
                            {
                                'nominee_name': nom.nominee_name,
                                'nominee_name': nom.nominee_name,
                            } for nom in nominees.filter(member_name=member.id)
                        ]
                    }
                member_data_list.append(member_data)
            
            data_dict[flat.pk] = {
                'flat_details': {
                    'unit_flat_unique': flat.unit_flat_unique,
                    # Add more flat details as needed
                },
                'members': member_data_list,
            }
        # print("DATA=========", data_dict)

        # print("edit view==================")
        # # FLAT DETAILS START
        # print("FLAT DETAILS===========================")
        # # print("FLAT DETAILS===========================", flats)
        # history_flat_data = SocietyUnitFlatCreation.objects.filter(pk=flat_id).values("membermastercreation__member_name")
        # history_member_data = MemberMasterCreation.objects.all()
        # # history_shares_data = FlatSharesDetails.objects.all()
        # # history_home_load_data = FlatHomeLoanDetails.objects.all()
        # # history_gst_data = FlatGSTDetails.objects.all()
        # # history_vehicle_data = FlatVehicleDetails.objects.all()
        # # combined_data = []

        # member_history_data = []
        # member_history_obj = MemberMasterCreation.objects.filter(wing_flat=flat_id)
        # history_shares_obj = FlatSharesDetails.objects.filter(wing_flat=flat_id)
        # for parent in member_history_obj:
        #     parent_data = {
        #         'member_id': parent.pk,
        #         'member_name': parent.member_name,
        #         'ownership_percent': parent.ownership_percent,
        #         'member_position': parent.member_position,
        #         'member_dob': parent.member_dob,
        #         'member_pan_no': parent.member_pan_no,
        #         'member_aadhar_no': parent.member_aadhar_no,
        #         'member_address': parent.member_address,
        #         'member_state': parent.member_state,
        #         'member_pin_code': parent.member_pin_code,
        #         'member_email': parent.member_email,
        #         'member_contact': parent.member_contact,
        #         'member_emergency_contact': parent.member_emergency_contact,
        #         'member_occupation': parent.member_occupation,
        #         'member_is_primary': parent.member_is_primary,
                
        #         'nominee_Details': [
        #             {
        #                 'nominee_name': child.nominee_name,
        #                 'date_of_nomination': child.date_of_nomination,
        #                 'nominee_name': child.nominee_name,
        #                 'date_of_nomination': child.date_of_nomination,
        #                 'relation_with_nominee': child.relation_with_nominee,
        #                 'nominee_sharein_percent': child.nominee_sharein_percent,
        #                 'nominee_dob': child.nominee_dob,
        #                 'nominee_aadhar_no': child.nominee_aadhar_no,
        #                 'nominee_pan_no': child.nominee_pan_no,
        #                 'nominee_email': child.nominee_email,
        #                 'nominee_address': child.nominee_address,
        #                 'nominee_state': child.nominee_state,
        #                 'nominee_pin_code': child.nominee_pin_code,
        #                 'nominee_contact': child.nominee_contact,
        #                 'nominee_emergency_contact': child.nominee_emergency_contact,
        #             } for child in children.filter(member_name=parent.id)
        #         ]
        #     }
        #     member_history_data.append(parent_data)

        # for flat in history_flat_data:
        #     flat_data = {
        #         'flat_history_id': flat.pk,
                
        #     }

        # FLAT DETAILS END
    return render(request, "member_master_table.html", {})

def tenent_master(request):
    flat_number = request.POST.get("flat_number")
    print("FLAT================", flat_number)
    tenant_master_lable = [
        "wing_flat", "tenent_name", "tenent_pan_number", "tenent_pan_doc", "tenent_contact", "tenent_aadhar_number", "tenent_aadhar_doc",
        "tenent_address", "tenent_city", "tenent_state", "tenent_pin_code", "tenent_email", "tenent_other_doc", "tenent_doc_specification",  
    ]
    tenant_objects = TenentMasterCreation.objects.filter(wing_flat__isnull=False).values(
        "wing_flat", "tenent_name", "tenent_pan_number", "tenent_pan_doc", "tenent_contact", "tenent_aadhar_number", "tenent_aadhar_doc",
        "tenent_address", "tenent_city", "tenent_state", "tenent_pin_code", "tenent_email", "tenent_other_doc", "tenent_doc_specification"
    )

    print("tenant_details=============", tenant_objects )

    if request.method == "POST":
        tenent_data = request.POST.get("tenentData")
        if tenent_data:
            tenent_data = json.loads(tenent_data)
            print("tenent_data===============", tenent_data)
            aadhar = request.FILES.get('tenent_aadhar_doc', None)
            pan = request.FILES.get('tenent_pan_doc', None)
            other_doc = request.FILES.get('tenent_other_doc', None)
            print(f"AADHAR======{aadhar}, PAN======{pan}, Other dc========{other_doc}")
            TenentMasterCreation.objects.create(
                **tenent_data,
                tenent_aadhar_doc = aadhar,
                tenent_pan_doc = pan,
                tenent_other_doc = other_doc
            )
            
    return render(request, "tenent_master.html", {
      "tenant_master_lable": tenant_master_lable,
      "tenant_objects": tenant_objects
    })



def tenent_allocation(request):
    # GET OWNER NAME BASED ON FLAT SELECTED
    tenant_allocation_seleted_flat = request.POST.get("tenant_allocation_seleted_flat")
    if tenant_allocation_seleted_flat:
        try:
            get_owner_obj = MemberMasterCreation.objects.get(wing_flat__unit_flat_unique=tenant_allocation_seleted_flat, member_is_primary=True)
            get_owner_name = get_owner_obj.member_name
            return JsonResponse({'get_owner_name': get_owner_name})
        except MemberMasterCreation.DoesNotExist: 
            owner_not_found_placeholder = "Not Found, This Flat Is Empty!"
            return JsonResponse({'owner_not_found_placeholder': owner_not_found_placeholder})
    
    # GET TENANT NAME BASED ON AADHAR/PAN
    tenant_pan_aadhar = request.POST.get("id_tenant_aadhar_pan")
    if tenant_pan_aadhar:
        try:
            tenant_obj = TenentMasterCreation.objects.get(Q(tenent_pan_number=tenant_pan_aadhar) | Q(tenent_aadhar_number=tenant_pan_aadhar))
            tenant_name = tenant_obj.tenent_name
            return JsonResponse({'tenant_name': tenant_name})
        except TenentMasterCreation.DoesNotExist:
            tenant_name_placeholder = "No Tenant Found!"
            return JsonResponse({'tenant_name_placeholder': tenant_name_placeholder})
    
    # TENENT ALLOCATION TABLE
    flat_numbers_queryset = SocietyUnitFlatCreation.objects.values_list("unit", "flat")
    wing_flat_no = {
        "": "Select Flat No",
        **{f"{wing}-{flat}": f"{wing}-{flat}" for wing, flat in flat_numbers_queryset}
    }
    tenant_allocation_lable = [
        "id", "wing_flat", "tenent_name", "flat_primary_owner", "tenant_aadhar_number", "tenant_pan_number", "tenant_from_date", "tenant_to_date", "tenant_agreement", "tenant_noc",
    ]
    tenant_allocation_objects = TenantAllocationCreation.objects.filter(wing_flat__isnull=False).values(
        "id", "wing_flat__unit_flat_unique", "tenent_name__tenent_name", "flat_primary_owner", "tenant_aadhar_number", "tenant_pan_number", "tenant_from_date", "tenant_to_date", "tenant_agreement", "tenant_noc",
    )

    # TENENT POST METHOD
    tenant_creation = request.POST.get("tenentData")
    if tenant_creation:
        tenant_creation =json.loads(tenant_creation)
        print("TENENT DATA============", tenant_creation)
        tenant_agreement = request.FILES.get('tenant_agreement', None)
        tenant_noc = request.FILES.get('tenant_noc', None)
        print(f"tenant agreement: {tenant_agreement}, tenant noc: {tenant_noc}")
        tenant_aadhar = ""
        tenant_pan = ""
        if tenant_creation.get('tenant_aadhar_pan'):
            if len(tenant_creation.get('tenant_aadhar_pan')) > 10:
                tenant_aadhar = tenant_creation.get('tenant_aadhar_pan')
            else:
                tenant_pan = tenant_creation.get('tenant_aadhar_pan')

        # print("AADHAR NO............", tenant_creation.get('tenant_aadhar_pan'))
        # tm = TenentMasterCreation.objects.get(Q(tenent_pan_number=tenant_pan) | Q(tenent_aadhar_number=tenant_aadhar))
        # print("TM===============", tm)
            
        TenantAllocationCreation.objects.create(
            wing_flat = SocietyUnitFlatCreation.objects.get(unit_flat_unique = tenant_creation.get('get_owner_name')),
            flat_primary_owner = tenant_creation.get('flat_primary_owner'),
            tenent_name = TenentMasterCreation.objects.get(Q(tenent_pan_number=tenant_pan) | Q(tenent_aadhar_number=tenant_aadhar)),
            tenant_pan_number = tenant_pan,
            tenant_aadhar_number = tenant_aadhar,
            tenant_from_date = tenant_creation.get('tenant_period_from'),
            tenant_to_date = tenant_creation.get('tenant_period_to'),
            tenant_agreement = tenant_agreement, 
            tenant_noc = tenant_noc
        )

    
    return render(request,'tenent_allocation.html', {
        "tenant_allocation_lable": tenant_allocation_lable,
        "tenant_allocation_objects": tenant_allocation_objects,
        "wing_flat_no": wing_flat_no
    })



def tenant_allocation_edit(request):
    print("edit allocation!!!!!!!!!!!!!!!!!")
    if request.method == "POST":
        tenant_allocation_id = request.POST.get('tenant_allocation_id')
        if tenant_allocation_id:
            tenant_obj = list(TenantAllocationCreation.objects.filter(id=tenant_allocation_id).values(
                "wing_flat__unit_flat_unique", "tenent_name__tenent_name", "flat_primary_owner", "tenant_aadhar_number", "tenant_pan_number",
                  "tenant_from_date", "tenant_to_date", "tenant_agreement", "tenant_noc"
                ))
            print("tenant_allocation_id============", tenant_obj)
            return JsonResponse({'tenant_obj': json.dumps(tenant_obj, default=date_handler)})
    return render(request,'tenent_allocation.html')


def member_history_view(request):
    if request.method == "POST":
        flat_id = request.POST.get("flat_id")
        print("flat_number===================", flat_id)
        history_obj_primary = MemberMasterCreation.objects.filter(wing_flat=flat_id, date_of_cessation__isnull=False)
        history_obj_secondary = MemberMasterCreation.objects.filter(wing_flat=flat_id, member_is_primary=False)
        #
        children = MemberNomineeCreation.objects.all()
        combined_data = []

        fetched_same_flat_member_identification = ''
        for parent in history_obj_primary:
            if parent.member_is_primary == True:
                parent_data = {
                    'member_id': parent.pk,
                    'member_name': parent.member_name,
                    'nominee_Details': [
                        {
                            'nominee_id': child.pk,
                            'nominee_name': child.nominee_name,
                        } for child in children.filter(member_name=parent.id)
                    ]
                }
                fetched_same_flat_member_identification = parent.same_flat_member_identification
                combined_data.append(parent_data)
            
            sub_members_data = []
            for sub_parent in history_obj_secondary.filter(same_flat_member_identification=fetched_same_flat_member_identification):
                sub_member_data = {
                    'member_id': sub_parent.pk,
                    'member_name': sub_parent.member_name,
                    'nominee_Details': [
                        {
                            'nominee_id': child.pk,
                            'nominee_name': child.nominee_name,
                        } for child in children.filter(member_name=sub_parent.id)
                    ]
                }
                sub_members_data.append(sub_member_data)

            combined_data.append({'sub_members': sub_members_data})

        # Ensure the final format is correct as per your requirement
        final_data = [combined_data[0]]
        for item in combined_data[1:]:
            if 'sub_members' in item:
                final_data[-1]['sub_members'] = item['sub_members']
            else:
                final_data.append(item)

        print("COMBINED DATA+=====================", final_data)
        return JsonResponse({'final_data': json.dumps(final_data, default=date_handler)})
        #
    return render(request,'member_master_table.html')





def house_help_allocation(request):
    flat_numbers_queryset = SocietyUnitFlatCreation.objects.values_list("unit", "flat")
    wing_flat_no = {
        "": "Select Flat No",
        **{f"{wing}-{flat}": f"{wing}-{flat}" for wing, flat in flat_numbers_queryset}
    }
    flat_number = request.POST.get("flat_number")
    print("FLAT================", flat_number)
    house_help_allocation_lable = [
        "wing_flat", "owner_name", "house_help_aadhar", "house_help_pan", "house_help_name", "house_help_role", "house_help_period_from", "house_help_period_to", "status"
    ]
    house_help_allocation_objects = HouseHelpAllocation.objects.all().values(
        "wing_flat", "owner_name__house_help_name", "house_help_aadhar__house_help_aadhar_number", "house_help_pan__house_help_pan_number", "house_help_name", "house_help_role", "house_help_period_from", "house_help_period_to", "status"
    )

    # GET OWNER NAME BASED ON FLAT SELECTED
    hh_allocation_seleted_flat = request.POST.get("hh_flat_owner_name")
    if hh_allocation_seleted_flat:
        try:
            get_owner_obj = MemberMasterCreation.objects.get(wing_flat__unit_flat_unique=hh_allocation_seleted_flat, member_is_primary=True)
            get_owner_name = get_owner_obj.member_name
            print("==================", get_owner_name)
            return JsonResponse({'get_owner_name': get_owner_name})
        except MemberMasterCreation.DoesNotExist: 
            owner_not_found_placeholder = "Not Found, This Flat Is Empty!"
            return JsonResponse({'owner_not_found_placeholder': owner_not_found_placeholder})
        

    # GET HH NAME BASED ON AADHAR/PAN
    hh_pan_aadhar = request.POST.get("id_hh_aadhar_pan")
    print("============", hh_pan_aadhar)
    if hh_pan_aadhar:
        try:
            hh_obj = HouseHelpCreation.objects.get(Q(house_help_aadhar_number=hh_pan_aadhar) | Q(house_help_pan_number=hh_pan_aadhar))
            hh_name = hh_obj.house_help_name
            hh_role = hh_obj.house_help_city
            print("============", hh_name)
            return JsonResponse({'hh_name': hh_name, "hh_role": hh_role})
        except HouseHelpCreation.DoesNotExist:
            hh_name_placeholder = "No House Help Found!"
            return JsonResponse({'hh_name_placeholder': hh_name_placeholder, "hh_role_placeholder": "Not Found!"})

    return render(request,'house_help_allocation.html', {
        "wing_flat_no": wing_flat_no,
      "house_help_allocation_lable": house_help_allocation_lable,
      "house_help_allocation_objects": house_help_allocation_objects
    })













def house_help_master(request):
    flat_numbers_queryset = SocietyUnitFlatCreation.objects.values_list("unit", "flat")
    wing_flat_no = {
        "": "Select Flat No",
        **{f"{wing}-{flat}": f"{wing}-{flat}" for wing, flat in flat_numbers_queryset}
    }
    # HH CREATION TABLE
    house_help_label = [
        "wing_flat", "house_help_name", "house_help_pan_number", "house_help_pan_doc", "house_help_contact", 
        "house_help_aadhar_number", "se_help_aadhar_doc", "house_help_address", "house_help_city", 
        "house_help_state", "house_help_pin", "other_doc", "document_specifications"
        ]
    house_help_objects = HouseHelpCreation.objects.filter(wing_flat__isnull=False).values(
        "wing_flat__unit_flat_unique", "house_help_name", "house_help_pan_number", "house_help_pan_doc", "house_help_contact", 
        "house_help_aadhar_number", "se_help_aadhar_doc", "house_help_address", "house_help_city", 
        "house_help_state", "house_help_pin", "other_doc", "document_specifications"
    )

    return render(request,'house_help_master.html', {
       "wing_flat_no": wing_flat_no,
       "house_help_label": house_help_label,
       "house_help_objects": house_help_objects
    })
































def house_help_allocation_edit(request):
    return render(request,'house_help_allocation.html')