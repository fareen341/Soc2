# Generated by Django 4.0 on 2024-02-14 07:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Society', '0043_alter_flathomeloandetails_bank_loan_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flathomeloandetails',
            name='bank_loan_name',
            field=models.CharField(max_length=300),
        ),
    ]
