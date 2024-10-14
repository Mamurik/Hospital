# api_views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Doctor, Patient, Procedure, Specialization
from .serializers import DoctorSerializer, PatientSerializer, ProcedureSerializer, SpecializationSerializer
from django.shortcuts import get_object_or_404
from django.db.models import Count
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Doctor
from .serializers import DoctorSerializer
from django.views.generic import View
from django.views.generic.detail import SingleObjectMixin
def handle_response(serializer, instance=None):
    """Универсальная функция для обработки ответа."""
    if serializer.is_valid():
        instance = serializer.save() if not instance else serializer.update(instance, serializer.validated_data)
        return Response(serializer.data, status=status.HTTP_201_CREATED if instance is None else status.HTTP_200_OK)
    return Response({"errors": serializer.errors, "message": "Не удалось сохранить данные."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def doctor_list(request):
    """Получает список всех докторов или создает нового доктора."""
    if request.method == 'GET':
        doctors = Doctor.objects.all()
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = DoctorSerializer(data=request.data)
        return handle_response(serializer)

@api_view(['GET', 'PUT', 'DELETE'])
def doctor_detail(request, pk):
    """Получает, обновляет или удаляет доктора по его ID."""
    doctor = get_object_or_404(Doctor, pk=pk)
    if request.method == 'GET':
        serializer = DoctorSerializer(doctor)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = DoctorSerializer(doctor, data=request.data)
        return handle_response(serializer, doctor)
    elif request.method == 'DELETE':
        doctor.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def patient_list(request):
    """Получает список всех пациентов или создает нового пациента."""
    if request.method == 'GET':
        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = PatientSerializer(data=request.data)
        return handle_response(serializer)

@api_view(['GET', 'PUT', 'DELETE'])
def patient_detail(request, pk):
    """Получает, обновляет или удаляет пациента по его ID."""
    patient = get_object_or_404(Patient, pk=pk)
    if request.method == 'GET':
        serializer = PatientSerializer(patient)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = PatientSerializer(patient, data=request.data)
        return handle_response(serializer, patient)
    elif request.method == 'DELETE':
        patient.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def procedure_list(request):
    """Получает список всех процедур или создает новую процедуру."""
    if request.method == 'GET':
        procedures = Procedure.objects.all()
        serializer = ProcedureSerializer(procedures, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ProcedureSerializer(data=request.data)
        return handle_response(serializer)

@api_view(['GET', 'PUT', 'DELETE'])
def procedure_detail(request, pk):
    """Получает, обновляет или удаляет процедуру по ее ID."""
    procedure = get_object_or_404(Procedure, pk=pk)
    if request.method == 'GET':
        serializer = ProcedureSerializer(procedure)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = ProcedureSerializer(procedure, data=request.data)
        return handle_response(serializer, procedure)
    elif request.method == 'DELETE':
        procedure.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def doctors_by_specialization(request, specialization_id):
    """Получает список врачей по специальности."""
    doctors = Doctor.objects.filter(specialization_id=specialization_id)
    serializer = DoctorSerializer(doctors, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def patients_by_doctor(request, doctor_id):
    """Получает список пациентов по врачу."""
    patients = Patient.objects.filter(doctor_id=doctor_id)
    serializer = PatientSerializer(patients, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def specialization_list(request):
    """Получает список всех специальностей."""
    specializations = Specialization.objects.all()
    serializer = SpecializationSerializer(specializations, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def doctors_above_norm(request, year, month):
    """Получает список врачей, которые работали больше нормы в указанный месяц."""
    doctors = Doctor.objects.annotate(
        procedure_count=Count('procedures', filter=Procedure.objects.filter(date__year=year, date__month=month))
    ).filter(procedure_count__gte=2)  # Оставляем только тех, у кого >= 2 процедур

    serializer = DoctorSerializer(doctors, many=True)
    return Response(serializer.data)


class DoctorListView(APIView):
    """Получает список всех докторов или создает нового доктора."""

    def get(self, request):
        doctors = Doctor.objects.all()
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = DoctorSerializer(data=request.data)
        if serializer.is_valid():
            doctor = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class DoctorDetailView(SingleObjectMixin, APIView):
    """Получает, обновляет или удаляет доктора по его ID."""

    model = Doctor

    def get_object(self, pk):
        return get_object_or_404(Doctor, pk=pk)

    def get(self, request, pk):
        doctor = self.get_object(pk)
        serializer = DoctorSerializer(doctor)
        return Response(serializer.data)

    def put(self, request, pk):
        doctor = self.get_object(pk)
        serializer = DoctorSerializer(doctor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        doctor = self.get_object(pk)
        doctor.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# 10 lab

# from django.contrib.auth import login, authenticate
# from django.contrib.auth.forms import UserCreationForm
# from django.shortcuts import render, redirect
# from django.contrib.auth.decorators import login_required
# from .models import Patient

# def register(request):
#     if request.method == 'POST':
#         form = UserCreationForm(request.POST)
#         if form.is_valid():
#             user = form.save()
#             # Установите роль по умолчанию
#             user.role = 'user'
#             user.save()
#             login(request, user)
#             return redirect('patient-dashboard')  # перенаправление на личный кабинет
#     else:
#         form = UserCreationForm()
#     return render(request, 'registration/register.html', {'form': form})

# def login_view(request):
#     if request.method == 'POST':
#         username = request.POST['username']
#         password = request.POST['password']
#         user = authenticate(request, username=username, password=password)
#         if user is not None:
#             login(request, user)
#             return redirect('patient-dashboard')  # перенаправление на личный кабинет
#     return render(request, 'registration/login.html')

# @login_required
# def patient_dashboard(request):
#     # Получаем все процедуры пациента
#     patient = get_object_or_404(Patient, user=request.user)
#     procedures = patient.procedures.all()  # Предполагаем, что у вас есть связь между пользователем и пациентом
#     return render(request, 'patient_dashboard.html', {'procedures': procedures})
