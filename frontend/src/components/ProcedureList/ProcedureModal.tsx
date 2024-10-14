// src/components/MyModal/ProcedureModal.tsx
import React, { useState, useEffect } from "react";
import IProcedure from "../../interfaces/IProcedure";
import IDoctor from "../../interfaces/IDoctor";
import IPatient from "../../interfaces/IPatient";
import classes from "./ProcedureModal.module.css";

interface ModalProps {
  onClose: () => void;
  procedure: IProcedure | null;
  doctors: IDoctor[];
  patients: IPatient[];
  onSave: (procedure: IProcedure) => Promise<void>; // Обновлено для обработки промисов
}

const ProcedureModal: React.FC<ModalProps> = ({
  onClose,
  procedure,
  doctors,
  patients,
  onSave,
}) => {
  const [name, setName] = useState(procedure?.name || "");
  const [date, setDate] = useState(procedure?.date || "");
  const [doctorId, setDoctorId] = useState(
    procedure?.doctor || doctors[0]?.id || 0
  );
  const [patientId, setPatientId] = useState(
    procedure?.patient || patients[0]?.id || 0
  );

  const handleSubmit = async () => {
    const updatedProcedure: IProcedure = {
      id: procedure?.id || 0,
      name,
      date,
      doctor: doctorId,
      patient: patientId,
    };

    await onSave(updatedProcedure); // Дожидаемся завершения операции
  };

  useEffect(() => {
    if (procedure) {
      setName(procedure.name);
      setDate(procedure.date);
      setDoctorId(procedure.doctor);
      setPatientId(procedure.patient);
    }
  }, [procedure]);

  return (
    <div className={classes.modal}>
      <h2>{procedure ? "Редактировать процедуру" : "Добавить процедуру"}</h2>
      <label>
        Название процедуры:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Дата процедуры:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>
      <label>
        Врач:
        <select
          value={doctorId}
          onChange={(e) => setDoctorId(Number(e.target.value))}
        >
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Пациент:
        <select
          value={patientId}
          onChange={(e) => setPatientId(Number(e.target.value))}
        >
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleSubmit}>Сохранить</button>
      <button onClick={onClose}>Отмена</button>
    </div>
  );
};

export default ProcedureModal;
