from django.contrib import admin
from .models import (
    SocietyCreation, SocietyBankCreation, SocietyDocumentCreation, SocietyUnitFlatCreation,
    MemberMasterCreation, MemberNomineeCreation, FlatSharesDetails, FlatHomeLoanDetails,
    FlatGSTDetails, FlatVehicleDetails
)

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