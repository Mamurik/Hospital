import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import IDoctor from "../../interfaces/IDoctor";
import styles from "./DoctorsAboveNorm.module.css"; // Импорт CSS-модуля

const DoctorsAboveNorm: React.FC = () => {
  const { year, month } = useParams<{ year: string; month: string }>();
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorsAboveNorm = async () => {
      try {
        setLoading(true);
        const response = await axios.get<IDoctor[]>(
          `http://localhost:8000/api/doctors/above-norm/${year}/${month}/`
        );
        setDoctors(response.data);
      } catch (error) {
        setError("Ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorsAboveNorm();
  }, [year, month]);

  if (loading) return <p className={styles.loading}>Загрузка...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Доктора, которые выполнили более 2 процедур
      </h1>
      <ul className={styles.list}>
        {doctors.map((doctor) => (
          <li key={doctor.id} className={styles.listItem}>
            {doctor.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorsAboveNorm;
