// src/components/ProcedureList/ProcedureList.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import IProcedure from "../../interfaces/IProcedure";
import IDoctor from "../../interfaces/IDoctor";
import IPatient from "../../interfaces/IPatient";
import ProcedureModal from "./ProcedureModal";
import classes from "./ProcedureList.module.css";
import { Link } from "react-router-dom";

const ProcedureList: React.FC = () => {
  const [procedures, setProcedures] = useState<IProcedure[]>([]);
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<IProcedure | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [procedureResponse, doctorResponse, patientResponse] =
          await Promise.all([
            axios.get<IProcedure[]>("http://localhost:8000/api/procedures/"),
            axios.get<IDoctor[]>("http://localhost:8000/api/doctors/"),
            axios.get<IPatient[]>("http://localhost:8000/api/patients/"),
          ]);
        setProcedures(procedureResponse.data);
        setDoctors(doctorResponse.data);
        setPatients(patientResponse.data);
      } catch (error) {
        setError("Ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (procedure: IProcedure | null) => {
    setSelectedProcedure(procedure);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProcedure(null);
    setModalOpen(false);
  };

  const handleSave = async (savedProcedure: IProcedure) => {
    try {
      if (selectedProcedure) {
        // Обновление существующей процедуры
        const response = await axios.put(
          `http://localhost:8000/api/procedures/${savedProcedure.id}/`,
          savedProcedure
        );
        setProcedures((prevProcedures) =>
          prevProcedures.map((p) =>
            p.id === response.data.id ? response.data : p
          )
        );
      } else {
        // Добавление новой процедуры
        const response = await axios.post(
          "http://localhost:8000/api/procedures/",
          savedProcedure
        );
        setProcedures((prevProcedures) => [...prevProcedures, response.data]);
      }
      closeModal();
    } catch (error) {
      console.error("Ошибка при сохранении процедуры:", error);
    }
  };

  const handleDelete = async (procedureId: number) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/procedures/${procedureId}/`
      );
      setProcedures((prevProcedures) =>
        prevProcedures.filter((p) => p.id !== procedureId)
      );
    } catch (err) {
      console.error("Ошибка при удалении процедуры:", err);
    }
  };

  if (loading) return <p className={classes.loading}>Загрузка...</p>;
  if (error) return <p className={classes.error}>{error}</p>;

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Список процедур</h1>
      <button onClick={() => openModal(null)} className={classes.createButton}>
        Добавить процедуру
      </button>
      <ul className={classes.procedureList}>
        {procedures.length > 0 ? (
          procedures.map((procedure) => {
            const doctor = doctors.find((d) => d.id === procedure.doctor);
            const patient = patients.find((p) => p.id === procedure.patient);

            return (
              <li key={procedure.id} className={classes.procedureItem}>
                <strong>{procedure.name}</strong> - {procedure.date} <br />
                Врач: {doctor?.name || "Неизвестно"} <br />
                <button
                  onClick={() => openModal(procedure)}
                  className={classes.editButton}
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(procedure.id)}
                  className={classes.deleteButton}
                >
                  Удалить
                </button>
              </li>
            );
          })
        ) : (
          <li className={classes.noProcedures}>Нет доступных процедур.</li>
        )}
      </ul>

      {modalOpen && (
        <ProcedureModal
          onClose={closeModal}
          procedure={selectedProcedure}
          doctors={doctors}
          patients={patients}
          onSave={handleSave}
        />
      )}
      <Link className={classes.link} to={"/"}>
        На главную
      </Link>
    </div>
  );
};

export default ProcedureList;
