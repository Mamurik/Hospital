// src/components/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { getUserData } from "../../api";

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        setUser(response.data);
      } catch (err) {
        setError("Ошибка при получении данных пользователя");
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      {error && <p>{error}</p>}
      {user ? <h1>Добро пожаловать, {user.username}!</h1> : <p>Загрузка...</p>}
    </div>
  );
};

export default Dashboard;
