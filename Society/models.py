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


class SocietyDocumentCreation(models.Model):
    society_creation = models.ForeignKey(SocietyCreation, on_delete=models.CASCADE)
    other_document = models.FileField(upload_to='files/', null=True, blank=True)
    other_document_specification = models.CharField(max_length=100, null=True, blank=True)


class SocietyUnitFlatCreation(models.Model):
    society_creation = models.ForeignKey(SocietyCreation, on_delete=models.CASCADE)
    unit = models.CharField(max_length=100, null=True, blank=True)
    flat = models.CharField(max_length=300, null=True, blank=True)