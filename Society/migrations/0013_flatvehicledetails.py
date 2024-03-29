# Generated by Django 4.0 on 2024-01-22 14:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Society', '0012_rename_member_gst_number_flatgstdetails_gst_number'),
    ]

    operations = [
        migrations.CreateModel(
            name='FlatVehicleDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parking_lot', models.CharField(blank=True, max_length=300, null=True)),
                ('vehicle_type', models.CharField(blank=True, max_length=300, null=True)),
                ('vehicle_number', models.CharField(blank=True, max_length=300, null=True)),
                ('vehicle_brand', models.CharField(blank=True, max_length=300, null=True)),
                ('rc_copy', models.FileField(blank=True, null=True, upload_to='files/')),
                ('sticker_number', models.CharField(blank=True, max_length=300, null=True)),
                ('select_charge', models.CharField(blank=True, max_length=300, null=True)),
                ('new_vehicle_id_select_charge', models.CharField(blank=True, max_length=300, null=True)),
                ('wing_flat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Society.societyunitflatcreation')),
            ],
        ),
    ]
