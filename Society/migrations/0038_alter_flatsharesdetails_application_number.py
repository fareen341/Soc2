# Generated by Django 4.0 on 2024-02-07 09:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Society', '0037_alter_flatsharesdetails_folio_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flatsharesdetails',
            name='application_number',
            field=models.CharField(default='', max_length=300),
        ),
    ]