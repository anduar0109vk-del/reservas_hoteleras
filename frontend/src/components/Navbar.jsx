import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logoCasaAndina from '../assets/casa-andina-logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.rol === 'ADMIN';
  const isGerente = user?.rol === 'GERENTE' || isAdmin;
  const isRecepcionista = user?.rol === 'RECEPCIONISTA' || isGerente;

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/dashboard" style={styles.brand}>
          <img src={logoCasaAndina} alt="Casa Andina Hoteles" style={styles.logo} />
        </Link>
        <div style={styles.navLinks}>
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/habitaciones" style={styles.link}>Habitaciones</Link>
          <Link to="/mis-reservas" style={styles.link}>Mis Reservas</Link>
          <Link to="/nueva-reserva" style={styles.link}>Nueva Reserva</Link>
          <Link to="/servicios" style={styles.link}>Servicios</Link>
          <Link to="/perfil" style={styles.link}>Perfil</Link>
          <Link to="/reclamos" style={styles.link}>📖 Reclamos</Link>
          <Link to="/manual" style={styles.link}>📘 Manual</Link>
          
          {/* RECEPCIONISTA y superiores */}
          {(isAdmin || isGerente || isRecepcionista) && (
            <>
              <Link to="/todas-reservas" style={styles.link}>📋 Todas Reservas</Link>
              <Link to="/recepcion" style={styles.link}>🏨 Recepción</Link>
            </>
          )}
          
          {/* GERENTE y ADMIN */}
          {(isAdmin || isGerente) && (
            <Link to="/gerente" style={styles.link}>📊 Gerencia</Link>
          )}
          
          {/* Solo ADMIN */}
          {isAdmin && (
            <>
              <Link to="/admin" style={styles.link}>🔧 Admin Panel</Link>
              <Link to="/admin/usuarios" style={styles.link}>👥 Usuarios</Link>
              <Link to="/admin/habitaciones" style={styles.link}>🛏️ Habitaciones</Link>
              <Link to="/admin/promociones" style={styles.link}>🎯 Promociones</Link>
              <Link to="/admin/servicios" style={styles.link}>🛎️ Servicios</Link>
              <Link to="/admin/reportes" style={styles.link}>📊 Reportes</Link>
            </>
          )}
          
          <span style={styles.userInfo}>👤 {user?.nombres} ({user?.rol})</span>
          <button onClick={toggleTheme} style={styles.themeBtn} aria-label="Cambiar tema">
            {theme === 'light' ? '🌙 Oscuro' : '☀️ Claro'}
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#1a365d',
    color: 'white',
    padding: '12px 0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  logo: {
    width: '140px',
    height: '42px',
    objectFit: 'contain',
    objectPosition: 'center',
    backgroundColor: '#1a365d',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
    padding: '6px 12px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  userInfo: {
    fontSize: '14px',
    color: '#bee3f8',
    padding: '6px 12px',
  },
  logoutBtn: {
    backgroundColor: '#e53e3e',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  themeBtn: {
    backgroundColor: '#2c5282',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    border: '1px solid #90cdf4',
    cursor: 'pointer',
  },
};

export default Navbar;