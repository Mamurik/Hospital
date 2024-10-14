// PatientList.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import IPatient from "../../interfaces/IPatient";
import { Link } from "react-router-dom";
import classes from "./PatientList.module.css";
import PatientModal from "./PatientModal"; // Добавляем модалку

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/patients/");
        setPatients(response.data);
      } catch (err) {
        console.error("Ошибка при загрузке пациентов:", err);
        setError("Ошибка при загрузке пациентов");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const openModal = (patient: IPatient | null) => {
    setSelectedPatient(patient);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPatient(null);
    setModalOpen(false);
  };

  const handleSave = async (savedPatient: IPatient) => {
    try {
      if (selectedPatient) {
        const response = await axios.put(
          `http://localhost:8000/api/patients/${savedPatient.id}/`,
          savedPatient
        );
        setPatients((prevPatients) =>
          prevPatients.map((p) =>
            p.id === response.data.id ? response.data : p
          )
        );
      } else {
        const response = await axios.post(
          `http://localhost:8000/api/patients/`,
          savedPatient
        );
        setPatients((prevPatients) => [...prevPatients, response.data]);
      }
    } catch (error) {
      console.error("Ошибка при сохранении пациента:", error);
      setError("Ошибка при сохранении пациента");
    } finally {
      closeModal();
    }
  };

  const handleDelete = async (patientId: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/patients/${patientId}/`);
      setPatients((prevPatients) =>
        prevPatients.filter((p) => p.id !== patientId)
      );
    } catch (err) {
      console.error("Ошибка при удалении пациента:", err);
    }
  };

  if (loading) {
    return <div className={classes.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={classes.error}>{error}</div>;
  }

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>Список пациентов</h2>
      {/* <button onClick={() => openModal(null)} className={classes.createButton}>
        Добавить пациента
      </button> */}
      <ul className={classes.patientList}>
        {patients.map((patient) => (
          <li key={patient.id} className={classes.patientItem}>
            <strong className={classes.patientLabel}>Имя:</strong>{" "}
            {patient.name},{" "}
            <strong className={classes.patientLabel}>Возраст:</strong>{" "}
            {patient.age},{" "}
            <h4 className={classes.procedureTitle}>Процедуры:</h4>
            {patient.procedures && patient.procedures.length > 0 ? (
              <ul className={classes.procedureList}>
                {patient.procedures.map((procedure) => (
                  <li key={procedure.id} className={classes.procedureItem}>
                    <strong>{procedure.name}</strong> (Дата: {procedure.date})
                  </li>
                ))}
              </ul>
            ) : (
              <p>Нет процедур для этого пациента.</p>
            )}
            {/* <button
              onClick={() => openModal(patient)}
              className={classes.editButton}
            >
              Редактировать
            </button> */}
            <button
              onClick={() => handleDelete(patient.id)}
              className={classes.deleteButton}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
      <Link className={classes.linka} to={"/"}>
        на главную
      </Link>

      {modalOpen && (
        <PatientModal
          onClose={closeModal}
          patient={selectedPatient}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default PatientList;
