from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0004_completedorder_alter_order_cdek_and_more'),
        ('pay', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='payment',
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                to='pay.payment',
            ),
        ),
        migrations.AddField(
            model_name='order',
            name='promocode',
            field=models.OneToOneField(
                blank=True,
                default=None,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name='used_order',
                to='pay.promocode',
            ),
        ),
    ]

