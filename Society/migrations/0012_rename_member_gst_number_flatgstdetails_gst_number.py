# Generated by Django 4.0 on 2024-01-22 13:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Society', '0011_flatgstdetails'),
    ]

    operations = [
        migrations.RenameField(
            model_name='flatgstdetails',
            old_name='member_gst_number',
            new_name='gst_number',
        ),
    ]
