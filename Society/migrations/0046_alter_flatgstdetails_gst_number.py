# Generated by Django 4.0 on 2024-02-15 05:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Society', '0045_alter_flatgstdetails_gst_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flatgstdetails',
            name='gst_number',
            field=models.CharField(max_length=300),
        ),
    ]
