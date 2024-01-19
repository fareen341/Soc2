from django.contrib import admin
from .models import SocietyCreation, SocietyBankCreation, SocietyDocumentCreation, SocietyUnitFlatCreation

# Register your models here.
admin.site.register(SocietyCreation)
admin.site.register(SocietyBankCreation)
admin.site.register(SocietyDocumentCreation)
admin.site.register(SocietyUnitFlatCreation)