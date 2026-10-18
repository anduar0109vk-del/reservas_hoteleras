import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logoCasaAndina from '../assets/casa-andina-logo.png';

const NavigationSection = ({ title, links }) => (
  <section className="hotel-nav-section" aria-label={title}>
    <h2 className="hotel-nav-section__title">{title}</h2>
    <div className="hotel-nav-grid">
      {links.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `hotel-nav-card${isActive ? ' is-active' : ''}`}
        >
          <span className="hotel-nav-card__icon" aria-hidden="true">{icon}</span>
          <span className="hotel-nav-card__label">{label}</span>
        </NavLink>
      ))}
    </div>
  </section>
);

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

  const primaryLinks = [
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/habitaciones', icon: '🛏️', label: 'Habitaciones' },
    { to: '/mis-reservas', icon: '📋', label: 'Mis reservas' },
    { to: '/nueva-reserva', icon: '➕', label: 'Nueva reserva' },
    { to: '/servicios', icon: '🛎️', label: 'Servicios' },
    { to: '/perfil', icon: '👤', label: 'Perfil' },
    { to: '/reclamos', icon: '📖', label: 'Reclamos' },
    { to: '/manual', icon: '📘', label: 'Manual de usuario' },
  ];

  const operationLinks = [];
  if (isRecepcionista) {
    operationLinks.push(
      { to: '/todas-reservas', icon: '📋', label: 'Todas las reservas' },
      { to: '/recepcion', icon: '🏨', label: 'Recepción' }
    );
  }
  if (isGerente) {
    operationLinks.push({ to: '/gerente', icon: '📊', label: 'Gerencia' });
  }

  const adminLinks = isAdmin
    ? [
        { to: '/admin', icon: '🔧', label: 'Panel de administración' },
        { to: '/admin/usuarios', icon: '👥', label: 'Usuarios' },
        { to: '/admin/habitaciones', icon: '🛏️', label: 'Gestión de habitaciones' },
        { to: '/admin/promociones', icon: '🎯', label: 'Promociones' },
        { to: '/admin/servicios', icon: '🛎️', label: 'Gestión de servicios' },
        { to: '/admin/reportes', icon: '📊', label: 'Reportes' },
      ]
    : [];

  return (
    <nav className="hotel-navbar">
      <div className="hotel-navbar__inner">
        <div className="hotel-navbar__header">
          <NavLink to="/dashboard" className="hotel-navbar__brand" aria-label="Ir al dashboard">
            <img src={logoCasaAndina} alt="Casa Andina Hoteles" />
          </NavLink>
          <div className="hotel-navbar__actions">
            <span className="hotel-navbar__user">👤 {user?.nombres} · {user?.rol}</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="hotel-navbar__theme"
              aria-label="Cambiar tema"
            >
              {theme === 'light' ? '🌙 Oscuro' : '☀️ Claro'}
            </button>
            <button type="button" onClick={handleLogout} className="hotel-navbar__logout">
              Cerrar sesión
            </button>
          </div>
        </div>

        <NavigationSection title="Navegación principal" links={primaryLinks} />
        {operationLinks.length > 0 && (
          <NavigationSection title="Operaciones y supervisión" links={operationLinks} />
        )}
        {adminLinks.length > 0 && (
          <NavigationSection title="Administración" links={adminLinks} />
        )}
      </div>
    </nav>
  );
};

export default Navbar;