# views.py
from django.views.generic import CreateView
from django.urls import reverse_lazy
from django.contrib.messages.views import SuccessMessageMixin
from .forms import DoctorForm
from .models import Doctor

class DoctorCreateView(SuccessMessageMixin, CreateView):
    model = Doctor
    form_class = DoctorForm
    template_name = 'doctors/doctor_form.html'  # Укажите путь к вашему шаблону
    success_url = reverse_lazy('doctor-list')  # Перенаправление после успешного создания
    success_message = "Доктор успешно создан!"

    def form_valid(self, form):
        return super().form_valid(form)
