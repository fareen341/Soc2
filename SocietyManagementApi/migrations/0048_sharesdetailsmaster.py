# Generated by Django 4.0 on 2024-02-17 06:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Society', '0047_alter_membernomineecreation_member_name'),
        ('SocietyManagementApi', '0047_alter_membervehicle_chargable'),
    ]

    operations = [
        migrations.CreateModel(
            name='SharesDetailsMaster',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('folio_number', models.CharField(max_length=300)),
                ('shares_date', models.DateField(blank=True, null=True)),
                ('application_number', models.CharField(max_length=300)),
                ('shares_certificate', models.CharField(blank=True, max_length=300, null=True)),
                ('allotment_number', models.CharField(blank=True, max_length=300, null=True)),
                ('shares_from', models.CharField(blank=True, max_length=300, null=True)),
                ('shares_to', models.CharField(blank=True, max_length=300, null=True)),
                ('shares_transfer_date', models.DateField(blank=True, null=True)),
                ('total_amount_received', models.IntegerField(blank=True, null=True)),
                ('total_amount_date', models.DateField(blank=True, null=True)),
                ('transfer_from_folio_no', models.CharField(blank=True, max_length=300, null=True)),
                ('transfer_to_folio_no', models.CharField(blank=True, max_length=300, null=True)),
                ('unique_member_shares', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='Society.membermastercreation')),
                ('wing_flat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Society.societyunitflatcreation')),
            ],
        ),
    ]