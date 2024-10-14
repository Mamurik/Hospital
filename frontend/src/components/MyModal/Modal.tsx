import React, { useState, useEffect } from "react";
import axios from "axios";
import IDoctor from "../../interfaces/IDoctor";
import classes from "./Modal.module.css";
import ISpecialization from "../../interfaces/ISpecialization";

interface ModalProps {
  onClose: () => void;
  doctor: IDoctor | null;
  onSave: (doctor: IDoctor) => void;
}

const Modal: React.FC<ModalProps> = ({ onClose, doctor, onSave }) => {
  const [name, setName] = useState(doctor?.name || "");
  const [experience_years, setExperienceYears] = useState(
    doctor?.experience_years || 0
  );
  const [specialization, setSpecialization] = useState<number | "">(
    doctor?.specialization ? doctor.specialization.id : "" // Получаем id специализации
  );
  const [specializations, setSpecializations] = useState<ISpecialization[]>([]);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get<ISpecialization[]>(
          "http://localhost:8000/api/specializations/"
        );
        setSpecializations(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке специализаций:", error);
      }
    };

    fetchSpecializations();

    if (doctor) {
      setName(doctor.name);
      setExperienceYears(doctor.experience_years);
      setSpecialization(doctor.specialization ? doctor.specialization.id : "");
    }
  }, [doctor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const doctorData = {
      name,
      experience_years,
      specialization,
    };

    try {
      let response;
      if (doctor) {
        // Обновление
        response = await axios.put<IDoctor>(
          `http://localhost:8000/api/doctors/${doctor.id}/`,
          doctorData
        );
      } else {
        // Создание нового
        response = await axios.post<IDoctor>(
          "http://localhost:8000/api/doctors/",
          doctorData
        );
      }

      onSave(response.data);
      onClose(); // Закрытие модального окна после успешного сохранения
    } catch (error) {
      console.error("Ошибка при сохранении врача:", error);
      // Дополнительная обработка ошибки, если необходимо
    }
  };

  return (
    <div className={classes.modal}>
      <div className={classes.modalContent}>
        <h2>{doctor ? "Редактировать врача" : "Создать врача"}</h2>
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
            <label htmlFor="experience_years">Опыт (лет):</label>
            <input
              id="experience_years"
              type="number"
              value={experience_years}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              required
            />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="specialization">Специализация:</label>
            <select
              id="specialization"
              value={specialization}
              onChange={(e) => setSpecialization(Number(e.target.value))}
              required
            >
              <option value="">Выберите специализацию</option>
              {specializations.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name}
                </option>
              ))}
            </select>
          </div>
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
        </form>
      </div>
    </div>
  );
};

export default Modal;
