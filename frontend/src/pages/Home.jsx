import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.hero}>
          <h1 style={styles.title}>🏨 Bienvenido al Sistema de Reservas</h1>
          <p style={styles.subtitle}>Gestiona tus reservas de manera fácil y rápida</p>
          <div style={styles.buttons}>
            <button 
              className="btn-primary" 
              style={styles.btn}
              onClick={() => navigate('/habitaciones')}
            >
              Ver Habitaciones
            </button>
            <button 
              className="btn-success" 
              style={styles.btn}
              onClick={() => navigate('/nueva-reserva')}
            >
              Nueva Reserva
            </button>
          </div>
        </div>

        <div style={styles.stats}>
          <div className="card" style={styles.statCard}>
            <span style={styles.statIcon}>🛏️</span>
            <span style={styles.statNumber}>12</span>
            <span style={styles.statLabel}>Habitaciones Disponibles</span>
          </div>
          <div className="card" style={styles.statCard}>
            <span style={styles.statIcon}>📋</span>
            <span style={styles.statNumber}>5</span>
            <span style={styles.statLabel}>Reservas Activas</span>
          </div>
          <div className="card" style={styles.statCard}>
            <span style={styles.statIcon}>⭐</span>
            <span style={styles.statNumber}>4</span>
            <span style={styles.statLabel}>Habitaciones Destacadas</span>
          </div>
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
  hero: {
    textAlign: 'center',
    padding: '40px 20px',
    marginBottom: '40px',
  },
  title: {
    fontSize: '36px',
    color: '#1a365d',
    marginBottom: '12px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#4a5568',
    marginBottom: '24px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  btn: {
    padding: '12px 32px',
    fontSize: '16px',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  statCard: {
    textAlign: 'center',
    padding: '24px',
  },
  statIcon: {
    display: 'block',
    fontSize: '36px',
    marginBottom: '8px',
  },
  statNumber: {
    display: 'block',
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#2b6cb0',
  },
  statLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#718096',
  },
};

export default Home;