# Generated by Django 4.0 on 2024-02-02 09:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Society', '0031_remove_membermastercreation_status_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='membermastercreation',
            name='member_current_status',
        ),
    ]
