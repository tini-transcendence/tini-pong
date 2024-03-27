# Generated by Django 5.0.3 on 2024-03-27 05:54

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('user', '0002_alter_user_id_42'),
    ]

    operations = [
        migrations.CreateModel(
            name='Friend',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_from', models.UUIDField(default=uuid.uuid4)),
                ('user_to', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.user')),
            ],
        ),
        migrations.AddConstraint(
            model_name='friend',
            constraint=models.UniqueConstraint(fields=('user_from', 'user_to'), name='friend_relation'),
        ),
    ]