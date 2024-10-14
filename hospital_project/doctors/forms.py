# doctors/forms.py
from django import forms
from .models import Doctor, Patient

class DoctorForm(forms.ModelForm):
    class Meta:
        model = Doctor
        fields = ['name', 'experience_years', 'specialization']

    def clean_experience_years(self):
        value = self.cleaned_data.get('experience_years')
        if value < 0:
            raise forms.ValidationError("Стаж работы не может быть отрицательным.")
        return value

class PatientForm(forms.ModelForm):
    class Meta:
        model = Patient
        fields = ['name', 'age', 'doctor', 'procedu']  

