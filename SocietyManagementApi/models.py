from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from Society.models import *
from django.core.exceptions import ValidationError




class SocietyCreationNew(models.Model):
    society_name = models.CharField(max_length=200)
    admin_email = models.EmailField(null=True, blank=True)
    alternate_email = models.EmailField(null=True, blank=True)
    admin_mobile_number = models.CharField(max_length=20, null=True, blank=True)
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


class Meetings(models.Model):
    date_of_meeting = models.DateField(null=True, blank=True)
    time_of_meeting = models.CharField(max_length=200, null=True, blank=True)
    place_of_meeting = models.CharField(max_length=200, null=True, blank=True)
    agenda =  models.FileField(upload_to='files/', null=True, blank=True)
    financials =  models.FileField(upload_to='files/', null=True, blank=True)
    other =  models.FileField(upload_to='files/', null=True, blank=True)
    content = RichTextUploadingField(default='')


class Suggestion(models.Model):
    meeting = models.ForeignKey(Meetings, on_delete=models.CASCADE)
    suggestions = models.TextField()


class HouseHelp(models.Model):
    # wing_flat = models.ForeignKey(SocietyUnitFlatCreation, on_delete=models.CASCADE)
    house_help_name = models.CharField(max_length=300, error_messages={'blank': 'Name is required!'})
    house_help_pan_number = models.CharField(max_length=300)
    house_help_pan_doc = models.FileField(upload_to='files/')
    house_help_contact = models.CharField(max_length=300)
    house_help_aadhar_number = models.CharField(max_length=300)
    house_help_aadhar_doc = models.FileField(upload_to='files/')
    house_help_address = models.CharField(max_length=300)
    house_help_city = models.CharField(max_length=300)
    house_help_state = models.CharField(max_length=300)
    house_help_pin = models.CharField(max_length=300)
    other_doc = models.FileField(upload_to='files/', null=True, blank=True)
    other_document_specifications = models.CharField(max_length=300, null=True, blank=True)


class HouseHelpAllocationMaster(models.Model):
    wing_flat = models.ForeignKey(SocietyUnitFlatCreation, on_delete=models.CASCADE)
    member_name = models.ForeignKey(MemberMasterCreation, on_delete=models.CASCADE, related_name='owner_allocations_new')
    aadhar = models.ForeignKey(HouseHelp, on_delete=models.CASCADE, related_name='aadhar_allocations_new', blank=True, null=True)
    pan = models.ForeignKey(HouseHelp, on_delete=models.CASCADE, related_name='pan_allocations_new', blank=True, null=True)
    name = models.ForeignKey(HouseHelp, on_delete=models.CASCADE, related_name='name_allocations_new')
    role = models.CharField(max_length=300)
    house_help_period_from = models.DateField(blank=True, null=True)
    house_help_period_to = models.DateField(blank=True, null=True)


    # def save(self, *args, **kwargs):
    #     if self.pk is None:  # This is a new instance, i.e., creation
    #         if not self.house_help_period_from:
    #             raise ValidationError("period from date is required.")
    #     else:  # This is an existing instance, i.e., update
    #         if not self.house_help_period_to:
    #             raise ValidationError("period to date is required is required.")
    #     super().save(*args, **kwargs)



# class MemberVehicle(models.Model):
#     wing_flat = models.CharField(max_length=200)
#     parking_lot = models.CharField(max_length=200, null=True, blank=True)
#     vehicle_type = models.CharField(max_length=200, null=True, blank=True)
#     vehicle_number = models.CharField(max_length=200, null=True, blank=True)
#     vehicle_brand = models.CharField(max_length=200, null=True, blank=True)
#     rc_copy = models.CharField(max_length=200, null=True, blank=True)
#     sticker_number = models.CharField(max_length=200, null=True, blank=True)


class MemberVehicle(models.Model):
    wing_flat = models.ForeignKey(SocietyUnitFlatCreation, on_delete=models.CASCADE)
    parking_lot = models.CharField(max_length=200)
    vehicle_type = models.CharField(max_length=200)
    vehicle_number = models.CharField(max_length=200)
    vehicle_brand = models.CharField(max_length=200)
    rc_copy = models.FileField(upload_to='files/')
    sticker_number = models.CharField(max_length=200)
    chargable = models.CharField(max_length=200)



class SocietyBankCreationNew(models.Model):
    society_creation = models.ForeignKey(SocietyCreationNew, on_delete=models.CASCADE)
    beneficiary_name = models.CharField(max_length=100)
    beneficiary_code = models.CharField(max_length=100)
    beneficiary_acc_number = models.CharField(max_length=100)
    beneficiary_bank = models.CharField(max_length=100)
    is_primary = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.society_creation_id:
            print("id=========================")
            # If society_creation is not set, get the last SocietyCreation object
            last_society_creation = SocietyCreationNew.objects.first()
            if last_society_creation:
                self.society_creation = last_society_creation
        super().save(*args, **kwargs)


class FlatWing(models.Model):
    society_creation = models.ForeignKey(SocietyCreationNew, on_delete=models.CASCADE)
    wing = models.CharField(max_length=100)
    flat = models.CharField(max_length=300)
    # wing_flat_unique = models.CharField(max_length=100)

    def save(self, *args, **kwargs):
        if not self.society_creation_id:
            # If society_creation is not set, get the last SocietyCreation object
            last_society_creation = SocietyCreationNew.objects.first()
            if last_society_creation:
                self.society_creation = last_society_creation

        # if self.wing and self.flat:
        #     # Split the flat string into individual flat values
        #     flat_values = self.flat.split(',')

        #     # Loop over each flat value
        #     for flat_value in flat_values:
        #         # Concatenate wing and flat value with a hyphen
        #         wing_flat_unique_value = f"{self.wing}-{flat_value.strip()}"

        #         # Create or update the wing_flat_unique field
        #         if self.wing_flat_unique:
        #             self.wing_flat_unique += f", {wing_flat_unique_value}"
        #         else:
        #             self.wing_flat_unique = wing_flat_unique_value

        # super().save(*args, **kwargs)




class SocietyDocumentCreationNew(models.Model):
    society_creation = models.ForeignKey(SocietyCreation, on_delete=models.CASCADE)
    other_document = models.FileField(upload_to='files/')
    other_document_specification = models.CharField(max_length=100)

    def save(self, *args, **kwargs):
        if not self.society_creation_id:
            last_society_creation = SocietyCreationNew.objects.first()
            if last_society_creation:
                self.society_creation = last_society_creation

        super().save(*args, **kwargs)


class SocietyRegistrationDocuments(models.Model):
    society_creation = models.OneToOneField(SocietyCreationNew, on_delete=models.CASCADE)
    completion_cert = models.FileField(upload_to='files/')
    occupancy_cert = models.FileField(upload_to='files/')
    deed_of_conveyance = models.FileField(upload_to='files/')
    society_by_law = models.FileField(upload_to='files/')
    soc_other_document = models.FileField(upload_to='files/', null=True, blank=True)
    soc_other_document_spec = models.CharField(max_length=100, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.society_creation_id:
            last_society_creation = SocietyCreationNew.objects.first()
            if last_society_creation:
                self.society_creation = last_society_creation

        super().save(*args, **kwargs)
