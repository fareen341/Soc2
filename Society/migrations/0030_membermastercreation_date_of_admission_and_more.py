# Generated by Django 4.0 on 2024-02-01 11:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Society', '0029_remove_househelpallocation_aadhar_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='membermastercreation',
            name='date_of_admission',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='membermastercreation',
            name='date_of_cessation',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='membermastercreation',
            name='date_of_entrance_fees',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='membermastercreation',
            name='reason_for_cessation',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='membermastercreation',
            name='status',
            field=models.BooleanField(blank=True, null=True),
        ),
    ]
