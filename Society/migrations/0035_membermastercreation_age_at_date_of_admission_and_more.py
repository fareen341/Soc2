# Generated by Django 4.0 on 2024-02-04 06:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Society', '0034_alter_membermastercreation_date_of_cessation'),
    ]

    operations = [
        migrations.AddField(
            model_name='membermastercreation',
            name='age_at_date_of_admission',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='membermastercreation',
            name='other_attachment',
            field=models.FileField(blank=True, null=True, upload_to='files/'),
        ),
        migrations.AddField(
            model_name='membermastercreation',
            name='sales_agreement',
            field=models.FileField(blank=True, null=True, upload_to='files/'),
        ),
    ]