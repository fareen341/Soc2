# Generated by Django 4.0 on 2024-02-08 03:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocietyManagementApi', '0004_househelp'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='househelp',
            name='wing_flat',
        ),
    ]