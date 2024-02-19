# Generated by Django 4.0 on 2024-02-17 07:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Society', '0047_alter_membernomineecreation_member_name'),
        ('SocietyManagementApi', '0049_alter_sharesdetailsmaster_unique_member_shares'),
    ]

    operations = [
        migrations.CreateModel(
            name='HomeLoanDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bank_loan_name', models.CharField(max_length=300)),
                ('bank_loan_object', models.CharField(blank=True, max_length=300, null=True)),
                ('bank_loan_date', models.DateField(blank=True, null=True)),
                ('bank_loan_value', models.CharField(blank=True, max_length=300, null=True)),
                ('bank_loan_acc_no', models.CharField(blank=True, max_length=300, null=True)),
                ('bank_loan_installment', models.CharField(blank=True, max_length=300, null=True)),
                ('bank_loan_status', models.BooleanField(blank=True, default=False, null=True)),
                ('bank_loan_remark', models.CharField(blank=True, max_length=300, null=True)),
                ('bank_noc_file', models.FileField(blank=True, null=True, upload_to='files/')),
                ('unique_member_shares', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='Society.membermastercreation')),
                ('wing_flat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Society.societyunitflatcreation')),
            ],
        ),
    ]