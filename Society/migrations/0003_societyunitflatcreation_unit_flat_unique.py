# Generated by Django 4.0 on 2024-01-21 16:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Society', '0002_societybankcreation_is_primary'),
    ]

    operations = [
        migrations.AddField(
            model_name='societyunitflatcreation',
            name='unit_flat_unique',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
