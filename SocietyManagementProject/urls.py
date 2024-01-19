from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from Society import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', views.login, name="login"),
    path('society-creation/', views.society_creation, name="society_creation"),
    path('member-master/', views.member_master, name="member_master"),
    path('tenant/', views.tenant, name="tenant"),
    path('house-help-master/', views.house_help_master, name="house_help_master"),
    path('income-expense-ledger/', views.income_expense_ledger, name="income_expense_ledger"),
    path('asset-liability-ledger/', views.asset_liability_ledger, name="asset_liability_ledger"),
    path('extra1/', views.extra1, name="extra1"),
    path('extra2/', views.extra2, name="extra2"),
    path('extra3/', views.extra3, name="extra3"),
    path('society-details-view/', views.society_details_view, name="society_details_view"),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)