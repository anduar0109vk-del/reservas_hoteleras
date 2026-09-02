// src/components/GestionarHabitaciones.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from './Navbar';

const GestionarHabitaciones = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarHabitaciones();
  }, []);

  const cargarHabitaciones = async () => {
    try {
      const response = await api.get('/habitaciones');
      setHabitaciones(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-spinner">Cargando...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>✏️ Gestionar Habitaciones</h1>
        <button className="btn-primary" style={styles.addBtn}>+ Agregar Habitación</button>
        <div style={styles.grid}>
          {habitaciones.map((h) => (
            <div key={h.id} className="card" style={styles.card}>
              <h3>Habitación {h.numero}</h3>
              <p><strong>Tipo:</strong> {h.tipoHabitacion?.nombre}</p>
              <p><strong>Precio:</strong> S/{h.precioActual}</p>
              <p><strong>Estado:</strong> {h.estado}</p>
              <div style={styles.buttonGroup}>
                <button className="btn-primary" style={styles.editBtn}>✏️ Editar</button>
                <button className="btn-danger" style={styles.deleteBtn}>🗑️ Eliminar</button>
              </div>
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
  title: {
    color: '#2d3748',
    marginBottom: '20px',
  },
  addBtn: {
    marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  card: {
    padding: '16px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
  editBtn: {
    flex: 1,
    padding: '6px',
    fontSize: '13px',
  },
  deleteBtn: {
    flex: 1,
    padding: '6px',
    fontSize: '13px',
  },
};

export default GestionarHabitaciones;