# Generated by Django 3.2.12 on 2024-02-10 04:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SocietyManagementApi', '0025_auto_20240210_0452'),
    ]

    operations = [
        migrations.AlterField(
            model_name='membervehicle',
            name='rc_copy',
            field=models.FileField(blank=True, null=True, upload_to='files/'),
        ),
    ]
