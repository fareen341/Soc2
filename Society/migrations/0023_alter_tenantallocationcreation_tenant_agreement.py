# Generated by Django 4.0 on 2024-01-30 04:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Society', '0022_alter_tenantallocationcreation_tenant_from_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tenantallocationcreation',
            name='tenant_agreement',
            field=models.FileField(blank=True, null=True, upload_to='files/'),
        ),
    ]
