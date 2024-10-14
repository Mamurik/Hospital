import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import IDoctor from "../../interfaces/IDoctor";
import ISpecialization from "../../interfaces/ISpecialization";
import classes from "./DoctorsBySpecialization.module.css";

// Компонент для отображения врачей по специализации
const DoctorsBySpecialization: React.FC = () => {
  const { specializationId } = useParams<{ specializationId: string }>();
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [specialization, setSpecialization] = useState<ISpecialization | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorsBySpecialization = async () => {
      try {
        const response = await axios.get<IDoctor[]>(
          `http://localhost:8000/api/doctors/specialization/${specializationId}/`
        );
        setDoctors(response.data);
        setSpecialization(response.data[0]?.specialization || null);
      } catch (error) {
        setError("Ошибка при загрузке врачей по специализации");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorsBySpecialization();
  }, [specializationId]);

  if (loading) return <p className={classes.loading}>Загрузка...</p>;
  if (error) return <p className={classes.error}>{error}</p>;

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>
        Врачи по специализации: {specialization?.name || "Неизвестно"}
      </h1>
      <ul className={classes.doctorList}>
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <li key={doctor.id} className={classes.doctorItem}>
              {doctor.name} - {doctor.experience_years} лет опыта
            </li>
          ))
        ) : (
          <li className={classes.noDoctors}>
            Нет врачей в этой специализации.
          </li>
        )}
      </ul>
      <Link to="/" className={classes.backLink}>
        Назад к списку врачей
      </Link>
    </div>
  );
};

export default DoctorsBySpecialization;
