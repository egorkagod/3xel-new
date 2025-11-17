from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.contrib.admin.sites import NotRegistered

from order.models import Order


admin.site.site_header = "Панель управления 3xel"
admin.site.site_title = "3xel Admin"                  
admin.site.index_title = ""

User = get_user_model()

# Безопасно снимаем регистрацию, если была выполнена ранее
try:
    admin.site.unregister(User)
except NotRegistered:  # если модель не была зарегистрирована — игнорируем
    pass

class OrderInline(admin.StackedInline):
    model = Order
    extra = 0


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    inlines = [OrderInline]
    list_display = (
        'id',
        'username',
        'email',
        'first_name',
        'last_name',
        'patronymic',
        'phone',
        'birth_date',
        'is_staff',
        'is_active',
    )
    fieldsets = UserAdmin.fieldsets + (
        (
            'Дополнительная информация',
            {
                'fields': (
                    'patronymic',
                    'phone',
                    'birth_date',
                )
            },
        ),
    )
