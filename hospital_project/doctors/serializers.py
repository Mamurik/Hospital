
from rest_framework import serializers
from .models import Doctor, Specialization, Patient, Procedure

class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = ['id', 'name']

class ProcedureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Procedure
        fields = ['id', 'name', 'date', 'doctor']

class DoctorSerializer(serializers.ModelSerializer):
    specialization = serializers.PrimaryKeyRelatedField(queryset=Specialization.objects.all()) # crud
    
    #specialization = SpecializationSerializer() # по спец
    procedures = ProcedureSerializer(many=True, read_only=True)

    class Meta:
        model = Doctor
        fields = ['id', 'name', 'specialization', 'experience_years', 'procedures']
         # Валидация стажа работы
    def validate_experience_years(self, value):
        if value < 0:
            raise serializers.ValidationError("Стаж работы не может быть отрицательным.")
        return value
class PatientSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer()
    procedures = ProcedureSerializer(many=True)

    class Meta: 
        model = Patient
        fields = ['id', 'name', 'age', 'doctor', 'procedures']

    def validate_age(self, value):
        if value < 0:
            raise serializers.ValidationError("Возраст не может быть отрицательным.")
        return value
