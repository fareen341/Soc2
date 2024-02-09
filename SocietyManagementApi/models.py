from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from Society.models import *



class Meetings(models.Model):
    date_of_meeting = models.DateField(null=True, blank=True)
    time_of_meeting = models.CharField(max_length=200, null=True, blank=True)
    place_of_meeting = models.CharField(max_length=200, null=True, blank=True)
    agenda =  models.FileField(upload_to='files/', null=True, blank=True)
    financials =  models.FileField(upload_to='files/', null=True, blank=True)
    other =  models.FileField(upload_to='files/', null=True, blank=True)
    content = RichTextUploadingField(default='')


class MemberVehicle(models.Model):
    wing_flat = models.CharField(max_length=200) 
    parking_lot = models.CharField(max_length=200, null=True, blank=True)
    vehicle_type = models.CharField(max_length=200, null=True, blank=True)
    vehicle_number = models.CharField(max_length=200, null=True, blank=True)
    vehicle_brand = models.CharField(max_length=200, null=True, blank=True)
    rc_copy = models.CharField(max_length=200, null=True, blank=True)
    sticker_number = models.CharField(max_length=200, null=True, blank=True)


class HouseHelp(models.Model):
    # wing_flat = models.ForeignKey(SocietyUnitFlatCreation, on_delete=models.CASCADE)
    house_help_name = models.CharField(max_length=300)
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


class Suggestion(models.Model):
    meeting = models.ForeignKey(Meetings, on_delete=models.CASCADE)
    suggestions = models.TextField()