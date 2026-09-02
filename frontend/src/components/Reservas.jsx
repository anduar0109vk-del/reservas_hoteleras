import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from './Navbar';

const Reservas = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('todas');

  const isStaff = ['ADMIN', 'GERENTE', 'RECEPCIONISTA'].includes(user?.rol);

  useEffect(() => {
    if (user) {
      cargarReservas();
    }
  }, [user]);

  const cargarReservas = async () => {
    try {
      const response = isStaff
        ? await api.get('/reservas')
        : await api.get(`/clientes/usuario/${encodeURIComponent(user.email)}`)
            .then(clienteResponse => api.get(`/reservas/cliente/${clienteResponse.data.id}`));
      const data = response.data;
      setReservas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando reservas:', error);
      setError('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const filtrarReservas = () => {
    if (filter === 'todas') return reservas;
    return reservas.filter(r => r.estado === filter);
  };

  const reservasFiltradas = filtrarReservas();

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

  const getEstadoIcon = (estado) => {
    const icons = {
      'PENDIENTE': '⏳',
      'CONFIRMADA': '✅',
      'CANCELADA': '❌',
      'FINALIZADA': '📌',
      'NO_SHOW': '🚫'
    };
    return icons[estado] || '📋';
  };

  const cancelarReserva = async (id) => {
    if (!window.confirm('¿Estás seguro de cancelar esta reserva?')) return;

    try {
      await api.patch(`/reservas/${id}/cancelar?motivo=Cancelado%20por%20usuario`);
      await cargarReservas();
      alert('✅ Reserva cancelada exitosamente');
    } catch (error) {
      alert('❌ Error al cancelar la reserva');
    }
  };

  const confirmarReserva = async (id) => {
    try {
      await api.patch(`/reservas/${id}/confirmar`);
      await cargarReservas();
      alert('✅ Reserva confirmada exitosamente');
    } catch (error) {
      alert('❌ Error al confirmar la reserva');
    }
  };

  const finalizarReserva = async (id) => {
    if (!window.confirm('¿Confirmar checkout de esta reserva?')) return;

    try {
      await api.patch(`/reservas/${id}/finalizar`);
      await cargarReservas();
      alert('✅ Checkout realizado exitosamente');
    } catch (error) {
      alert('❌ Error al finalizar la reserva');
    }
  };

  const calcularDias = (entrada, salida) => {
    const start = new Date(entrada);
    const end = new Date(salida);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff;
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
        <div style={styles.header}>
          <h2 style={styles.title}>📋 Mis Reservas</h2>
          <button 
            className="btn-primary"
            onClick={() => navigate('/nueva-reserva')}
          >
            + Nueva Reserva
          </button>
        </div>

        <div style={styles.filterContainer}>
          <label style={styles.filterLabel}>Filtrar por estado:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="todas">Todas</option>
            <option value="PENDIENTE">⏳ Pendientes</option>
            <option value="CONFIRMADA">✅ Confirmadas</option>
            <option value="CANCELADA">❌ Canceladas</option>
            <option value="FINALIZADA">📌 Finalizadas</option>
            <option value="NO_SHOW">🚫 No Show</option>
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        {reservasFiltradas.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>🏨</p>
            <p style={styles.emptyText}>No tienes reservas {filter !== 'todas' ? `con estado "${filter}"` : ''}</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/nueva-reserva')}
            >
              Hacer una reserva
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {reservasFiltradas.map((r) => (
              <div key={r.id} className="card" style={styles.reservaCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.codigoContainer}>
                    <span style={styles.codigoIcon}>🏷️</span>
                    <span style={styles.codigo}>{r.codigoReserva}</span>
                  </div>
                  <span style={{ ...styles.badge, backgroundColor: getEstadoColor(r.estado) }}>
                    {getEstadoIcon(r.estado)} {r.estado}
                  </span>
                </div>

                <div style={styles.habitacionInfo}>
                  <div style={styles.roomNumber}>
                    <span style={styles.roomIcon}>🛏️</span>
                    Habitación {r.habitacion?.numero}
                  </div>
                  <div style={styles.roomType}>
                    {r.habitacion?.tipoHabitacion?.nombre}
                  </div>
                </div>

                <div style={styles.dates}>
                  <div style={styles.dateItem}>
                    <span style={styles.dateLabel}>📅 Entrada:</span>
                    <span style={styles.dateValue}>{r.fechaEntrada}</span>
                  </div>
                  <div style={styles.dateItem}>
                    <span style={styles.dateLabel}>📅 Salida:</span>
                    <span style={styles.dateValue}>{r.fechaSalida}</span>
                  </div>
                  <div style={styles.dateItem}>
                    <span style={styles.dateLabel}>⏱️ Estancia:</span>
                    <span style={styles.dateValue}>{calcularDias(r.fechaEntrada, r.fechaSalida)} días</span>
                  </div>
                </div>

                <div style={styles.details}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>👤 Huéspedes:</span>
                    <span style={styles.detailValue}>{r.numeroHuespedes}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>💰 Total:</span>
                    <span style={styles.detailValue}>S/{r.montoTotal}</span>
                  </div>
                  {r.promocion && (
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>🎯 Promoción:</span>
                      <span style={styles.detailValue}>{r.promocion.nombre}</span>
                    </div>
                  )}
                  {r.pago && (
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>💳 Pago:</span>
                      <span style={styles.detailValue}>{r.pago.estado}</span>
                    </div>
                  )}
                </div>

                <div style={styles.buttonContainer}>
                  {r.estado === 'PENDIENTE' && (
                    <>
                      <button
                        className="btn-success"
                        style={styles.actionBtn}
                        onClick={() => confirmarReserva(r.id)}
                      >
                        ✅ Confirmar
                      </button>
                      <button
                        className="btn-danger"
                        style={styles.actionBtn}
                        onClick={() => cancelarReserva(r.id)}
                      >
                        ❌ Cancelar
                      </button>
                      <button
                        className="btn-primary"
                        style={styles.actionBtn}
                        onClick={() => navigate(`/pagos/${r.id}`)}
                      >
                        💳 Pagar
                      </button>
                    </>
                  )}
                  {r.estado === 'CONFIRMADA' && (
                    <>
                      <button
                        className="btn-danger"
                        style={styles.actionBtn}
                        onClick={() => cancelarReserva(r.id)}
                      >
                        ❌ Cancelar
                      </button>
                      <button
                        className="btn-success"
                        style={styles.actionBtn}
                        onClick={() => finalizarReserva(r.id)}
                      >
                        📌 Checkout
                      </button>
                    </>
                  )}
                  {r.estado === 'CANCELADA' && (
                    <span style={styles.canceledLabel}>Reserva cancelada</span>
                  )}
                  {r.estado === 'FINALIZADA' && (
                    <span style={styles.finalizedLabel}>✅ Estancia completada</span>
                  )}
                </div>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  title: {
    color: '#2d3748',
    margin: 0,
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
    backgroundColor: 'white',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '20px',
  },
  reservaCard: {
    borderLeft: '4px solid #4299e1',
    padding: '20px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  codigoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  codigoIcon: {
    fontSize: '16px',
  },
  codigo: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
  habitacionInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#f7fafc',
    borderRadius: '6px',
    marginBottom: '12px',
  },
  roomNumber: {
    fontWeight: '600',
    color: '#2d3748',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  roomIcon: {
    fontSize: '16px',
  },
  roomType: {
    fontSize: '14px',
    color: '#4a5568',
  },
  dates: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '8px',
    marginBottom: '12px',
    padding: '8px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  dateItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: '11px',
    color: '#718096',
  },
  dateValue: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#2d3748',
  },
  details: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '6px',
    marginBottom: '12px',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 0',
  },
  detailLabel: {
    fontSize: '13px',
    color: '#718096',
  },
  detailValue: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#2d3748',
  },
  buttonContainer: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    flexWrap: 'wrap',
  },
  actionBtn: {
    flex: '1',
    minWidth: '80px',
    padding: '6px 12px',
    fontSize: '12px',
    borderRadius: '6px',
  },
  canceledLabel: {
    color: '#e53e3e',
    fontWeight: '600',
    fontSize: '14px',
  },
  finalizedLabel: {
    color: '#48bb78',
    fontWeight: '600',
    fontSize: '14px',
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

export default Reservas;