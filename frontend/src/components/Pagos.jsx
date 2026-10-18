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
  const [metodoPago, setMetodoPago] = useState('DEMO');
  const [tarjeta, setTarjeta] = useState({
    numero: '',
    titular: '',
    expiracion: '',
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

  const actualizarTarjeta = (event) => {
    const { name, value } = event.target;
    const digitLimits = { numero: 19, expiracion: 4, cvv: 4, cci: 20 };
    const nextValue = digitLimits[name]
      ? value.replace(/\D/g, '').slice(0, digitLimits[name])
      : value;
    setTarjeta((current) => ({ ...current, [name]: nextValue }));
  };

  const validarTarjetaDemo = () => {
    const numero = tarjeta.numero;
    if (numero.length < 13 || numero.length > 19 || !pasaValidacionLuhn(numero)) {
      return 'Ingresa un número de tarjeta válido.';
    }
    if (tarjeta.titular.trim().length < 3) {
      return 'Ingresa el nombre del titular.';
    }
    if (!/^\d{4}$/.test(tarjeta.expiracion)) {
      return 'Ingresa la fecha de vencimiento en formato MM/AA.';
    }

    const mes = Number(tarjeta.expiracion.slice(0, 2));
    const anio = 2000 + Number(tarjeta.expiracion.slice(2, 4));
    const hoy = new Date();
    if (mes < 1 || mes > 12 || anio < hoy.getFullYear()
        || (anio === hoy.getFullYear() && mes < hoy.getMonth() + 1)) {
      return 'La tarjeta está vencida o la fecha no es válida.';
    }
    if (!/^\d{3,4}$/.test(tarjeta.cvv)) {
      return 'El CVV debe tener 3 o 4 dígitos.';
    }
    if (tarjeta.cci && !/^\d{20}$/.test(tarjeta.cci)) {
      return 'El CCI debe tener 20 dígitos.';
    }
    return '';
  };

  const handlePago = async () => {
    setProcessing(true);
    setError('');
    setSuccess('');

    try {
      if (metodoPago === 'EFECTIVO') {
        setSuccess('La reserva sigue pendiente. El pago se registrará en recepción cuando llegues al hotel.');
        return;
      }

      const validationMessage = validarTarjetaDemo();
      if (validationMessage) {
        setError(validationMessage);
        return;
      }

      await api.post(`/pagos/demo/${reservaId}`);

      setSuccess('Pago de demostración registrado. No se realizó ningún cobro.');
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
          <h2 style={styles.title}>💳 Pago de reserva</h2>

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
              <option value="DEMO">Simulación local (sin cobro real)</option>
              <option value="EFECTIVO">💵 Efectivo (en hotel)</option>
            </select>
          </div>

          {metodoPago === 'DEMO' && (
            <>
              <div style={styles.demoNotice}>
                Modo de demostración: completa los campos para validar el formulario.
                Los datos se usan solo en esta pantalla; no se envían ni guardan y no
                se realiza ningún cobro.
              </div>
              <div style={styles.tarjetaContainer}>
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="card-number">Número de tarjeta *</label>
                  <input
                    id="card-number"
                    name="numero"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    value={tarjeta.numero}
                    onChange={actualizarTarjeta}
                    placeholder="Número de 13 a 19 dígitos"
                    required
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="card-holder">Titular *</label>
                  <input
                    id="card-holder"
                    name="titular"
                    type="text"
                    autoComplete="cc-name"
                    value={tarjeta.titular}
                    onChange={actualizarTarjeta}
                    placeholder="Nombre como aparece en la tarjeta"
                    required
                  />
                </div>
                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label} htmlFor="card-expiry">Vencimiento (MM/AA) *</label>
                    <input
                      id="card-expiry"
                      name="expiracion"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      value={tarjeta.expiracion.length > 2
                        ? `${tarjeta.expiracion.slice(0, 2)}/${tarjeta.expiracion.slice(2)}`
                        : tarjeta.expiracion}
                      onChange={actualizarTarjeta}
                      placeholder="MM/AA"
                      required
                    />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label} htmlFor="card-cvv">CVV *</label>
                    <input
                      id="card-cvv"
                      name="cvv"
                      type="password"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      value={tarjeta.cvv}
                      onChange={actualizarTarjeta}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="card-cci">CCI (opcional)</label>
                  <input
                    id="card-cci"
                    name="cci"
                    type="text"
                    inputMode="numeric"
                    value={tarjeta.cci}
                    onChange={actualizarTarjeta}
                    placeholder="20 dígitos"
                  />
                </div>
              </div>
            </>
          )}

          {metodoPago === 'EFECTIVO' && (
            <div style={styles.efectivoContainer}>
              <p style={styles.efectivoText}>
                💵 La reserva permanecerá pendiente hasta que el personal registre
                el pago en recepción.
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
              Volver a mis reservas
            </button>
            <button 
              className="btn-success"
              onClick={handlePago}
              disabled={processing}
            >
              {processing
                ? 'Procesando...'
                : metodoPago === 'DEMO'
                  ? 'Registrar simulación (sin cobro)'
                  : 'Dejar pendiente para pagar en el hotel'}
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
  tarjetaContainer: {
    padding: '16px',
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
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
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
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
  demoNotice: {
    padding: '16px',
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    marginBottom: '20px',
    color: '#744210',
    border: '1px solid #f6ad55',
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

function pasaValidacionLuhn(numero) {
  let suma = 0;
  let duplicar = false;
  for (let index = numero.length - 1; index >= 0; index -= 1) {
    let digito = Number(numero[index]);
    if (duplicar) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }
    suma += digito;
    duplicar = !duplicar;
  }
  return suma % 10 === 0;
}