# Generated by Django 4.0 on 2024-02-08 10:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('SocietyManagementApi', '0009_alter_househelp_house_help_name_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Suggestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('suggestions', models.TextField()),
                ('meeting', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='SocietyManagementApi.meetings')),
            ],
        ),
    ]
