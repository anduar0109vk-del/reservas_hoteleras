// src/components/GerentePanel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from './Navbar';

const GerentePanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    habitaciones: 0,
    reservasHoy: 0,
    ocupacion: 0,
    ingresosMes: 0
  });
  const [loading, setLoading] = useState(true);

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
      const [habitacionesRes, reservasRes] = await Promise.all([
        api.get('/habitaciones'),
        api.get('/gerente/reservas')
      ]);

      const habitaciones = normalizeList(habitacionesRes.data);
      const reservas = normalizeList(reservasRes.data);
      const hoy = new Date().toISOString().split('T')[0];
      const mesActual = new Date().getMonth();
      const añoActual = new Date().getFullYear();

      const ocupadas = habitaciones.filter(h => h.estado === 'OCUPADA').length;

      setStats({
        habitaciones: habitaciones.length,
        reservasHoy: reservas.filter(r => r.fechaEntrada === hoy && r.estado !== 'CANCELADA').length,
        ocupacion: habitaciones.length > 0 ? Math.round((ocupadas / habitaciones.length) * 100) : 0,
        ingresosMes: reservas
          .filter(r => {
            const fecha = new Date(r.fechaCreacion || r.fechaEntrada || Date.now());
            return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual && r.estado !== 'CANCELADA';
          })
          .reduce((total, r) => total + (Number(r.montoTotal) || 0), 0)
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      id: 'habitaciones',
      title: '🛏️ Habitaciones',
      description: 'Gestionar habitaciones y estados',
      color: '#ed8936',
      path: '/habitaciones',
      icon: '🛏️'
    },
    {
      id: 'reservas',
      title: '📋 Reservas',
      description: 'Ver todas las reservas',
      color: '#4299e1',
      path: '/todas-reservas',
      icon: '📋'
    },
    {
      id: 'promociones',
      title: '🎯 Promociones',
      description: 'Gestionar promociones',
      color: '#9f7aea',
      path: '/gerente/promociones',
      icon: '🎯'
    },
    {
      id: 'reportes',
      title: '📊 Reportes',
      description: 'Ver reportes de gestión',
      color: '#f56565',
      path: '/gerente/reportes',
      icon: '📊'
    }
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-spinner">Cargando estadísticas...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📊 Panel de Gerencia</h1>
          <p style={styles.subtitle}>Bienvenido, {user?.nombres}</p>
        </div>

        <div style={styles.stats}>
          <div className="card" style={styles.statCard}>
            <span style={styles.statNumber}>{stats.habitaciones}</span>
            <span style={styles.statLabel}>🛏️ Habitaciones</span>
          </div>
          <div className="card" style={styles.statCard}>
            <span style={styles.statNumber}>{stats.reservasHoy}</span>
            <span style={styles.statLabel}>📋 Reservas Hoy</span>
          </div>
          <div className="card" style={styles.statCard}>
            <span style={styles.statNumber}>{stats.ocupacion}%</span>
            <span style={styles.statLabel}>📊 Ocupación</span>
          </div>
          <div className="card" style={styles.statCard}>
            <span style={styles.statNumber}>S/{stats.ingresosMes}</span>
            <span style={styles.statLabel}>💰 Ingresos del Mes</span>
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
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

export default GerentePanel;