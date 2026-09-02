// src/components/NuevaReserva.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from './Navbar';

const NuevaReserva = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const habitacionSeleccionada = location.state?.habitacion;

  const [habitaciones, setHabitaciones] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cargandoClientes, setCargandoClientes] = useState(false);
  const [formData, setFormData] = useState({
    clienteId: '',
    habitacionId: habitacionSeleccionada?.id || '',
    fechaEntrada: new Date().toISOString().split('T')[0],
    fechaSalida: '',
    numeroHuespedes: 1,
    codigoPromocion: '',
    metodoPago: 'TARJETA'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [enviando, setEnviando] = useState(false);

  const isAdmin = user?.rol === 'ADMIN';
  const isGerente = user?.rol === 'GERENTE';
  const isRecepcionista = user?.rol === 'RECEPCIONISTA';
  const isCliente = user?.rol === 'CLIENTE';
  const puedeSeleccionarCliente = isAdmin || isGerente || isRecepcionista;

  // Cargar habitaciones disponibles
  useEffect(() => {
    cargarHabitacionesDisponibles();
  }, []);

  // Cargar clientes para ADMIN, GERENTE, RECEPCIONISTA
  useEffect(() => {
    if (puedeSeleccionarCliente) {
      cargarClientes();
    } else if (isCliente) {
      obtenerClienteLogueado();
    }
  }, [user]);

  const cargarHabitacionesDisponibles = async () => {
    try {
      const response = await api.get('/habitaciones/disponibles');
      setHabitaciones(response.data);
    } catch (error) {
      console.error('Error cargando habitaciones:', error);
      setError('Error al cargar las habitaciones');
    }
  };

  const cargarClientes = async () => {
    setCargandoClientes(true);
    try {
      // ✅ Usar el nuevo endpoint /api/clientes (accesible para ADMIN, GERENTE, RECEPCIONISTA)
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Error cargando clientes:', error);
      setError('Error al cargar la lista de clientes');
    } finally {
      setCargandoClientes(false);
      setLoading(false);
    }
  };

  const obtenerClienteLogueado = async () => {
    try {
      const response = await api.get(`/clientes/usuario/${user?.email}`);
      const cliente = response.data;
      setFormData(prev => ({ ...prev, clienteId: cliente.id }));
    } catch (error) {
      console.error('Error obteniendo cliente:', error);
      setError('No se encontró el cliente. Por favor, contacta al administrador.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setEnviando(true);

    // Validar fechas
    const entrada = new Date(formData.fechaEntrada);
    const salida = new Date(formData.fechaSalida);
    
    if (!formData.fechaSalida) {
      setError('❌ Por favor, selecciona una fecha de salida');
      setEnviando(false);
      return;
    }

    if (salida <= entrada) {
      setError('❌ La fecha de salida debe ser posterior a la fecha de entrada');
      setEnviando(false);
      return;
    }

    if (!formData.clienteId) {
      setError('❌ Por favor, selecciona un cliente');
      setEnviando(false);
      return;
    }

    try {
      const response = await api.post('/reservas', formData);
      setSuccess(`✅ Reserva creada exitosamente! Código: ${response.data.codigoReserva}`);
      setTimeout(() => navigate('/mis-reservas'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear la reserva');
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-spinner">Cargando información...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div className="card" style={styles.card}>
          <h2 style={styles.title}>📝 Nueva Reserva</h2>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Cliente - Solo para ADMIN, GERENTE, RECEPCIONISTA */}
            {puedeSeleccionarCliente && (
              <div style={styles.field}>
                <label style={styles.label}>Selecciona un Cliente *</label>
                <select
                  name="clienteId"
                  value={formData.clienteId}
                  onChange={handleChange}
                  style={styles.input}
                  required
                >
                  <option value="">-- Selecciona un cliente --</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.usuario?.nombres} {c.usuario?.apellidos} - {c.usuario?.email}
                    </option>
                  ))}
                </select>
                {cargandoClientes && <span style={styles.helpText}>Cargando clientes...</span>}
              </div>
            )}

            {/* Habitación */}
            <div style={styles.field}>
              <label style={styles.label}>Selecciona una habitación *</label>
              <select
                name="habitacionId"
                value={formData.habitacionId}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">-- Selecciona una habitación --</option>
                {habitaciones.map((h) => (
                  <option key={h.id} value={h.id}>
                    N° {h.numero} - {h.tipoHabitacion?.nombre} - S/{h.precioActual}
                  </option>
                ))}
              </select>
            </div>

            {/* Fechas */}
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Fecha Entrada *</label>
                <input
                  type="date"
                  name="fechaEntrada"
                  value={formData.fechaEntrada}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Fecha Salida *</label>
                <input
                  type="date"
                  name="fechaSalida"
                  value={formData.fechaSalida}
                  onChange={handleChange}
                  style={styles.input}
                  min={formData.fechaEntrada}
                  required
                />
              </div>
            </div>

            {/* Huéspedes */}
            <div style={styles.field}>
              <label style={styles.label}>Número de Huéspedes</label>
              <input
                type="number"
                name="numeroHuespedes"
                value={formData.numeroHuespedes}
                onChange={handleChange}
                style={styles.input}
                min="1"
                max="10"
              />
            </div>

            {/* Promoción */}
            <div style={styles.field}>
              <label style={styles.label}>Código de Promoción</label>
              <input
                type="text"
                name="codigoPromocion"
                value={formData.codigoPromocion}
                onChange={handleChange}
                style={styles.input}
                placeholder="Ej: PROMO10"
              />
            </div>

            {/* Método de Pago */}
            <div style={styles.field}>
              <label style={styles.label}>Método de Pago *</label>
              <select
                name="metodoPago"
                value={formData.metodoPago}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="TARJETA">💳 Tarjeta</option>
                <option value="YAPE">📱 Yape</option>
                <option value="PLIN">📱 Plin</option>
                <option value="EFECTIVO">💵 Efectivo</option>
              </select>
            </div>

            {/* Botones */}
            <div style={styles.buttonRow}>
              <button type="button" className="btn-danger" onClick={() => navigate('/dashboard')}>
                Cancelar
              </button>
              <button type="submit" className="btn-success" disabled={enviando}>
                {enviando ? 'Creando...' : 'Crear Reserva'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
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
  helpText: {
    fontSize: '12px',
    color: '#718096',
    marginTop: '2px',
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
};

export default NuevaReserva;