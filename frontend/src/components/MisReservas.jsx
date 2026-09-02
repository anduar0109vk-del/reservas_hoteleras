// src/components/MisReservas.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from './Navbar';

const MisReservas = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(false);

  const isAdmin = user?.rol === 'ADMIN';
  const isGerente = user?.rol === 'GERENTE';
  const isRecepcionista = user?.rol === 'RECEPCIONISTA';
  const isCliente = user?.rol === 'CLIENTE';

  useEffect(() => {
    cargarReservas();
  }, [user]);

  const cargarReservas = async () => {
    setLoading(true);
    try {
      let response;

      if (isAdmin || isGerente || isRecepcionista) {
        response = await api.get('/reservas');
      } else if (isCliente) {
        const clienteResponse = await api.get(`/clientes/usuario/${user?.email}`);
        const cliente = clienteResponse.data;
        response = await api.get(`/reservas/cliente/${cliente.id}`);
      } else {
        setReservas([]);
        setLoading(false);
        return;
      }

      if (Array.isArray(response.data)) {
        setReservas(response.data);
      } else if (response.data?.content) {
        setReservas(response.data.content);
      } else {
        setReservas([]);
        setError('No se pudieron cargar las reservas');
      }
    } catch (error) {
      console.error('Error cargando reservas:', error);
      setError('Error al cargar las reservas');
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelarReserva = async (id) => {
    if (!window.confirm('¿Estás seguro de cancelar esta reserva?')) return;

    setProcesando(true);
    try {
      await api.patch(`/reservas/${id}/cancelar?motivo=Cancelado%20por%20usuario`);
      await cargarReservas();
      alert('✅ Reserva cancelada exitosamente');
    } catch (error) {
      console.error('Error al cancelar:', error);
      const mensaje = error.response?.data?.message || 'Error al cancelar la reserva';
      alert(`❌ ${mensaje}`);
    } finally {
      setProcesando(false);
    }
  };

  const confirmarReserva = async (id) => {
    if (!window.confirm('¿Confirmar esta reserva?')) return;

    setProcesando(true);
    try {
      await api.patch(`/recepcion/reservas/${id}/confirmar`);
      await cargarReservas();
      alert('✅ Reserva confirmada exitosamente');
    } catch (error) {
      console.error('Error al confirmar:', error);
      alert('❌ Error al confirmar la reserva');
    } finally {
      setProcesando(false);
    }
  };

  const finalizarReserva = async (id) => {
    if (!window.confirm('¿Finalizar (checkout) esta reserva?')) return;

    setProcesando(true);
    try {
      await api.patch(`/recepcion/reservas/${id}/finalizar`);
      await cargarReservas();
      alert('✅ Checkout realizado exitosamente');
    } catch (error) {
      console.error('Error al finalizar:', error);
      alert('❌ Error al finalizar la reserva');
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

  const getNombreCliente = (reserva) => {
    if (!reserva.cliente) return 'Cliente no disponible';
    if (reserva.cliente.usuario) {
      const nombres = reserva.cliente.usuario.nombres || '';
      const apellidos = reserva.cliente.usuario.apellidos || '';
      const nombreCompleto = `${nombres} ${apellidos}`.trim();
      if (nombreCompleto) return nombreCompleto;
    }
    if (reserva.cliente.nombres) {
      return `${reserva.cliente.nombres} ${reserva.cliente.apellidos || ''}`.trim();
    }
    return 'Cliente sin usuario';
  };

  const getEmailCliente = (reserva) => {
    if (!reserva.cliente) return '';
    if (reserva.cliente.usuario && reserva.cliente.usuario.email) {
      return reserva.cliente.usuario.email;
    }
    if (reserva.cliente.email) {
      return reserva.cliente.email;
    }
    return '';
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
          {(isAdmin || isGerente || isRecepcionista) && (
            <span style={styles.badge}>Todas las reservas del sistema</span>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {!Array.isArray(reservas) || reservas.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>🏨</p>
            <p style={styles.emptyText}>No tienes reservas aún.</p>
            <button className="btn-primary" onClick={() => navigate('/nueva-reserva')}>
              Hacer una reserva
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {reservas.map((r) => (
              <div key={r.id} className="card" style={styles.reservaCard}>
                <div style={styles.cardHeader}>
                  <h4 style={styles.codigo}>{r.codigoReserva}</h4>
                  <span style={{ ...styles.badgeEstado, backgroundColor: getEstadoColor(r.estado) }}>
                    {r.estado || 'PENDIENTE'}
                  </span>
                </div>

                {/* Cliente info - solo para ADMIN, GERENTE, RECEPCIONISTA */}
                {(isAdmin || isGerente || isRecepcionista) && (
                  <div style={styles.clienteInfo}>
                    <span style={styles.clienteIcon}>👤</span>
                    <span style={styles.clienteNombre}>
                      {getNombreCliente(r)}
                    </span>
                    {getEmailCliente(r) && (
                      <span style={styles.clienteEmail}>
                        📧 {getEmailCliente(r)}
                      </span>
                    )}
                  </div>
                )}

                <div style={styles.habitacionInfo}>
                  <span style={styles.roomIcon}>🛏️</span>
                  <span style={styles.roomNumber}>Habitación {r.habitacion?.numero || 'N/A'}</span>
                  <span style={styles.roomType}>{r.habitacion?.tipoHabitacion?.nombre || ''}</span>
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
                    <span style={styles.dateLabel}>👤 Huéspedes:</span>
                    <span style={styles.dateValue}>{r.numeroHuespedes}</span>
                  </div>
                  <div style={styles.dateItem}>
                    <span style={styles.dateLabel}>💰 Total:</span>
                    <span style={styles.dateValue}>S/{r.montoTotal}</span>
                  </div>
                </div>

                {r.promocion && (
                  <div style={styles.promocionInfo}>
                    <span>🎯 Promoción: {r.promocion.nombre}</span>
                  </div>
                )}

                {/* Servicios agregados */}
                {r.servicios && r.servicios.length > 0 && (
                  <div style={styles.serviciosInfo}>
                    <span style={styles.serviciosIcon}>🛎️</span>
                    <span style={styles.serviciosLabel}>Servicios contratados:</span>
                    <span style={styles.serviciosLista}>
                      {r.servicios.map((s, index) => (
                        <span key={s.id}>
                          {s.servicio?.nombre}
                          {index < r.servicios.length - 1 && ', '}
                        </span>
                      ))}
                    </span>
                  </div>
                )}

                <div style={styles.buttonContainer}>
                  {/* PENDIENTE - Botones Cancelar, Pagar, Confirmar y Agregar Servicios */}
                  {r.estado === 'PENDIENTE' && (
                    <>
                      <button
                        className="btn-danger"
                        style={styles.cancelBtn}
                        onClick={() => cancelarReserva(r.id)}
                        disabled={procesando}
                      >
                        ❌ Cancelar
                      </button>
                      <button
                        className="btn-success"
                        style={styles.confirmBtn}
                        onClick={() => navigate(`/pagos/${r.id}`)}
                        disabled={procesando}
                      >
                        💳 Pagar
                      </button>
                      {/* ADMIN, GERENTE, RECEPCIONISTA pueden confirmar directamente */}
                      {(isAdmin || isGerente || isRecepcionista) && (
                        <button
                          className="btn-primary"
                          style={styles.confirmDirectBtn}
                          onClick={() => confirmarReserva(r.id)}
                          disabled={procesando}
                        >
                          ✅ Confirmar
                        </button>
                      )}
                      {/* Botón para agregar servicios */}
                      <button
                        className="btn-primary"
                        style={styles.serviciosBtn}
                        onClick={() => navigate(`/reservas/${r.id}/servicios`)}
                        disabled={procesando}
                      >
                        🛎️ Servicios
                      </button>
                    </>
                  )}

                  {/* CONFIRMADA - Botones Cancelar, Finalizar, Facturar y Agregar Servicios */}
                  {r.estado === 'CONFIRMADA' && (
                    <>
                      {(isAdmin || isGerente || isRecepcionista) && (
                        <>
                          <button
                            className="btn-danger"
                            style={styles.cancelBtn}
                            onClick={() => cancelarReserva(r.id)}
                            disabled={procesando}
                          >
                            ❌ Cancelar
                          </button>
                          <button
                            className="btn-success"
                            style={styles.finalizarBtn}
                            onClick={() => finalizarReserva(r.id)}
                            disabled={procesando}
                          >
                            📌 Checkout
                          </button>
                        </>
                      )}
                      <button
                        className="btn-primary"
                        style={styles.facturarBtn}
                        onClick={() => navigate(`/facturacion/${r.id}`)}
                      >
                        🧾 Facturar
                      </button>
                      <button
                        className="btn-primary"
                        style={styles.serviciosBtn}
                        onClick={() => navigate(`/reservas/${r.id}/servicios`)}
                        disabled={procesando}
                      >
                        🛎️ Servicios
                      </button>
                    </>
                  )}

                  {/* FINALIZADA - Solo Facturar */}
                  {r.estado === 'FINALIZADA' && (
                    <>
                      <button
                        className="btn-primary"
                        style={styles.facturarBtn}
                        onClick={() => navigate(`/facturacion/${r.id}`)}
                      >
                        🧾 Facturar
                      </button>
                    </>
                  )}

                  {/* CANCELADA - Mostrar mensaje */}
                  {r.estado === 'CANCELADA' && (
                    <span style={styles.canceledLabel}>❌ Reserva cancelada</span>
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
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  title: {
    color: '#2d3748',
    margin: 0,
  },
  badge: {
    padding: '6px 16px',
    backgroundColor: '#4299e1',
    color: 'white',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
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
  },
  codigo: {
    fontSize: '16px',
    color: '#2d3748',
    margin: 0,
  },
  badgeEstado: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
  clienteInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f7fafc',
    padding: '8px 12px',
    borderRadius: '6px',
    marginBottom: '10px',
    flexWrap: 'wrap',
  },
  clienteIcon: {
    fontSize: '16px',
  },
  clienteNombre: {
    fontWeight: '600',
    color: '#2d3748',
  },
  clienteEmail: {
    fontSize: '13px',
    color: '#4a5568',
  },
  habitacionInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ebf8ff',
    padding: '8px 12px',
    borderRadius: '6px',
    marginBottom: '10px',
  },
  roomIcon: {
    fontSize: '16px',
  },
  roomNumber: {
    fontWeight: '600',
    color: '#2d3748',
  },
  roomType: {
    fontSize: '14px',
    color: '#4a5568',
  },
  dates: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '6px',
    marginBottom: '8px',
  },
  dateItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '2px 0',
  },
  dateLabel: {
    fontSize: '13px',
    color: '#718096',
  },
  dateValue: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#2d3748',
  },
  promocionInfo: {
    padding: '6px 10px',
    backgroundColor: '#fefcbf',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#975a16',
    marginBottom: '10px',
  },
  serviciosInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    backgroundColor: '#e9d8fd',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#6b46c1',
    marginBottom: '10px',
    flexWrap: 'wrap',
  },
  serviciosIcon: {
    fontSize: '14px',
  },
  serviciosLabel: {
    fontWeight: '600',
  },
  serviciosLista: {
    fontSize: '13px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    flexWrap: 'wrap',
  },
  cancelBtn: {
    padding: '6px 12px',
    fontSize: '13px',
    borderRadius: '6px',
    backgroundColor: '#fc8181',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  confirmBtn: {
    padding: '6px 12px',
    fontSize: '13px',
    borderRadius: '6px',
    backgroundColor: '#48bb78',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  confirmDirectBtn: {
    padding: '6px 12px',
    fontSize: '13px',
    borderRadius: '6px',
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  finalizarBtn: {
    padding: '6px 12px',
    fontSize: '13px',
    borderRadius: '6px',
    backgroundColor: '#38a169',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  facturarBtn: {
    padding: '6px 12px',
    fontSize: '13px',
    borderRadius: '6px',
    backgroundColor: '#9f7aea',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  serviciosBtn: {
    padding: '6px 12px',
    fontSize: '13px',
    borderRadius: '6px',
    backgroundColor: '#805ad5',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  canceledLabel: {
    color: '#e53e3e',
    fontWeight: '600',
    fontSize: '14px',
    padding: '6px 12px',
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

export default MisReservas;