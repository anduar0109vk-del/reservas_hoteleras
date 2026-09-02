// src/components/AgregarServicios.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from './Navbar';

const AgregarServicios = () => {
  const { reservaId } = useParams();
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [reserva, setReserva] = useState(null);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [reservaId]);

  const cargarDatos = async () => {
    try {
      const [reservaRes, serviciosRes] = await Promise.all([
        api.get(`/reservas/${reservaId}`),
        api.get('/servicios/disponibles')
      ]);
      setReserva(reservaRes.data);
      setServicios(serviciosRes.data);
    } catch (error) {
      setError('Error al cargar datos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleServicio = (servicioId) => {
    setServiciosSeleccionados(prev => {
      if (prev.includes(servicioId)) {
        return prev.filter(id => id !== servicioId);
      } else {
        return [...prev, servicioId];
      }
    });
  };

  const agregarServicios = async () => {
    if (serviciosSeleccionados.length === 0) {
      alert('Selecciona al menos un servicio');
      return;
    }

    setEnviando(true);
    setError('');
    setSuccess('');

    try {
      for (const servicioId of serviciosSeleccionados) {
        await api.post(`/reservas/${reservaId}/servicios`, {
          servicioId: servicioId,
          cantidad: 1
        });
      }
      setSuccess('✅ Servicios agregados exitosamente');
      setTimeout(() => navigate(`/mis-reservas`), 2000);
    } catch (error) {
      setError('Error al agregar servicios');
      console.error(error);
    } finally {
      setEnviando(false);
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-spinner">Cargando servicios...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div className="card" style={styles.card}>
          <h2 style={styles.title}>🛎️ Agregar Servicios</h2>
          <p style={styles.subtitle}>Reserva: {reserva?.codigoReserva}</p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div style={styles.resumen}>
            <h4>Resumen de la Reserva</h4>
            <p><strong>Habitación:</strong> N° {reserva?.habitacion?.numero}</p>
            <p><strong>Cliente:</strong> {reserva?.cliente?.usuario?.nombres}</p>
            <p><strong>Total actual:</strong> S/{reserva?.montoTotal}</p>
          </div>

          <div style={styles.serviciosGrid}>
            {servicios.map((s) => (
              <div
                key={s.id}
                className="card"
                style={{
                  ...styles.servicioCard,
                  border: serviciosSeleccionados.includes(s.id) ? '2px solid #48bb78' : '1px solid #e2e8f0'
                }}
                onClick={() => toggleServicio(s.id)}
              >
                <div style={styles.servicioHeader}>
                  <span style={styles.servicioIcon}>{getCategoriaEmoji(s.categoria)}</span>
                  <span style={styles.servicioCategoria}>{s.categoria}</span>
                </div>
                <h4 style={styles.servicioNombre}>{s.nombre}</h4>
                <p style={styles.servicioDescripcion}>{s.descripcion || 'Sin descripción'}</p>
                <p style={styles.servicioPrecio}>S/{s.precio}</p>
                {serviciosSeleccionados.includes(s.id) && (
                  <span style={styles.seleccionado}>✅ Seleccionado</span>
                )}
              </div>
            ))}
          </div>

          <div style={styles.buttonContainer}>
            <button 
              className="btn-danger" 
              onClick={() => navigate('/mis-reservas')}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button 
              className="btn-success" 
              onClick={agregarServicios}
              disabled={enviando || serviciosSeleccionados.length === 0}
            >
              {enviando ? 'Agregando...' : `Agregar ${serviciosSeleccionados.length} servicio(s)`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '0 20px',
  },
  card: {
    padding: '32px',
  },
  title: {
    textAlign: 'center',
    color: '#2d3748',
    marginBottom: '8px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#4a5568',
    marginBottom: '24px',
  },
  resumen: {
    backgroundColor: '#f7fafc',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  serviciosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  servicioCard: {
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
  },
  servicioHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  servicioIcon: {
    fontSize: '24px',
  },
  servicioCategoria: {
    fontSize: '11px',
    color: '#718096',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  servicioNombre: {
    fontSize: '16px',
    color: '#2d3748',
    marginBottom: '4px',
  },
  servicioDescripcion: {
    fontSize: '13px',
    color: '#4a5568',
    marginBottom: '4px',
  },
  servicioPrecio: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2b6cb0',
  },
  seleccionado: {
    display: 'inline-block',
    marginTop: '8px',
    padding: '4px 12px',
    backgroundColor: '#c6f6d5',
    color: '#276749',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  buttonContainer: {
    display: 'flex',
    gap: '12px',
  },
};

export default AgregarServicios;