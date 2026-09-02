import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from './Navbar';

const Habitaciones = () => {
  const navigate = useNavigate();
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas');

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

  const filtrarHabitaciones = () => {
    if (filter === 'todas') return habitaciones;
    if (filter === 'disponibles') return habitaciones.filter(h => h.estado === 'DISPONIBLE');
    if (filter === 'destacadas') return habitaciones.filter(h => h.destacada);
    return habitaciones;
  };

  const habitacionesFiltradas = filtrarHabitaciones();

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
        <h2 style={styles.title}>🏨 Todas las Habitaciones</h2>

        <div style={styles.filterContainer}>
          <label style={styles.filterLabel}>Filtrar:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="todas">Todas</option>
            <option value="disponibles">Disponibles</option>
            <option value="destacadas">Destacadas</option>
          </select>
        </div>

        <div className="grid-3">
          {habitacionesFiltradas.map((h) => (
            <div key={h.id} className="card" style={h.destacada ? styles.destacada : {}}>
              <div style={styles.cardHeader}>
                <h4 style={styles.roomNumber}>Habitación {h.numero}</h4>
                <span style={styles.statusBadge(h.estado)}>{h.estado}</span>
              </div>
              <p><strong>Tipo:</strong> {h.tipoHabitacion?.nombre}</p>
              <p><strong>Piso:</strong> {h.piso}</p>
              <p><strong>Precio:</strong> S/{h.precioActual}</p>
              <p><strong>Capacidad:</strong> {h.tipoHabitacion?.capacidad} personas</p>
              {h.destacada && <p style={styles.destacadaLabel}>⭐ Destacada</p>}
              {h.estado === 'DISPONIBLE' && (
                <button
                  className="btn-primary"
                  style={styles.bookBtn}
                  onClick={() => navigate('/nueva-reserva', { state: { habitacion: h } })}
                >
                  Reservar
                </button>
              )}
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
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  filterLabel: {
    fontWeight: '600',
    color: '#4a5568',
  },
  filterSelect: {
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '14px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  roomNumber: {
    fontSize: '18px',
    color: '#2d3748',
    margin: 0,
  },
  statusBadge: (estado) => ({
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: estado === 'DISPONIBLE' ? '#c6f6d5' : estado === 'OCUPADA' ? '#fed7d7' : '#fefcbf',
    color: estado === 'DISPONIBLE' ? '#276749' : estado === 'OCUPADA' ? '#9b2c2c' : '#975a16',
  }),
  destacada: {
    border: '2px solid #f6ad55',
  },
  destacadaLabel: {
    color: '#dd6b20',
    fontWeight: 'bold',
    marginTop: '8px',
  },
  bookBtn: {
    marginTop: '12px',
    width: '100%',
  },
};

export default Habitaciones;