# Generated by Django 4.0 on 2024-02-17 05:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SocietyManagementApi', '0046_alter_societydocumentcreationnew_society_creation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='membervehicle',
            name='chargable',
            field=models.CharField(default='', max_length=200),
        ),
    ]
