// src/components/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from './Navbar';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    usuarios: 0,
    habitaciones: 0,
    reservas: 0,
    ingresos: 0
  });

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const normalizeList = (value) => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.data)) return value.data;
    if (Array.isArray(value?.content)) return value.content;
    if (value && typeof value === 'object') {
      const nested = Object.values(value).find(Array.isArray);
      return Array.isArray(nested) ? nested : [];
    }
    return [];
  };

  const cargarEstadisticas = async () => {
    try {
      const [usuariosRes, habitacionesRes, reservasRes] = await Promise.all([
        api.get('/admin/usuarios'),
        api.get('/habitaciones'),
        api.get('/admin/reservas')
      ]);

      const usuarios = normalizeList(usuariosRes.data);
      const habitaciones = normalizeList(habitacionesRes.data);
      const reservas = normalizeList(reservasRes.data);

      setStats({
        usuarios: usuarios.length,
        habitaciones: habitaciones.length,
        reservas: reservas.length,
        ingresos: reservas.reduce((total, r) => total + (Number(r.montoTotal) || 0), 0)
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const cards = [
    {
      id: 'usuarios',
      title: '👥 Usuarios',
      description: 'Gestionar todos los usuarios del sistema',
      color: '#4299e1',
      path: '/admin/usuarios',
      icon: '👥'
    },
    {
      id: 'empleados',
      title: '👔 Empleados',
      description: 'Gestionar empleados del hotel',
      color: '#48bb78',
      path: '/admin/empleados',
      icon: '👔'
    },
    {
      id: 'habitaciones',
      title: '🛏️ Habitaciones',
      description: 'Gestionar habitaciones y tipos',
      color: '#ed8936',
      path: '/admin/habitaciones',
      icon: '🛏️'
    },
    {
      id: 'promociones',
      title: '🎯 Promociones',
      description: 'Gestionar promociones y descuentos',
      color: '#9f7aea',
      path: '/admin/promociones',
      icon: '🎯'
    },
    {
      id: 'servicios',
      title: '🛎️ Servicios',
      description: 'Gestionar servicios a la habitación',
      color: '#38b2ac',
      path: '/admin/servicios',
      icon: '🛎️'
    },
    {
      id: 'reportes',
      title: '📊 Reportes',
      description: 'Generar reportes y estadísticas',
      color: '#f56565',
      path: '/admin/reportes',
      icon: '📊'
    }
  ];

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🔧 Panel de Administración</h1>
          <p style={styles.subtitle}>Bienvenido, {user?.nombres}</p>
        </div>

        <div style={styles.stats}>
          <div className="card" style={styles.statCard}>
            <span style={styles.statNumber}>{stats.usuarios}</span>
            <span style={styles.statLabel}>👥 Usuarios</span>
          </div>
          <div className="card" style={styles.statCard}>
            <span style={styles.statNumber}>{stats.habitaciones}</span>
            <span style={styles.statLabel}>🛏️ Habitaciones</span>
          </div>
          <div className="card" style={styles.statCard}>
            <span style={styles.statNumber}>{stats.reservas}</span>
            <span style={styles.statLabel}>📋 Reservas</span>
          </div>
          <div className="card" style={styles.statCard}>
            <span style={styles.statNumber}>S/{stats.ingresos}</span>
            <span style={styles.statLabel}>💰 Ingresos</span>
          </div>
        </div>

        <div style={styles.grid}>
          {cards.map((card) => (
            <div
              key={card.id}
              className="card"
              style={{ ...styles.card, borderTop: `4px solid ${card.color}` }}
              onClick={() => navigate(card.path)}
            >
              <div style={styles.cardIcon}>{card.icon}</div>
              <h3 style={styles.cardTitle}>{card.title}</h3>
              <p style={styles.cardDescription}>{card.description}</p>
              <button style={{ ...styles.cardButton, backgroundColor: card.color }}>
                Gestionar →
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '32px',
    color: '#2d3748',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#4a5568',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  statCard: {
    textAlign: 'center',
    padding: '20px',
  },
  statNumber: {
    display: 'block',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2b6cb0',
  },
  statLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#718096',
    marginTop: '4px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  card: {
    padding: '24px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    textAlign: 'center',
  },
  cardIcon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  cardTitle: {
    fontSize: '18px',
    color: '#2d3748',
    marginBottom: '8px',
  },
  cardDescription: {
    fontSize: '14px',
    color: '#4a5568',
    marginBottom: '16px',
  },
  cardButton: {
    padding: '8px 24px',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default AdminPanel;