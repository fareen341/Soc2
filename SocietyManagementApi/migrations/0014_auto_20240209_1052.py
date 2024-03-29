# Generated by Django 3.2.12 on 2024-02-09 10:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('SocietyManagementApi', '0013_auto_20240209_1052'),
    ]

    operations = [
        migrations.AlterField(
            model_name='househelpallocationmaster',
            name='name',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='name_allocations_new', to='SocietyManagementApi.househelp'),
        ),
        migrations.AlterField(
            model_name='househelpallocationmaster',
            name='role',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='role_allocations_new', to='SocietyManagementApi.househelp'),
        ),
    ]
