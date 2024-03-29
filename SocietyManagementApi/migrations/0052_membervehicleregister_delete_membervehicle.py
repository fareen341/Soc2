# Generated by Django 4.0 on 2024-02-17 11:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Society', '0047_alter_membernomineecreation_member_name'),
        ('SocietyManagementApi', '0051_gstdetails'),
    ]

    operations = [
        migrations.CreateModel(
            name='MemberVehicleRegister',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parking_lot', models.CharField(max_length=200)),
                ('vehicle_type', models.CharField(max_length=200)),
                ('vehicle_number', models.CharField(max_length=200)),
                ('vehicle_brand', models.CharField(max_length=200)),
                ('rc_copy', models.FileField(upload_to='files/')),
                ('sticker_number', models.CharField(max_length=200)),
                ('chargable', models.CharField(default='', max_length=200)),
                ('unique_member_shares', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='Society.membermastercreation')),
                ('wing_flat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Society.societyunitflatcreation')),
            ],
        ),
        migrations.DeleteModel(
            name='MemberVehicle',
        ),
    ]
