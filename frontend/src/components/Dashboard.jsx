import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from './Navbar';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [destacadas, setDestacadas] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [disponiblesRes, destacadasRes] = await Promise.all([
        api.get('/habitaciones/disponibles'),
        api.get('/habitaciones/destacadas')
      ]);
      setHabitaciones(disponiblesRes.data);
      setDestacadas(destacadasRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-spinner">Cargando habitaciones...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.welcome}>👋 Bienvenido, {user?.nombres}</h2>

        {destacadas.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>⭐ Habitaciones Destacadas</h3>
            <div className="grid-3">
              {destacadas.slice(0, 3).map((h) => (
                <div key={h.id} className="card" style={styles.destacadaCard}>
                  <h4 style={styles.roomNumber}>Habitación {h.numero}</h4>
                  <p><strong>Tipo:</strong> {h.tipoHabitacion?.nombre}</p>
                  <p><strong>Precio:</strong> S/{h.precioActual}</p>
                  <p><strong>Capacidad:</strong> {h.tipoHabitacion?.capacidad} personas</p>
                  <button
                    className="btn-primary"
                    style={styles.bookBtn}
                    onClick={() => navigate('/nueva-reserva', { state: { habitacion: h } })}
                  >
                    Reservar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🛏️ Habitaciones Disponibles</h3>
          <div className="grid-3">
            {habitaciones.map((h) => (
              <div key={h.id} className="card">
                <h4 style={styles.roomNumber}>Habitación {h.numero}</h4>
                <p><strong>Tipo:</strong> {h.tipoHabitacion?.nombre}</p>
                <p><strong>Piso:</strong> {h.piso}</p>
                <p><strong>Precio:</strong> S/{h.precioActual}</p>
                <p><strong>Capacidad:</strong> {h.tipoHabitacion?.capacidad} personas</p>
                <button
                  className="btn-primary"
                  style={styles.bookBtn}
                  onClick={() => navigate('/nueva-reserva', { state: { habitacion: h } })}
                >
                  Reservar
                </button>
              </div>
            ))}
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
  welcome: {
    color: '#2d3748',
    marginBottom: '24px',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    color: '#2d3748',
    marginBottom: '16px',
  },
  roomNumber: {
    fontSize: '18px',
    color: '#2d3748',
    marginBottom: '8px',
  },
  destacadaCard: {
    border: '2px solid #f6ad55',
  },
  bookBtn: {
    marginTop: '12px',
    width: '100%',
  },
};

export default Dashboard;