# Generated by Django 3.2.12 on 2024-02-12 04:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Society', '0039_alter_flatsharesdetails_application_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='membernomineecreation',
            name='nominee_name',
            field=models.CharField(default='', max_length=300),
        ),
    ]
