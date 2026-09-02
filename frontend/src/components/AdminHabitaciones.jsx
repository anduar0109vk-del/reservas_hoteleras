// src/components/AdminHabitaciones.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from './Navbar';

const AdminHabitaciones = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    numero: '',
    piso: '',
    tipoHabitacionId: '',
    precioActual: '',
    destacada: false
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [habRes, tiposRes] = await Promise.all([
        api.get('/habitaciones'),
        api.get('/admin/tipos-habitacion')
      ]);
      setHabitaciones(habRes.data);
      setTipos(tiposRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/habitaciones', formData);
      alert('✅ Habitación creada exitosamente');
      setShowForm(false);
      setFormData({ numero: '', piso: '', tipoHabitacionId: '', precioActual: '', destacada: false });
      cargarDatos();
    } catch (error) {
      alert('❌ Error al crear habitación');
    }
  };

  const eliminarHabitacion = async (id) => {
    if (!window.confirm('¿Eliminar esta habitación?')) return;
    try {
      await api.delete(`/admin/habitaciones/${id}`);
      alert('✅ Habitación eliminada');
      cargarDatos();
    } catch (error) {
      alert('❌ Error al eliminar');
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await api.patch(`/admin/habitaciones/${id}/estado?estado=${estado}`);
      cargarDatos();
    } catch (error) {
      alert('❌ Error al cambiar estado');
    }
  };

  if (loading) return <><Navbar /><div className="loading-spinner">Cargando...</div></>;

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>🛏️ Gestión de Habitaciones</h2>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✖ Cerrar' : '➕ Nueva Habitación'}
          </button>
        </div>

        {showForm && (
          <div className="card" style={styles.formCard}>
            <h3>Nueva Habitación</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.row}>
                <div style={styles.field}>
                  <label>Número *</label>
                  <input name="numero" value={formData.numero} onChange={handleChange} required />
                </div>
                <div style={styles.field}>
                  <label>Piso *</label>
                  <input type="number" name="piso" value={formData.piso} onChange={handleChange} required />
                </div>
              </div>
              <div style={styles.row}>
                <div style={styles.field}>
                  <label>Tipo *</label>
                  <select name="tipoHabitacionId" value={formData.tipoHabitacionId} onChange={handleChange} required>
                    <option value="">Seleccionar</option>
                    {tipos.map(t => (
                      <option key={t.id} value={t.id}>{t.nombre}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.field}>
                  <label>Precio *</label>
                  <input type="number" step="0.01" name="precioActual" value={formData.precioActual} onChange={handleChange} required />
                </div>
              </div>
              <div style={styles.field}>
                <label>
                  <input type="checkbox" name="destacada" checked={formData.destacada} onChange={handleChange} />
                  Destacada
                </label>
              </div>
              <div style={styles.buttonRow}>
                <button type="button" className="btn-danger" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn-success">Crear</button>
              </div>
            </form>
          </div>
        )}

        <div style={styles.grid}>
          {habitaciones.map((h) => (
            <div key={h.id} className="card" style={styles.habitacionCard}>
              <div style={styles.cardHeader}>
                <h4>Habitación {h.numero}</h4>
                <span style={{ ...styles.estadoBadge, backgroundColor: h.estado === 'DISPONIBLE' ? '#48bb78' : '#fc8181' }}>
                  {h.estado}
                </span>
              </div>
              <p><strong>Tipo:</strong> {h.tipoHabitacion?.nombre}</p>
              <p><strong>Piso:</strong> {h.piso}</p>
              <p><strong>Precio:</strong> S/{h.precioActual}</p>
              <p><strong>Capacidad:</strong> {h.tipoHabitacion?.capacidad} personas</p>
              <p><strong>Veces reservada:</strong> {h.vecesReservada}</p>
              {h.destacada && <p style={styles.destacada}>⭐ Destacada</p>}
              <div style={styles.buttonContainer}>
                <select onChange={(e) => cambiarEstado(h.id, e.target.value)} style={styles.estadoSelect}>
                  <option value="DISPONIBLE">Disponible</option>
                  <option value="OCUPADA">Ocupada</option>
                  <option value="MANTENIMIENTO">Mantenimiento</option>
                  <option value="LIMPIEZA">Limpieza</option>
                </select>
                <button className="btn-danger" onClick={() => eliminarHabitacion(h.id)}>🗑️ Eliminar</button>
              </div>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  title: {
    color: '#2d3748',
  },
  formCard: {
    padding: '24px',
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
  buttonRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  habitacionCard: {
    padding: '16px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  estadoBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
  destacada: {
    color: '#dd6b20',
    fontWeight: 'bold',
  },
  buttonContainer: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
  estadoSelect: {
    flex: 1,
    padding: '6px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
  },
};

export default AdminHabitaciones;