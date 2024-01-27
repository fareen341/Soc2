# Generated by Django 4.0 on 2024-01-27 04:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Society', '0018_alter_membermastercreation_member_aadhar_no_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='membernomineecreation',
            name='wing_flat',
        ),
        migrations.AddField(
            model_name='membernomineecreation',
            name='member_name',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='Society.membermastercreation'),
        ),
    ]
