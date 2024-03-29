# Generated by Django 4.0 on 2024-02-08 04:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SocietyManagementApi', '0007_alter_househelp_house_help_aadhar_doc_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='househelp',
            name='house_help_aadhar_doc',
            field=models.FileField(upload_to='files/'),
        ),
        migrations.AlterField(
            model_name='househelp',
            name='house_help_aadhar_number',
            field=models.CharField(max_length=300),
        ),
        migrations.AlterField(
            model_name='househelp',
            name='house_help_address',
            field=models.CharField(max_length=300),
        ),
        migrations.AlterField(
            model_name='househelp',
            name='house_help_city',
            field=models.CharField(max_length=300),
        ),
        migrations.AlterField(
            model_name='househelp',
            name='house_help_contact',
            field=models.CharField(max_length=300),
        ),
        migrations.AlterField(
            model_name='househelp',
            name='house_help_name',
            field=models.CharField(max_length=30),
        ),
        migrations.AlterField(
            model_name='househelp',
            name='house_help_pan_doc',
            field=models.FileField(upload_to='files/'),
        ),
        migrations.AlterField(
            model_name='househelp',
            name='house_help_pan_number',
            field=models.CharField(max_length=30),
        ),
        migrations.AlterField(
            model_name='househelp',
            name='house_help_pin',
            field=models.CharField(max_length=300),
        ),
        migrations.AlterField(
            model_name='househelp',
            name='house_help_state',
            field=models.CharField(max_length=30),
        ),
    ]
