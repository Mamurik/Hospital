from django.urls import path
from .api_views import (
    doctor_list,
    doctor_detail,
    patient_list,
    patient_detail,
    procedure_list,
    procedure_detail,
    doctors_by_specialization,
    patients_by_doctor,
    specialization_list,
    doctors_above_norm,
    DoctorListView,
    DoctorDetailView,
)
# from django.urls import path
# from .api_views import register, login_view, patient_dashboard
urlpatterns = [    
    path('doctors/', DoctorListView.as_view(), name='doctor-list'),
    path('doctors/<int:pk>/', DoctorDetailView.as_view(), name='doctor-detail'),
    path('patients/', patient_list, name='patient-list'),
    path('patients/<int:pk>/', patient_detail, name='patient-detail'),
    path('procedures/', procedure_list, name='procedure-list'),
    path('procedures/<int:pk>/', procedure_detail, name='procedure-detail'),
    path('doctors/specialization/<int:specialization_id>/', doctors_by_specialization, name='doctors-by-specialization'),
    path('doctors/<int:doctor_id>/patients/', patients_by_doctor, name='patients-by-doctor'),
    path('specializations/', specialization_list, name='specialization-list'),
     path('doctors/above-norm/<int:year>/<int:month>/', doctors_above_norm, name='doctors-above-norm'),
    # path('register/', register, name='register'),
    # path('login/', login_view, name='login'),
    # path('patient-dashboard/', patient_dashboard, name='patient-dashboard'),
]