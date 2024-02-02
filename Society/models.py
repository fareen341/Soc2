from django.db import models

# Create your models here.
class SocietyCreation(models.Model):
    society_name = models.CharField(max_length=200)
    admin_email = models.EmailField(null=True, blank=True)
    alternate_email = models.EmailField(null=True, blank=True)
    admin_mobile_number = models.CharField(max_length=10, null=True, blank=True)
    alternate_mobile_number = models.CharField(max_length=10, null=True, blank=True)

    registration_number = models.CharField(max_length=200, null=True, blank=True)
    registration_doc = models.FileField(upload_to='files/', null=True, blank=True)

    pan_number = models.CharField(max_length=200, null=True, blank=True)
    pan_number_doc = models.FileField(upload_to='files/', null=True, blank=True)

    gst_number = models.CharField(max_length=200, null=True, blank=True)
    gst_number_doc = models.FileField(upload_to='files/', null=True, blank=True)

    interest = models.CharField(max_length=100, null=True, blank=True)

    society_reg_address = models.TextField(null=True, blank=True)
    society_city = models.CharField(max_length=100, null=True, blank=True)
    socity_state = models.CharField(max_length=100, null=True, blank=True)
    pin_code = models.CharField(max_length=100, null=True, blank=True)

    society_corr_reg_address = models.TextField(null=True, blank=True)
    society_corr_city = models.CharField(max_length=100, null=True, blank=True)
    socity_corr_state = models.CharField(max_length=100, null=True, blank=True)
    pin_corr_code = models.CharField(max_length=100, null=True, blank=True)

    # Bank Details
    # beneficiary_name = models.CharField(max_length=100, null=True, blank=True)
    # beneficiary_code = models.CharField(max_length=100, null=True, blank=True)
    # beneficiary_acc_number = models.CharField(max_length=100, null=True, blank=True)
    # beneficiary_bank = models.CharField(max_length=100, null=True, blank=True)

    # # Document Detail
    completion_cert = models.FileField(upload_to='files/', null=True, blank=True)
    occupancy_cert = models.FileField(upload_to='files/', null=True, blank=True)
    deed_of_conveyance = models.FileField(upload_to='files/', null=True, blank=True)
    society_by_law = models.FileField(upload_to='files/', null=True, blank=True)
    soc_other_document = models.FileField(upload_to='files/', null=True, blank=True)
    soc_other_document_spec = models.CharField(max_length=100, null=True, blank=True)


class SocietyBankCreation(models.Model):
    society_creation = models.ForeignKey(SocietyCreation, on_delete=models.CASCADE)
    beneficiary_name = models.CharField(max_length=100, null=True, blank=True)
    beneficiary_code = models.CharField(max_length=100, null=True, blank=True)
    beneficiary_acc_number = models.CharField(max_length=100, null=True, blank=True)
    beneficiary_bank = models.CharField(max_length=100, null=True, blank=True)
    is_primary = models.BooleanField(default=False, null=True, blank=True)


class SocietyDocumentCreation(models.Model):
    society_creation = models.ForeignKey(SocietyCreation, on_delete=models.CASCADE)
    other_document = models.FileField(upload_to='files/', null=True, blank=True)
    other_document_specification = models.CharField(max_length=100, null=True, blank=True)


class SocietyUnitFlatCreation(models.Model):
    society_creation = models.ForeignKey(SocietyCreation, on_delete=models.CASCADE)
    unit = models.CharField(max_length=100, null=True, blank=True)
    flat = models.CharField(max_length=300, null=True, blank=True)
    unit_flat_unique = models.CharField(max_length=100, null=True, blank=True)


class MemberMasterCreation(models.Model):
    wing_flat = models.ForeignKey(SocietyUnitFlatCreation, on_delete=models.CASCADE, verbose_name="Flat No.")
    member_name = models.CharField(max_length=200, null=True, blank=True, verbose_name="Name")
    ownership_percent = models.IntegerField(null=True, blank=True, verbose_name="Ownership %")
    member_position = models.CharField(max_length=200, null=True, blank=True, verbose_name="Position") 
    member_dob = models.DateField(null=True, blank=True, verbose_name="DOB")
    member_pan_no = models.CharField(max_length=200, null=True, blank=True, verbose_name="PAN No.")
    member_aadhar_no = models.CharField(max_length=200, null=True, blank=True, verbose_name="Aadhar No.")
    member_address = models.CharField(max_length=200, null=True, blank=True, verbose_name="Address") 
    member_state = models.CharField(max_length=200, null=True, blank=True, verbose_name="State")
    member_pin_code = models.CharField(max_length=200, null=True, blank=True, verbose_name="Pin Code")
    member_email = models.EmailField(null=True, blank=True, verbose_name="Email")
    member_contact = models.CharField(max_length=200, null=True, blank=True, verbose_name="Contact No.")
    member_emergency_contact = models.CharField(max_length=200, null=True, blank=True, verbose_name="Emerg. Contact No.")
    member_occupation = models.CharField(max_length=200, null=True, blank=True, verbose_name="Occupation")
    member_is_primary = models.BooleanField(default = False, null=True, blank=True, verbose_name="Primary")
    date_of_admission = models.DateField(null=True, blank=True)
    date_of_entrance_fees = models.DateField(null=True, blank=True)
    date_of_cessation = models.CharField(max_length=200, null=True, blank=True)
    reason_for_cessation = models.CharField(max_length=200, null=True, blank=True)
    status = models.BooleanField(null=True, blank=True)

    def __str__(self):
        return self.member_name


class MemberNomineeCreation(models.Model):
    member_name = models.ForeignKey(MemberMasterCreation, on_delete=models.CASCADE)
    nominee_name = models.CharField(max_length=300, null=True, blank=True)
    date_of_nomination = models.DateField(null=True, blank=True)
    relation_with_nominee = models.CharField(max_length=300, null=True, blank=True) 
    nominee_sharein_percent = models.IntegerField(null=True, blank=True)
    nominee_dob = models.DateField(null=True, blank=True)
    nominee_aadhar_no = models.CharField(max_length=300, null=True, blank=True)
    nominee_pan_no = models.CharField(max_length=300, null=True, blank=True)
    nominee_email = models.EmailField(null=True, blank=True)
    nominee_address = models.CharField(max_length=300, null=True, blank=True)
    nominee_state = models.CharField(max_length=300, null=True, blank=True)
    nominee_pin_code = models.CharField(max_length=300, null=True, blank=True)
    nominee_contact = models.CharField(max_length=300, null=True, blank=True)
    nominee_emergency_contact = models.CharField(max_length=300, null=True, blank=True) 

class FlatSharesDetails(models.Model):
    wing_flat = models.ForeignKey(SocietyUnitFlatCreation, on_delete=models.CASCADE)
    folio_number = models.CharField(max_length=300, null=True, blank=True)
    shares_date = models.DateField(null=True, blank=True)
    application_number = models.CharField(max_length=300, null=True, blank=True)
    shares_certificate = models.CharField(max_length=300, null=True, blank=True)
    allotment_number = models.CharField(max_length=300, null=True, blank=True)
    shares_from = models.CharField(max_length=300, null=True, blank=True)
    shares_to = models.CharField(max_length=300, null=True, blank=True)
    shares_transfer_date = models.DateField(null=True, blank=True)
    total_amount_received = models.IntegerField(null=True, blank=True)
    total_amount_date = models.DateField(null=True, blank=True)
    transfer_from_folio_no = models.CharField(max_length=300, null=True, blank=True)
    transfer_to_folio_no = models.CharField(max_length=300, null=True, blank=True)



class FlatHomeLoanDetails(models.Model):
    wing_flat = models.ForeignKey(SocietyUnitFlatCreation, on_delete=models.CASCADE)
    bank_loan_name = models.CharField(max_length=300, null=True, blank=True)
    bank_loan_object = models.CharField(max_length=300, null=True, blank=True)
    bank_loan_date = models.DateField(null=True, blank=True)
    bank_loan_value = models.CharField(max_length=300, null=True, blank=True)
    bank_loan_acc_no = models.CharField(max_length=300, null=True, blank=True)
    bank_loan_installment = models.CharField(max_length=300, null=True, blank=True)
    bank_loan_status = models.BooleanField(null=True, blank=True, default=False)
    bank_loan_remark = models.CharField(max_length=300, null=True, blank=True)
    bank_noc_file = models.FileField(upload_to='files/', null=True, blank=True)


class FlatGSTDetails(models.Model):
    wing_flat = models.ForeignKey(SocietyUnitFlatCreation, on_delete=models.CASCADE)
    gst_number = models.CharField(max_length=300, null=True, blank=True)
    gst_state = models.CharField(max_length=300, null=True, blank=True) 
    gst_billing_name = models.CharField(max_length=300, null=True, blank=True) 
    gst_billing_address = models.CharField(max_length=300, null=True, blank=True)
    gst_contact_no = models.CharField(max_length=300, null=True, blank=True) 


class FlatVehicleDetails(models.Model):
    wing_flat = models.ForeignKey(SocietyUnitFlatCreation, on_delete=models.CASCADE)
    parking_lot = models.CharField(max_length=300, null=True, blank=True) 
    vehicle_type = models.CharField(max_length=300, null=True, blank=True) 
    vehicle_number = models.CharField(max_length=300, null=True, blank=True) 
    vehicle_brand = models.CharField(max_length=300, null=True, blank=True) 
    rc_copy = models.FileField(upload_to='files/', null=True, blank=True)
    sticker_number = models.CharField(max_length=300, null=True, blank=True) 
    select_charge = models.CharField(max_length=300, null=True, blank=True) 
    new_vehicle_id_select_charge = models.CharField(max_length=300, null=True, blank=True) 


class TenentMasterCreation(models.Model):
    wing_flat = models.ForeignKey(SocietyUnitFlatCreation, on_delete=models.CASCADE)
    tenent_name = models.CharField(max_length=300, null=True, blank=True)
    tenent_pan_number = models.CharField(max_length=300, null=True, blank=True)
    tenent_pan_doc = models.FileField(upload_to='files/', null=True, blank=True)
    tenent_contact = models.CharField(max_length=300, null=True, blank=True)
    tenent_aadhar_number = models.CharField(max_length=300, null=True, blank=True)
    tenent_aadhar_doc = models.FileField(upload_to='files/', null=True, blank=True)
    tenent_address = models.CharField(max_length=300, null=True, blank=True)
    tenent_city = models.CharField(max_length=300, null=True, blank=True)
    tenent_state = models.CharField(max_length=300, null=True, blank=True)
    tenent_pin_code = models.CharField(max_length=300, null=True, blank=True)
    tenent_email = models.CharField(max_length=300, null=True, blank=True)
    tenent_other_doc = models.FileField(upload_to='files/', null=True, blank=True)
    tenent_doc_specification = models.CharField(max_length=300, null=True, blank=True)


class TenantAllocationCreation(models.Model):
    # change to foreign key
    wing_flat = models.ForeignKey(SocietyUnitFlatCreation, on_delete=models.CASCADE)
    tenent_name = models.ForeignKey(TenentMasterCreation, on_delete=models.CASCADE)
    flat_primary_owner = models.CharField(max_length=300, null=True, blank=True)
    tenant_aadhar_number = models.CharField(max_length=300, null=True, blank=True)
    tenant_pan_number = models.CharField(max_length=300, null=True, blank=True)
    tenant_from_date = models.DateField(null=True, blank=True)
    tenant_to_date = models.DateField(null=True, blank=True)
    tenant_agreement = models.FileField(upload_to='files/', null=True, blank=True)
    tenant_noc = models.FileField(upload_to='files/', null=True, blank=True)


class HouseHelpCreation(models.Model):
    wing_flat = models.ForeignKey(SocietyUnitFlatCreation, on_delete=models.CASCADE)
    house_help_name = models.CharField(max_length=300, null=True, blank=True)
    house_help_pan_number = models.CharField(max_length=300, null=True, blank=True)
    house_help_pan_doc = models.FileField(upload_to='files/', null=True, blank=True)
    house_help_contact = models.CharField(max_length=300, null=True, blank=True)
    house_help_aadhar_number = models.CharField(max_length=300, null=True, blank=True)
    se_help_aadhar_doc = models.FileField(upload_to='files/', null=True, blank=True)
    house_help_address = models.CharField(max_length=300, null=True, blank=True)
    house_help_city = models.CharField(max_length=300, null=True, blank=True)
    house_help_state = models.CharField(max_length=300, null=True, blank=True)
    house_help_pin = models.CharField(max_length=300, null=True, blank=True)
    other_doc = models.FileField(upload_to='files/', null=True, blank=True)
    document_specifications = models.FileField(upload_to='files/', null=True, blank=True)


class HouseHelpAllocation(models.Model):
    wing_flat = models.ForeignKey(SocietyUnitFlatCreation, on_delete=models.CASCADE)
    owner_name = models.ForeignKey(HouseHelpCreation, on_delete=models.CASCADE, related_name='owner_allocations')
    house_help_aadhar = models.ForeignKey(HouseHelpCreation, on_delete=models.CASCADE, null=True, blank=True, related_name='aadhar_allocations')
    house_help_pan = models.ForeignKey(HouseHelpCreation, on_delete=models.CASCADE, null=True, blank=True, related_name='pan_allocations')
    house_help_name = models.CharField(max_length=300, null=True, blank=True)
    house_help_role = models.CharField(max_length=300, null=True, blank=True)
    house_help_period_from = models.DateField(null=True, blank=True)
    house_help_period_to = models.DateField(null=True, blank=True)
    status = models.BooleanField(default=False, null=True, blank=True)