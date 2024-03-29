# Generated by Django 3.2.12 on 2024-02-09 11:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Society', '0039_alter_flatsharesdetails_application_number'),
        ('SocietyManagementApi', '0014_auto_20240209_1052'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='househelpallocationmaster',
            name='owner_name',
        ),
        migrations.AddField(
            model_name='househelpallocationmaster',
            name='member_name',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, related_name='owner_allocations_new', to='Society.membermastercreation'),
        ),
    ]
