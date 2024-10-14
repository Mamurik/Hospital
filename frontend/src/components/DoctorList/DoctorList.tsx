import axios from "axios";
import React, { useEffect, useState } from "react";
import IDoctor from "../../interfaces/IDoctor";
import IProcedure from "../../interfaces/IProcedure";
import classes from "./DoctorList.module.css";
import { Link } from "react-router-dom";
import Modal from "../MyModal/Modal";

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get<IDoctor[]>(
          "http://localhost:8000/api/doctors/"
        );
        setDoctors(response.data);
      } catch (error) {
        setError("Ошибка при загрузке списка врачей");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const openModal = (doctor: IDoctor | null) => {
    setSelectedDoctor(doctor);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDoctor(null);
    setModalOpen(false);
  };

  const handleSave = async (savedDoctor: IDoctor) => {
    if (selectedDoctor) {
      // Обновление
      setDoctors((prevDoctors) =>
        prevDoctors.map((d) => (d.id === savedDoctor.id ? savedDoctor : d))
      );
    } else {
      // Добавление
      setDoctors((prevDoctors) => [...prevDoctors, savedDoctor]);
    }
    closeModal();
  };

  const handleDelete = async (doctorId: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/doctors/${doctorId}/`);
      setDoctors((prevDoctors) =>
        prevDoctors.filter((doc) => doc.id !== doctorId)
      );
    } catch (error) {
      console.error("Ошибка при удалении врача:", error);
      setError("Ошибка при удалении врача");
    }
  };

  if (loading) return <p className={classes.loading}>.</p>;
  if (error) return <p className={classes.error}>{error}</p>;

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Список врачей</h1>
      <button onClick={() => openModal(null)} className={classes.createButton}>
        Добавить врача
      </button>
      <ul className={classes.doctorList}>
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <li key={doctor.id} className={classes.doctorItem}>
              <strong>{doctor.name}</strong> - {doctor.experience_years} лет
              опыта - Специализация:{" "}
              {doctor.specialization
                ? doctor.specialization.name
                : "Нет специализации"}
              <h4>Процедуры:</h4>
              <ul>
                {doctor.procedures && doctor.procedures.length > 0 ? (
                  doctor.procedures.map((procedure: IProcedure) => (
                    <li key={procedure.id}>
                      {procedure.name} (Дата: {procedure.date})
                    </li>
                  ))
                ) : (
                  <li>Нет процедур</li>
                )}
              </ul>
              <button
                onClick={() => openModal(doctor)}
                className={classes.editButton}
              >
                Редактировать
              </button>
              <button
                onClick={() => handleDelete(doctor.id)}
                className={classes.deleteButton}
              >
                Удалить
              </button>
            </li>
          ))
        ) : (
          <li className={classes.noDoctors}>Нет доступных врачей.</li>
        )}
      </ul>

      <Link className={classes.link} to={"/patients"}>
        Список пациентов
      </Link>

      {modalOpen && (
        <Modal
          onClose={closeModal}
          doctor={selectedDoctor}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default DoctorList;
