# Generated by Django 4.0 on 2024-01-30 06:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Society', '0023_alter_tenantallocationcreation_tenant_agreement'),
    ]

    operations = [
        migrations.RenameField(
            model_name='tenantallocationcreation',
            old_name='aadhar_number',
            new_name='flat_primary_owner',
        ),
        migrations.RenameField(
            model_name='tenantallocationcreation',
            old_name='owner',
            new_name='tenant_aadhar_number',
        ),
        migrations.RenameField(
            model_name='tenantallocationcreation',
            old_name='pan_number',
            new_name='tenant_pan_number',
        ),
    ]