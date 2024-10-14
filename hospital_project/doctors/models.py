from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
class Specialization(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Doctor(models.Model):
    name = models.CharField(max_length=100)
    experience_years = models.IntegerField()
    specialization = models.ForeignKey(Specialization, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Patient(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    
    # Связь с врачом
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='patients')

    # Связь с множеством процедур
    procedures = models.ManyToManyField('Procedure', related_name='patients', blank=True)

    def __str__(self):
        return self.name

class Procedure(models.Model):
    name = models.CharField(max_length=100)
    date = models.DateField()
    
    # Связь с врачом, который выполнил процедуру
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='procedures', null=True)

    def __str__(self):
        return self.name




# from django.contrib.auth.models import AbstractUser

# class CustomUser(AbstractUser):
#     ROLE_CHOICES = [
#         ('admin', 'Администратор'),
#         ('user', 'Пользователь'),
#     ]
#     role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
