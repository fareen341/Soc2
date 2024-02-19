from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(SocietyCreation)
admin.site.register(SocietyBankCreation)
admin.site.register(SocietyDocumentCreation)
admin.site.register(SocietyUnitFlatCreation)
admin.site.register(MemberMasterCreation)
admin.site.register(MemberNomineeCreation)
admin.site.register(FlatSharesDetails)
admin.site.register(FlatHomeLoanDetails)
admin.site.register(FlatGSTDetails)
admin.site.register(FlatVehicleDetails)
admin.site.register(TenentMasterCreation)
admin.site.register(TenantAllocationCreation)
admin.site.register(HouseHelpCreation)
admin.site.register(HouseHelpAllocation)