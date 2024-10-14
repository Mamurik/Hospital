// PatientModal.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import IPatient from "../../interfaces/IPatient";
import IDoctor from "../../interfaces/IDoctor";
import classes from "./PatientModal.module.css";

interface ModalProps {
  onClose: () => void;
  patient: IPatient | null;
  onSave: (patient: IPatient) => void;
}

const PatientModal: React.FC<ModalProps> = ({ onClose, patient, onSave }) => {
  const [name, setName] = useState(patient?.name || "");
  const [age, setAge] = useState(patient?.age || 0);
  const [doctorId, setDoctorId] = useState<number | "">(
    patient?.doctor?.id || ""
  );
  const [doctors, setDoctors] = useState<IDoctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get<IDoctor[]>(
          "http://localhost:8000/api/doctors/"
        );
        setDoctors(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке докторов:", error);
      }
    };

    fetchDoctors();

    if (patient) {
      setName(patient.name);
      setAge(patient.age);
      setDoctorId(patient.doctor?.id || "");
    }
  }, [patient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const patientData = {
        name,
        age,
        doctor: doctorId ? doctorId : null,
        procedures: [], // Обработка связанных процедур
      };

      let response;
      if (patient) {
        response = await axios.put<IPatient>(
          `http://localhost:8000/api/patients/${patient.id}/`,
          patientData
        );
      } else {
        response = await axios.post<IPatient>(
          "http://localhost:8000/api/patients/",
          patientData
        );
      }

      onSave(response.data);
    } catch (error) {
      console.error("Ошибка при сохранении пациента:", error);
    }
  };

  return (
    <div className={classes.modalOverlay}>
      <div className={classes.modalContent}>
        <h2>{patient ? "Редактировать пациента" : "Создать пациента"}</h2>
        <form onSubmit={handleSubmit}>
          <div className={classes.formGroup}>
            <label htmlFor="name">Имя:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="age">Возраст:</label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              required
            />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="doctor">Доктор:</label>
            <select
              id="doctor"
              value={doctorId}
              onChange={(e) => setDoctorId(Number(e.target.value))}
              required
            >
              <option value="">Выберите доктора</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>
          <div className={classes.modalButtons}>
            <button type="submit" className={classes.saveButton}>
              Сохранить
            </button>
            <button
              type="button"
              onClick={onClose}
              className={classes.cancelButton}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientModal;
