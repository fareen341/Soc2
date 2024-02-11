# Generated by Django 3.2.12 on 2024-02-10 04:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Society', '0039_alter_flatsharesdetails_application_number'),
        ('SocietyManagementApi', '0023_auto_20240210_0450'),
    ]

    operations = [
        migrations.AddField(
            model_name='membervehicle',
            name='wing_flat',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='Society.societyunitflatcreation'),
        ),
        migrations.AlterField(
            model_name='membervehicle',
            name='parking_lot',
            field=models.CharField(default='', max_length=200),
        ),
        migrations.AlterField(
            model_name='membervehicle',
            name='rc_copy',
            field=models.CharField(default='', max_length=200),
        ),
        migrations.AlterField(
            model_name='membervehicle',
            name='sticker_number',
            field=models.CharField(default='', max_length=200),
        ),
        migrations.AlterField(
            model_name='membervehicle',
            name='vehicle_brand',
            field=models.CharField(default='', max_length=200),
        ),
        migrations.AlterField(
            model_name='membervehicle',
            name='vehicle_number',
            field=models.CharField(default='', max_length=200),
        ),
        migrations.AlterField(
            model_name='membervehicle',
            name='vehicle_type',
            field=models.CharField(default='', max_length=200),
        ),
    ]
