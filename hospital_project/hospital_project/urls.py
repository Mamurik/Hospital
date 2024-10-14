from django.contrib import admin
from django.urls import path, include
from doctors.api_views import doctor_list  # Импортируем API для отображения списка врачей на главной

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('doctors.urls')),  # Включаем маршруты API
    path('', doctor_list, name='home'),  # Отображение списка врачей на главной странице
]
