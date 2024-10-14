import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DoctorList from "./components/DoctorList/DoctorList";
import DoctorsBySpecialization from "./components/DoctorList/DoctorsBySpecialization";
import PatientList from "./components/PatienList/PatientList";
import ProcedureList from "./components/ProcedureList/ProcedureList";
import MainPage from "./pages/MainPage";
import DoctorsAboveNorm from "./pages/AgregatePage/DoctorsAboveNorm"; // Импортируем компонент
import Login from "./components/login/Login";
import Register from "./components/Register/Register";
import Dashboard from "./components/Dashboard/Dashboard";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route
          path="/specialization/:specializationId"
          element={<DoctorsBySpecialization />}
        />
        <Route path="/patients" element={<PatientList />} />
        <Route path="/procedures" element={<ProcedureList />} />
        <Route
          path="/doctors/above-norm/:year/:month"
          element={<DoctorsAboveNorm />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
