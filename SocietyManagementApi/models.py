from django.db import models




class Meetings(models.Model):
    date_of_meeting = models.DateField(null=True, blank=True)
    time_of_meeting = models.CharField(max_length=200, null=True, blank=True)
    place_of_meeting = models.CharField(max_length=200, null=True, blank=True)
    agenda =  models.FileField(upload_to='files/', null=True, blank=True)
    financials =  models.FileField(upload_to='files/', null=True, blank=True)
    other =  models.FileField(upload_to='files/', null=True, blank=True)