// src/components/Servicios.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from './Navbar';

const Servicios = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reservas, setReservas] = useState([]);
  const [selectedReserva, setSelectedReserva] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState('');

  const isCliente = user?.rol === 'CLIENTE';
  const isAdmin = user?.rol === 'ADMIN';
  const isGerente = user?.rol === 'GERENTE';
  const isRecepcionista = user?.rol === 'RECEPCIONISTA';
  const puedeAgregarServicios = isCliente || isAdmin || isGerente || isRecepcionista;

  useEffect(() => {
    cargarServicios();
    if (puedeAgregarServicios) {
      cargarReservasActivas();
    }
  }, []);

  const cargarServicios = async () => {
    try {
      const response = await api.get('/servicios/disponibles');
      setServicios(response.data);
    } catch (error) {
      console.error('Error cargando servicios:', error);
      setError('Error al cargar los servicios');
    } finally {
      setLoading(false);
    }
  };

  const cargarReservasActivas = async () => {
    try {
      let response;
      if (isCliente) {
        const clienteResponse = await api.get(`/clientes/usuario/${user?.email}`);
        const cliente = clienteResponse.data;
        response = await api.get(`/reservas/cliente/${cliente.id}`);
      } else {
        response = await api.get('/reservas');
      }
      
      const activas = response.data.filter(
        r => r.estado === 'PENDIENTE' || r.estado === 'CONFIRMADA'
      );
      setReservas(activas);
    } catch (error) {
      console.error('Error cargando reservas:', error);
    }
  };

  const abrirModal = (servicio) => {
    if (reservas.length === 0) {
      setMensaje('⚠️ No tienes reservas activas para agregar servicios');
      setTimeout(() => setMensaje(''), 3000);
      return;
    }
    setSelectedServicio(servicio);
    setCantidad(1);
    setSelectedReserva(reservas[0]?.id || '');
    setShowModal(true);
  };

  const agregarServicio = async () => {
    if (!selectedReserva) {
      setError('Por favor selecciona una reserva');
      return;
    }

    try {
      await api.post(`/servicios/reserva/${selectedReserva}`, {
        servicioId: selectedServicio.id,
        cantidad: cantidad
      });
      
      setMensaje(`✅ ${selectedServicio.nombre} agregado a la reserva`);
      setShowModal(false);
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error al agregar servicio');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getCategoriaEmoji = (categoria) => {
    const emojis = {
      'COMIDA': '🍽️',
      'BEBIDA': '🥤',
      'ENTRETENIMIENTO': '🎮',
      'OTRO': '📦'
    };
    return emojis[categoria] || '📦';
  };

  const getCategoriaColor = (categoria) => {
    const colors = {
      'COMIDA': '#f6ad55',
      'BEBIDA': '#63b3ed',
      'ENTRETENIMIENTO': '#9f7aea',
      'OTRO': '#a0aec0'
    };
    return colors[categoria] || '#a0aec0';
  };

  const agruparPorCategoria = () => {
    const grouped = {};
    servicios.forEach(s => {
      if (!grouped[s.categoria]) {
        grouped[s.categoria] = [];
      }
      grouped[s.categoria].push(s);
    });
    return grouped;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-spinner">Cargando servicios...</div>
      </>
    );
  }

  const serviciosPorCategoria = agruparPorCategoria();

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>🛎️ Servicios a la Habitación</h2>
        
        {mensaje && <div className="success-message">{mensaje}</div>}
        {error && <div className="error-message">{error}</div>}

        {servicios.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>🛎️</p>
            <p style={styles.emptyText}>No hay servicios disponibles en este momento.</p>
          </div>
        ) : (
          Object.keys(serviciosPorCategoria).map((categoria) => (
            <div key={categoria} style={styles.categoriaSection}>
              <h3 style={styles.categoriaTitle}>{getCategoriaEmoji(categoria)} {categoria}</h3>
              <div style={styles.grid}>
                {serviciosPorCategoria[categoria].map((s) => (
                  <div key={s.id} className="card" style={styles.servicioCard}>
                    <div style={styles.cardHeader}>
                      <span style={styles.icon}>{getCategoriaEmoji(s.categoria)}</span>
                      <span style={{ ...styles.categoriaBadge, backgroundColor: getCategoriaColor(s.categoria) }}>
                        {s.categoria}
                      </span>
                    </div>
                    <h4 style={styles.nombre}>{s.nombre}</h4>
                    <p style={styles.descripcion}>{s.descripcion || 'Sin descripción'}</p>
                    <p style={styles.precio}>S/{s.precio}</p>
                    <span style={{ ...styles.disponibleBadge, backgroundColor: s.disponible ? '#48bb78' : '#fc8181' }}>
                      {s.disponible ? '✅ Disponible' : '❌ No disponible'}
                    </span>
                    
                    {puedeAgregarServicios && s.disponible && (
                      <button
                        className="btn-primary"
                        style={styles.agregarBtn}
                        onClick={() => abrirModal(s)}
                      >
                        ➕ Agregar a Reserva
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {/* Modal para agregar servicio */}
        {showModal && selectedServicio && (
          <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>Agregar Servicio</h3>
              <div style={styles.modalBody}>
                <p><strong>Servicio:</strong> {selectedServicio.nombre}</p>
                <p><strong>Precio:</strong> S/{selectedServicio.precio}</p>
                
                <div style={styles.field}>
                  <label style={styles.label}>Seleccionar Reserva:</label>
                  <select
                    value={selectedReserva}
                    onChange={(e) => setSelectedReserva(e.target.value)}
                    style={styles.input}
                  >
                    {reservas.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.codigoReserva} - Hab. {r.habitacion?.numero}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Cantidad:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={cantidad}
                    onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                    style={styles.input}
                  />
                </div>

                <div style={styles.totalContainer}>
                  <span>Total: S/{selectedServicio.precio * cantidad}</span>
                </div>
              </div>
              <div style={styles.modalFooter}>
                <button className="btn-danger" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button className="btn-success" onClick={agregarServicio}>
                  ✅ Agregar
                </button>
              </div>
            </div>
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
    marginBottom: '24px',
  },
  categoriaSection: {
    marginBottom: '32px',
  },
  categoriaTitle: {
    color: '#2d3748',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '2px solid #e2e8f0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  servicioCard: {
    padding: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '12px',
  },
  icon: {
    fontSize: '32px',
  },
  categoriaBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
  nombre: {
    fontSize: '18px',
    color: '#2d3748',
    marginBottom: '8px',
  },
  descripcion: {
    fontSize: '14px',
    color: '#4a5568',
    marginBottom: '8px',
    flex: 1,
  },
  precio: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2b6cb0',
    marginBottom: '12px',
  },
  disponibleBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '12px',
  },
  agregarBtn: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    marginTop: '4px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    maxWidth: '450px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalTitle: {
    color: '#2d3748',
    marginBottom: '20px',
    textAlign: 'center',
  },
  modalBody: {
    marginBottom: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '12px',
  },
  label: {
    fontWeight: '600',
    color: '#2d3748',
    fontSize: '14px',
  },
  input: {
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    width: '100%',
  },
  totalContainer: {
    textAlign: 'center',
    padding: '12px',
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#2b6cb0',
  },
  modalFooter: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
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
  },
};

export default Servicios;