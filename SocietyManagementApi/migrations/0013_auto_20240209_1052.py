# Generated by Django 3.2.12 on 2024-02-09 10:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('SocietyManagementApi', '0012_househelpallocationmaster'),
    ]

    operations = [
        migrations.RenameField(
            model_name='househelpallocationmaster',
            old_name='house_help_aadhar',
            new_name='aadhar',
        ),
        migrations.RenameField(
            model_name='househelpallocationmaster',
            old_name='house_help_pan',
            new_name='pan',
        ),
        migrations.RemoveField(
            model_name='househelpallocationmaster',
            name='house_help_name',
        ),
        migrations.RemoveField(
            model_name='househelpallocationmaster',
            name='house_help_role',
        ),
        migrations.AddField(
            model_name='househelpallocationmaster',
            name='name',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, related_name='name_allocations_new', to='SocietyManagementApi.househelp'),
        ),
        migrations.AddField(
            model_name='househelpallocationmaster',
            name='role',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, related_name='role_allocations_new', to='SocietyManagementApi.househelp'),
        ),
    ]
