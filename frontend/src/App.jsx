// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Habitaciones from './components/Habitaciones';
import NuevaReserva from './components/NuevaReserva';
import MisReservas from './components/MisReservas';
import Servicios from './components/Servicios';
import Perfil from './components/Perfil';
import Pagos from './components/Pagos';
import TodasReservas from './components/TodasReservas';
import AdminPanel from './components/AdminPanel';
import AdminUsuarios from './components/AdminUsuarios';
import AdminHabitaciones from './components/AdminHabitaciones';
import AdminPromociones from './components/AdminPromociones';
import AdminServicios from './components/AdminServicios';
import AdminReportes from './components/AdminReportes';
import RecepcionPanel from './components/RecepcionPanel';
import GerentePanel from './components/GerentePanel';
import CheckIn from './components/CheckIn';
import CheckOut from './components/CheckOut';
import GerenteReportes from './components/GerenteReportes';
import AgregarServicios from './components/AgregarServicios';
import PrivateRoute from './components/PrivateRoute';
import { ThemeProvider } from './context/ThemeContext';
import Reclamaciones from './components/Reclamaciones';
import ManualUsuario from './components/ManualUsuario';
import Facturacion from './components/Facturacion';
import ClientChatbot from './components/ClientChatbot';

function RootRedirect() {
  const { user, loading, getDefaultRoute } = useAuth();

  if (loading) {
    return <div className="loading-spinner">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getDefaultRoute(user.rol)} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RootRedirect />} />
          <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['ADMIN', 'GERENTE', 'RECEPCIONISTA', 'CLIENTE']}>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/habitaciones" element={
            <PrivateRoute allowedRoles={['ADMIN', 'GERENTE', 'RECEPCIONISTA', 'CLIENTE']}>
              <Habitaciones />
            </PrivateRoute>
          } />
          <Route path="/nueva-reserva" element={
            <PrivateRoute allowedRoles={['ADMIN', 'GERENTE', 'RECEPCIONISTA', 'CLIENTE']}>
              <NuevaReserva />
            </PrivateRoute>
          } />
          <Route path="/mis-reservas" element={
            <PrivateRoute allowedRoles={['CLIENTE', 'ADMIN', 'GERENTE', 'RECEPCIONISTA']}>
              <MisReservas />
            </PrivateRoute>
          } />
          <Route path="/servicios" element={
            <PrivateRoute allowedRoles={['ADMIN', 'GERENTE', 'RECEPCIONISTA', 'CLIENTE']}>
              <Servicios />
            </PrivateRoute>
          } />
          <Route path="/reservas/:reservaId/servicios" element={
            <PrivateRoute allowedRoles={['ADMIN', 'GERENTE', 'RECEPCIONISTA', 'CLIENTE']}>
              <AgregarServicios />
            </PrivateRoute>
          } />
          <Route path="/perfil" element={
            <PrivateRoute allowedRoles={['ADMIN', 'GERENTE', 'RECEPCIONISTA', 'CLIENTE']}>
              <Perfil />
            </PrivateRoute>
          } />
          <Route path="/reclamos" element={
            <PrivateRoute allowedRoles={['ADMIN', 'GERENTE', 'RECEPCIONISTA', 'CLIENTE']}>
              <Reclamaciones />
            </PrivateRoute>
          } />
          <Route path="/manual" element={
            <PrivateRoute allowedRoles={['ADMIN', 'GERENTE', 'RECEPCIONISTA', 'CLIENTE']}>
              <ManualUsuario />
            </PrivateRoute>
          } />
          <Route path="/pagos/:reservaId" element={
            <PrivateRoute allowedRoles={['ADMIN', 'GERENTE', 'RECEPCIONISTA', 'CLIENTE']}>
              <Pagos />
            </PrivateRoute>
          } />
          <Route path="/facturacion/:reservaId" element={
            <PrivateRoute allowedRoles={['ADMIN', 'GERENTE', 'RECEPCIONISTA', 'CLIENTE']}>
              <Facturacion />
            </PrivateRoute>
          } />
          <Route path="/todas-reservas" element={
            <PrivateRoute allowedRoles={['ADMIN', 'GERENTE', 'RECEPCIONISTA']}>
              <TodasReservas />
            </PrivateRoute>
          } />
          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminPanel />
            </PrivateRoute>
          } />
          <Route path="/admin/usuarios" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminUsuarios />
            </PrivateRoute>
          } />
          <Route path="/admin/habitaciones" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminHabitaciones />
            </PrivateRoute>
          } />
          <Route path="/admin/promociones" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminPromociones />
            </PrivateRoute>
          } />
          <Route path="/admin/servicios" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminServicios />
            </PrivateRoute>
          } />
          <Route path="/admin/reportes" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminReportes />
            </PrivateRoute>
          } />
          <Route path="/recepcion" element={
            <PrivateRoute allowedRoles={['ADMIN', 'GERENTE', 'RECEPCIONISTA']}>
              <RecepcionPanel />
            </PrivateRoute>
          } />
          <Route path="/recepcion/checkin" element={
            <PrivateRoute allowedRoles={['ADMIN', 'GERENTE', 'RECEPCIONISTA']}>
              <CheckIn />
            </PrivateRoute>
          } />
          <Route path="/recepcion/checkout" element={
            <PrivateRoute allowedRoles={['ADMIN', 'GERENTE', 'RECEPCIONISTA']}>
              <CheckOut />
            </PrivateRoute>
          } />
          <Route path="/gerente" element={
            <PrivateRoute allowedRoles={['ADMIN', 'GERENTE']}>
              <GerentePanel />
            </PrivateRoute>
          } />
          <Route path="/gerente/reportes" element={
            <PrivateRoute allowedRoles={['ADMIN', 'GERENTE']}>
              <GerenteReportes />
            </PrivateRoute>
          } />
          <Route path="/gerente/promociones" element={
            <PrivateRoute allowedRoles={['ADMIN', 'GERENTE']}>
              <AdminPromociones />
            </PrivateRoute>
          } />
          </Routes>
          <ClientChatbot />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;