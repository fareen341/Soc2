from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from Society import views

from django.urls import path, include
from SocietyManagementApi import views as apiviews
from rest_framework.routers import DefaultRouter


#creatting router object
router=DefaultRouter()
router.register('meetingsapi',apiviews.MeetingsViewSet,basename='meetings')
router.register('vehicle', apiviews.MemberVehicleView, basename='vehicle')
router.register('shares', apiviews.FlatSharesView, basename='shares')
router.register('househelp', apiviews.HouseHelpView, basename='househelp')





urlpatterns = [
    path('api/',include(router.urls)),

    path('admin/', admin.site.urls),
    path('login/', views.login, name="login"),
    path('society-creation/', views.society_creation, name="society_creation"),
    path('house-help-master/', views.house_help_master, name="house_help_master"),
    path('income-expense-ledger/', views.income_expense_ledger, name="income_expense_ledger"),
    path('asset-liability-ledger/', views.asset_liability_ledger, name="asset_liability_ledger"),
    path('extra1/', views.extra1, name="extra1"),
    path('extra2/', views.extra2, name="extra2"),
    path('extra3/', views.extra3, name="extra3"),
    path('society-details-view/', views.society_details_view, name="society_details_view"),
    path('member-master/', views.member_master, name="member_master"),
    path('member-master-creation/', views.member_master_creation, name="member_master_creation"),
    path('member-details-view/', views.member_details_view, name="member_details_view"),
    path('member-edit-view/', views.member_edit_view, name="member_edit_view"),
    path('tenent-master/', views.tenent_master, name="tenent_master"),
    path('tenent-allocation/', views.tenent_allocation, name="tenent_allocation"),
    path('tenant-allocation-edit/', views.tenant_allocation_edit, name="tenant_allocation_edit"),

    path('house-help-master/', views.house_help_master, name="house_help_master"),
    path('house-help-allocation/', views.house_help_allocation, name="house_help_allocation"),
    path('house-help-allocation-edit/', views.house_help_allocation_edit, name="house_help_allocation_edit"),
    path('member-history-view/', views.member_history_view, name="member_history_view"),
    path('ckeditor/', include('ckeditor_uploader.urls')),


    

    

    
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)