# Generated by Django 4.0 on 2024-02-08 04:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocietyManagementApi', '0005_remove_househelp_wing_flat'),
    ]

    operations = [
        migrations.RenameField(
            model_name='househelp',
            old_name='se_help_aadhar_doc',
            new_name='house_help_aadhar_doc',
        ),
    ]
