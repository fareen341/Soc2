# Generated by Django 3.2.12 on 2024-02-10 06:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SocietyManagementApi', '0027_auto_20240210_0610'),
    ]

    operations = [
        migrations.AlterField(
            model_name='membervehicle',
            name='chargable',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='membervehicle',
            name='rc_copy',
            field=models.FileField(upload_to='files/'),
        ),
    ]
