# Generated by Django 4.0 on 2024-01-15 03:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SocietyCreation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('society_name', models.CharField(max_length=200)),
                ('admin_email', models.EmailField(blank=True, max_length=254, null=True)),
                ('alternate_email', models.EmailField(blank=True, max_length=254, null=True)),
                ('admin_mobile_number', models.CharField(blank=True, max_length=10, null=True)),
                ('alternate_mobile_number', models.CharField(blank=True, max_length=10, null=True)),
                ('registration_number', models.CharField(blank=True, max_length=200, null=True)),
                ('registration_doc', models.FileField(blank=True, null=True, upload_to='files/')),
                ('pan_number', models.CharField(blank=True, max_length=200, null=True)),
                ('pan_number_doc', models.FileField(blank=True, null=True, upload_to='files/')),
                ('gst_number', models.CharField(blank=True, max_length=200, null=True)),
                ('gst_number_doc', models.FileField(blank=True, null=True, upload_to='files/')),
                ('interest', models.CharField(blank=True, max_length=100, null=True)),
                ('society_reg_address', models.TextField(blank=True, null=True)),
                ('society_city', models.CharField(blank=True, max_length=100, null=True)),
                ('socity_state', models.CharField(blank=True, max_length=100, null=True)),
                ('pin_code', models.CharField(blank=True, max_length=100, null=True)),
                ('society_corr_reg_address', models.TextField(blank=True, null=True)),
                ('society_corr_city', models.CharField(blank=True, max_length=100, null=True)),
                ('socity_corr_state', models.CharField(blank=True, max_length=100, null=True)),
                ('pin_corr_code', models.CharField(blank=True, max_length=100, null=True)),
                ('completion_cert', models.FileField(blank=True, null=True, upload_to='files/')),
                ('occupancy_cert', models.FileField(blank=True, null=True, upload_to='files/')),
                ('deed_of_conveyance', models.FileField(blank=True, null=True, upload_to='files/')),
                ('society_by_law', models.FileField(blank=True, null=True, upload_to='files/')),
                ('soc_other_document', models.FileField(blank=True, null=True, upload_to='files/')),
                ('soc_other_document_spec', models.CharField(blank=True, max_length=100, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='SocietyUnitFlatCreation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('unit', models.CharField(blank=True, max_length=100, null=True)),
                ('flat', models.CharField(blank=True, max_length=300, null=True)),
                ('society_creation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Society.societycreation')),
            ],
        ),
        migrations.CreateModel(
            name='SocietyDocumentCreation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('other_document', models.FileField(blank=True, null=True, upload_to='files/')),
                ('other_document_specification', models.CharField(blank=True, max_length=100, null=True)),
                ('society_creation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Society.societycreation')),
            ],
        ),
        migrations.CreateModel(
            name='SocietyBankCreation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('beneficiary_name', models.CharField(blank=True, max_length=100, null=True)),
                ('beneficiary_code', models.CharField(blank=True, max_length=100, null=True)),
                ('beneficiary_acc_number', models.CharField(blank=True, max_length=100, null=True)),
                ('beneficiary_bank', models.CharField(blank=True, max_length=100, null=True)),
                ('society_creation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Society.societycreation')),
            ],
        ),
    ]
