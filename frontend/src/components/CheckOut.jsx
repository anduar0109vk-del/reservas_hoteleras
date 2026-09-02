// src/components/CheckOut.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from './Navbar';

const CheckOut = () => {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargarReservas();
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

  const cargarReservas = async () => {
    try {
      const response = await api.get('/recepcion/reservas');
      const confirmadas = normalizeList(response.data).filter(r => r.estado === 'CONFIRMADA');
      setReservas(confirmadas);
    } catch (error) {
      setError('Error al cargar reservas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const realizarCheckOut = async (reservaId) => {
    if (!window.confirm('¿Confirmar checkout de esta reserva?')) return;
    
    setProcesando(true);
    try {
      await api.patch(`/recepcion/checkout/${reservaId}`);
      alert('✅ Check-out realizado exitosamente');
      await cargarReservas();
    } catch (error) {
      alert('❌ Error al realizar check-out');
      console.error(error);
    } finally {
      setProcesando(false);
    }
  };

  const getEstadoColor = (estado) => {
    const colors = {
      'PENDIENTE': '#f6ad55',
      'CONFIRMADA': '#48bb78',
      'CANCELADA': '#fc8181',
      'FINALIZADA': '#63b3ed',
      'NO_SHOW': '#a0aec0'
    };
    return colors[estado] || '#a0aec0';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-spinner">Cargando reservas...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>🚪 Check-out</h2>
        <p style={styles.subtitle}>Registrar salida de huéspedes</p>

        {error && <div className="error-message">{error}</div>}

        {reservas.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>🚪</p>
            <p style={styles.emptyText}>No hay reservas para checkout</p>
            <button className="btn-primary" onClick={() => navigate('/todas-reservas')}>
              Ver todas las reservas
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {reservas.map((r) => (
              <div key={r.id} className="card" style={styles.reservaCard}>
                <div style={styles.cardHeader}>
                  <h4>{r.codigoReserva}</h4>
                  <span style={{ ...styles.badge, backgroundColor: getEstadoColor(r.estado) }}>
                    {r.estado}
                  </span>
                </div>
                <p><strong>Cliente:</strong> {r.cliente?.usuario?.nombres} {r.cliente?.usuario?.apellidos}</p>
                <p><strong>Habitación:</strong> N° {r.habitacion?.numero}</p>
                <p><strong>Tipo:</strong> {r.habitacion?.tipoHabitacion?.nombre}</p>
                <p><strong>Entrada:</strong> {r.fechaEntrada}</p>
                <p><strong>Salida:</strong> {r.fechaSalida}</p>
                <p><strong>Huéspedes:</strong> {r.numeroHuespedes}</p>
                <p><strong>Total:</strong> S/{r.montoTotal}</p>
                <button
                  className="btn-primary"
                  style={styles.checkoutBtn}
                  onClick={() => realizarCheckOut(r.id)}
                  disabled={procesando}
                >
                  {procesando ? 'Procesando...' : '🚪 Realizar Check-out'}
                </button>
              </div>
            ))}
          </div>
        )}
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
    marginBottom: '8px',
  },
  subtitle: {
    color: '#4a5568',
    marginBottom: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  reservaCard: {
    padding: '20px',
    borderLeft: '4px solid #ed8936',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
  checkoutBtn: {
    marginTop: '12px',
    width: '100%',
    padding: '10px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '18px',
    color: '#4a5568',
    marginBottom: '20px',
  },
};

export default CheckOut;