// src/components/RecepcionPanel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from './Navbar';

const RecepcionPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    reservasPendientes: 0,
    reservasConfirmadas: 0,
    checkIns: 0,
    checkOuts: 0
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
      const response = await api.get('/recepcion/reservas');
      const reservas = normalizeList(response.data);
      const hoy = new Date().toISOString().split('T')[0];

      setStats({
        reservasPendientes: reservas.filter(r => r.estado === 'PENDIENTE').length,
        reservasConfirmadas: reservas.filter(r => r.estado === 'CONFIRMADA').length,
        checkIns: reservas.filter(r => r.estado === 'CONFIRMADA' && r.fechaEntrada <= hoy).length,
        checkOuts: reservas.filter(r => r.estado === 'CONFIRMADA' && r.fechaSalida <= hoy).length
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      id: 'reservas',
      title: '📋 Reservas',
      description: 'Gestionar todas las reservas',
      color: '#4299e1',
      path: '/todas-reservas',
      icon: '📋'
    },
    {
      id: 'checkin',
      title: '🏨 Check-in',
      description: 'Registrar llegada de huéspedes',
      color: '#48bb78',
      path: '/recepcion/checkin',
      icon: '🏨'
    },
    {
      id: 'checkout',
      title: '🚪 Check-out',
      description: 'Registrar salida de huéspedes',
      color: '#ed8936',
      path: '/recepcion/checkout',
      icon: '🚪'
    },
    {
      id: 'servicios',
      title: '🛎️ Servicios',
      description: 'Gestionar servicios a la habitación',
      color: '#9f7aea',
      path: '/servicios',
      icon: '🛎️'
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
          <h1 style={styles.title}>🏨 Panel de Recepción</h1>
          <p style={styles.subtitle}>Bienvenido, {user?.nombres}</p>
        </div>

        <div style={styles.stats}>
          <div className="card" style={styles.statCard}>
            <span style={styles.statNumber}>{stats.reservasPendientes}</span>
            <span style={styles.statLabel}>⏳ Pendientes</span>
          </div>
          <div className="card" style={styles.statCard}>
            <span style={styles.statNumber}>{stats.reservasConfirmadas}</span>
            <span style={styles.statLabel}>✅ Confirmadas</span>
          </div>
          <div className="card" style={styles.statCard}>
            <span style={styles.statNumber}>{stats.checkIns}</span>
            <span style={styles.statLabel}>🏨 Check-in</span>
          </div>
          <div className="card" style={styles.statCard}>
            <span style={styles.statNumber}>{stats.checkOuts}</span>
            <span style={styles.statLabel}>🚪 Check-out</span>
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

export default RecepcionPanel;