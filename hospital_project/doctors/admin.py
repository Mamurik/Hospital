from django.contrib import admin
from .models import Doctor, Specialization,Patient,Procedure

admin.site.register(Doctor)
admin.site.register(Specialization)
admin.site.register(Patient)
admin.site.register(Procedure)

