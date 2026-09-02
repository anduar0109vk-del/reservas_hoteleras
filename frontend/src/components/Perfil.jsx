import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

const Perfil = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div className="card" style={styles.card}>
          <h2 style={styles.title}>👤 Mi Perfil</h2>
          <div style={styles.info}>
            <div style={styles.field}>
              <label style={styles.label}>Nombre:</label>
              <p style={styles.value}>{user?.nombres}</p>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email:</label>
              <p style={styles.value}>{user?.email}</p>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Rol:</label>
              <p style={styles.value}>{user?.rol}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '40px auto',
    padding: '0 20px',
  },
  card: {
    padding: '32px',
  },
  title: {
    textAlign: 'center',
    color: '#2d3748',
    marginBottom: '24px',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '12px',
  },
  label: {
    fontWeight: '600',
    color: '#4a5568',
    fontSize: '14px',
    display: 'block',
  },
  value: {
    fontSize: '16px',
    color: '#2d3748',
    marginTop: '4px',
  },
};

export default Perfil;