import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyAppointments from "./pages/MyAppointments";
import Admin from "./pages/Admin";
import AdminAppointments from "./pages/AdminAppointments";
import AdminDoctors from "./pages/AdminDoctors";

import ProtectedRoute from "./components/ProtectedRoute";
import Doctors from "./Doctors";

function App() {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      <Routes>

        {/* DEFAULT LOGIN PAGE */}
        <Route path="/" element={<Login />} />

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER HOME */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* ADMIN EXTRA */}
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute role="admin">
              <AdminAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute role="admin">
              <AdminDoctors />
            </ProtectedRoute>
          }
        />

        {/* OTHER */}
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/my-appointments" element={<MyAppointments />} />

        {/* FALLBACK */}
        <Route path="*" element={<Login />} />

      </Routes>
    </>
  );
}

export default App;