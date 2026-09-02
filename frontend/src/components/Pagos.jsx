// src/components/Pagos.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from './Navbar';

const Pagos = () => {
  const { reservaId } = useParams();
  const navigate = useNavigate();
  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [metodoPago, setMetodoPago] = useState('TARJETA');

  // Datos de tarjeta
  const [tarjeta, setTarjeta] = useState({
    numero: '',
    nombre: '',
    fechaExpiracion: '',
    cvv: '',
    cci: ''
  });

  useEffect(() => {
    cargarReserva();
  }, [reservaId]);

  const cargarReserva = async () => {
    try {
      const response = await api.get(`/reservas/${reservaId}`);
      setReserva(response.data);
    } catch (error) {
      setError('Error al cargar la reserva');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTarjetaChange = (e) => {
    const { name, value } = e.target;
    setTarjeta(prev => ({ ...prev, [name]: value }));
  };

  const formatearNumeroTarjeta = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(' ');
  };

  const formatearFechaExpiracion = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
  };

  const handleNumeroTarjetaChange = (e) => {
    const formatted = formatearNumeroTarjeta(e.target.value);
    setTarjeta(prev => ({ ...prev, numero: formatted }));
  };

  const handleFechaExpiracionChange = (e) => {
    const formatted = formatearFechaExpiracion(e.target.value);
    setTarjeta(prev => ({ ...prev, fechaExpiracion: formatted }));
  };

  const handlePago = async () => {
    setProcessing(true);
    setError('');
    setSuccess('');

    try {
      // Validar datos de tarjeta
      if (metodoPago === 'TARJETA') {
        const numeroLimpio = tarjeta.numero.replace(/\s/g, '');
        if (numeroLimpio.length < 16) {
          setError('Número de tarjeta inválido (debe tener 16 dígitos)');
          setProcessing(false);
          return;
        }
        if (tarjeta.cvv.length < 3) {
          setError('CVV inválido (debe tener 3 dígitos)');
          setProcessing(false);
          return;
        }
        if (tarjeta.nombre.length < 3) {
          setError('Nombre del titular es obligatorio');
          setProcessing(false);
          return;
        }
      }

      const response = await api.post(`/pagos/crear-intent/${reservaId}`);
      const { clientSecret } = response.data;

      // Simular pago exitoso (en producción usar Stripe Elements)
      await api.post('/pagos/confirmar', {
        paymentIntentId: clientSecret.split('_secret_')[0]
      });

      setSuccess('✅ Pago realizado exitosamente');
      setTimeout(() => navigate('/mis-reservas'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error al procesar el pago');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-spinner">Cargando información de pago...</div>
      </>
    );
  }

  if (!reserva) {
    return (
      <>
        <Navbar />
        <div className="error-message">Reserva no encontrada</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div className="card" style={styles.card}>
          <h2 style={styles.title}>💳 Realizar Pago</h2>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {/* Resumen de la reserva */}
          <div style={styles.resumen}>
            <h3 style={styles.subtitle}>Resumen de la Reserva</h3>
            <div style={styles.resumenGrid}>
              <div style={styles.resumenItem}>
                <span style={styles.resumenLabel}>Código:</span>
                <span style={styles.resumenValue}>{reserva.codigoReserva}</span>
              </div>
              <div style={styles.resumenItem}>
                <span style={styles.resumenLabel}>Habitación:</span>
                <span style={styles.resumenValue}>N° {reserva.habitacion?.numero}</span>
              </div>
              <div style={styles.resumenItem}>
                <span style={styles.resumenLabel}>Tipo:</span>
                <span style={styles.resumenValue}>{reserva.habitacion?.tipoHabitacion?.nombre}</span>
              </div>
              <div style={styles.resumenItem}>
                <span style={styles.resumenLabel}>Entrada:</span>
                <span style={styles.resumenValue}>{reserva.fechaEntrada}</span>
              </div>
              <div style={styles.resumenItem}>
                <span style={styles.resumenLabel}>Salida:</span>
                <span style={styles.resumenValue}>{reserva.fechaSalida}</span>
              </div>
              <div style={styles.resumenItem}>
                <span style={styles.resumenLabel}>Huéspedes:</span>
                <span style={styles.resumenValue}>{reserva.numeroHuespedes}</span>
              </div>
            </div>

            <div style={styles.totalContainer}>
              <span style={styles.totalLabel}>Total a pagar:</span>
              <span style={styles.totalValue}>S/{reserva.montoTotal}</span>
            </div>
          </div>

          {/* Método de pago */}
          <div style={styles.metodoContainer}>
            <label style={styles.metodoLabel}>Selecciona método de pago:</label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              style={styles.metodoSelect}
            >
              <option value="TARJETA">💳 Tarjeta (Stripe)</option>
              <option value="YAPE">📱 Yape</option>
              <option value="PLIN">📱 Plin</option>
              <option value="EFECTIVO">💵 Efectivo (en hotel)</option>
            </select>
          </div>

          {/* Formulario de tarjeta */}
          {metodoPago === 'TARJETA' && (
            <div style={styles.tarjetaContainer}>
              <h4 style={styles.tarjetaTitle}>Datos de la Tarjeta</h4>
              
              <div style={styles.field}>
                <label style={styles.label}>Número de Tarjeta *</label>
                <input
                  type="text"
                  name="numero"
                  value={tarjeta.numero}
                  onChange={handleNumeroTarjetaChange}
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Nombre del Titular *</label>
                <input
                  type="text"
                  name="nombre"
                  value={tarjeta.nombre}
                  onChange={handleTarjetaChange}
                  style={styles.input}
                  placeholder="JUAN PEREZ"
                  required
                />
              </div>

              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>Fecha Expiración *</label>
                  <input
                    type="text"
                    name="fechaExpiracion"
                    value={tarjeta.fechaExpiracion}
                    onChange={handleFechaExpiracionChange}
                    style={styles.input}
                    placeholder="MM/AA"
                    maxLength="5"
                    required
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>CVV *</label>
                  <input
                    type="password"
                    name="cvv"
                    value={tarjeta.cvv}
                    onChange={handleTarjetaChange}
                    style={styles.input}
                    placeholder="123"
                    maxLength="4"
                    required
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>CCI (Código de Cuenta Interbancaria)</label>
                <input
                  type="text"
                  name="cci"
                  value={tarjeta.cci}
                  onChange={handleTarjetaChange}
                  style={styles.input}
                  placeholder="12345678901234567890"
                  maxLength="20"
                />
                <span style={styles.helpText}>Opcional para transferencias</span>
              </div>
            </div>
          )}

          {/* Yape / Plin */}
          {(metodoPago === 'YAPE' || metodoPago === 'PLIN') && (
            <div style={styles.yapeContainer}>
              <p style={styles.yapeText}>
                📱 Escanea el código QR o usa el número:
              </p>
              <div style={styles.yapeNumber}>
                <span>📞 999 888 777</span>
              </div>
              <div style={styles.qrPlaceholder}>
                <span style={styles.qrIcon}>📱</span>
                <p>Escanea el código QR desde tu aplicación</p>
              </div>
            </div>
          )}

          {/* Efectivo */}
          {metodoPago === 'EFECTIVO' && (
            <div style={styles.efectivoContainer}>
              <p style={styles.efectivoText}>
                💵 El pago se realizará al llegar al hotel.
              </p>
              <p>Presenta este código al recepcionista:</p>
              <div style={styles.codigoReservaPago}>
                <strong>{reserva.codigoReserva}</strong>
              </div>
            </div>
          )}

          <div style={styles.buttonRow}>
            <button 
              className="btn-danger"
              onClick={() => navigate('/mis-reservas')}
              disabled={processing}
            >
              Cancelar
            </button>
            <button 
              className="btn-success"
              onClick={handlePago}
              disabled={processing}
            >
              {processing ? 'Procesando...' : `Pagar S/${reserva.montoTotal}`}
            </button>
          </div>
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
  subtitle: {
    color: '#2d3748',
    marginBottom: '16px',
    fontSize: '18px',
  },
  resumen: {
    backgroundColor: '#f7fafc',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  resumenGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginBottom: '16px',
  },
  resumenItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  resumenLabel: {
    color: '#718096',
    fontSize: '13px',
  },
  resumenValue: {
    color: '#2d3748',
    fontSize: '13px',
    fontWeight: '500',
  },
  totalContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '12px',
    borderTop: '2px solid #4299e1',
  },
  totalLabel: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2d3748',
  },
  totalValue: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#2b6cb0',
  },
  metodoContainer: {
    marginBottom: '20px',
  },
  metodoLabel: {
    display: 'block',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px',
  },
  metodoSelect: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: 'white',
  },
  tarjetaContainer: {
    padding: '16px',
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  tarjetaTitle: {
    marginBottom: '12px',
    color: '#2d3748',
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
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  helpText: {
    fontSize: '12px',
    color: '#718096',
    marginTop: '2px',
  },
  yapeContainer: {
    padding: '16px',
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  yapeText: {
    fontSize: '16px',
    color: '#2d3748',
  },
  yapeNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2b6cb0',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '8px',
    margin: '12px 0',
  },
  qrPlaceholder: {
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '2px dashed #e2e8f0',
  },
  qrIcon: {
    fontSize: '48px',
    display: 'block',
  },
  efectivoContainer: {
    padding: '16px',
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  efectivoText: {
    fontSize: '16px',
    color: '#2d3748',
  },
  codigoReservaPago: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2b6cb0',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '8px',
    margin: '12px 0',
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
  },
};

export default Pagos;