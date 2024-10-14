import React from "react";
import { Link } from "react-router-dom";
import styles from "./MainPage.module.css"; // Импорт стилей

const MainPage: React.FC = () => {
  return (
    <div className={styles.mainPage}>
      <h1 className={styles.title}>
        Добро пожаловать в медицинское приложение
      </h1>
      <nav>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link className={styles.navLink} to="/doctors">
              Список врачей
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link className={styles.navLink} to="/patients">
              Список пациентов
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link className={styles.navLink} to="/procedures">
              Список процедур
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link className={styles.navLink} to="/specialization/1">
              Врачи по специализации
            </Link>{" "}
            {/* Замените 1 на нужный ID специализации */}
          </li>
          <li className={styles.navItem}>
            <Link className={styles.navLink} to="/doctors/above-norm/2023/09">
              Врачи с перегрузкой
            </Link>{" "}
            {/* Ссылка на агрегатную функцию */}
          </li>
          <li className={styles.navItem}>
            <Link className={styles.navLink} to="/dashboard">
              Личный кабинет
            </Link>{" "}
            {/* Ссылка на агрегатную функцию */}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MainPage;
