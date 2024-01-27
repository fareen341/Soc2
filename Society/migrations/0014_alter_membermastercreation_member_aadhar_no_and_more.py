# Generated by Django 4.0 on 2024-01-24 06:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Society', '0013_flatvehicledetails'),
    ]

    operations = [
        migrations.AlterField(
            model_name='membermastercreation',
            name='member_aadhar_no',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='name'),
        ),
        migrations.AlterField(
            model_name='membermastercreation',
            name='member_address',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='name'),
        ),
        migrations.AlterField(
            model_name='membermastercreation',
            name='member_contact',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='name'),
        ),
        migrations.AlterField(
            model_name='membermastercreation',
            name='member_dob',
            field=models.DateField(blank=True, null=True, verbose_name='name'),
        ),
        migrations.AlterField(
            model_name='membermastercreation',
            name='member_email',
            field=models.EmailField(blank=True, max_length=254, null=True, verbose_name='name'),
        ),
        migrations.AlterField(
            model_name='membermastercreation',
            name='member_emergency_contact',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='name'),
        ),
        migrations.AlterField(
            model_name='membermastercreation',
            name='member_is_primary',
            field=models.BooleanField(blank=True, default=False, null=True, verbose_name='name'),
        ),
        migrations.AlterField(
            model_name='membermastercreation',
            name='member_name',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='name'),
        ),
        migrations.AlterField(
            model_name='membermastercreation',
            name='member_occupation',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='name'),
        ),
        migrations.AlterField(
            model_name='membermastercreation',
            name='member_pan_no',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='name'),
        ),
        migrations.AlterField(
            model_name='membermastercreation',
            name='member_pin_code',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='name'),
        ),
        migrations.AlterField(
            model_name='membermastercreation',
            name='member_position',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='name'),
        ),
        migrations.AlterField(
            model_name='membermastercreation',
            name='member_state',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='name'),
        ),
        migrations.AlterField(
            model_name='membermastercreation',
            name='ownership_percent',
            field=models.IntegerField(blank=True, null=True, verbose_name='name'),
        ),
    ]
