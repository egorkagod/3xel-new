from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0003_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='video_url',
            field=models.CharField(max_length=500, null=True, blank=True),
        ),
    ]

