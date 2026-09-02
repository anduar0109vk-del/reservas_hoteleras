// src/components/AdminServicios.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from './Navbar';

const AdminServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'COMIDA',
    descripcion: '',
    precio: '',
    urlImagen: ''
  });

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    try {
      const response = await api.get('/admin/servicios');
      setServicios(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/servicios', formData);
      alert('✅ Servicio creado exitosamente');
      setShowForm(false);
      setFormData({ nombre: '', categoria: 'COMIDA', descripcion: '', precio: '', urlImagen: '' });
      cargarServicios();
    } catch (error) {
      alert('❌ Error al crear servicio');
    }
  };

  const toggleDisponibilidad = async (id, disponible) => {
    try {
      await api.patch(`/admin/servicios/${id}/toggle`, { disponible: !disponible });
      cargarServicios();
    } catch (error) {
      alert('❌ Error al cambiar disponibilidad');
    }
  };

  const eliminarServicio = async (id) => {
    if (!window.confirm('¿Eliminar este servicio?')) return;
    try {
      await api.delete(`/admin/servicios/${id}`);
      alert('✅ Servicio eliminado');
      cargarServicios();
    } catch (error) {
      alert('❌ Error al eliminar');
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

  if (loading) return <><Navbar /><div className="loading-spinner">Cargando...</div></>;

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>🛎️ Gestión de Servicios</h2>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✖ Cerrar' : '➕ Nuevo Servicio'}
          </button>
        </div>

        {showForm && (
          <div className="card" style={styles.formCard}>
            <h3>Nuevo Servicio</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.row}>
                <div style={styles.field}>
                  <label>Nombre *</label>
                  <input name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div style={styles.field}>
                  <label>Categoría *</label>
                  <select name="categoria" value={formData.categoria} onChange={handleChange}>
                    <option value="COMIDA">🍽️ Comida</option>
                    <option value="BEBIDA">🥤 Bebida</option>
                    <option value="ENTRETENIMIENTO">🎮 Entretenimiento</option>
                    <option value="OTRO">📦 Otro</option>
                  </select>
                </div>
              </div>
              <div style={styles.field}>
                <label>Descripción</label>
                <input name="descripcion" value={formData.descripcion} onChange={handleChange} />
              </div>
              <div style={styles.row}>
                <div style={styles.field}>
                  <label>Precio (S/) *</label>
                  <input type="number" step="0.01" name="precio" value={formData.precio} onChange={handleChange} required />
                </div>
                <div style={styles.field}>
                  <label>URL Imagen</label>
                  <input name="urlImagen" value={formData.urlImagen} onChange={handleChange} placeholder="https://ejemplo.com/imagen.jpg" />
                </div>
              </div>
              <div style={styles.buttonRow}>
                <button type="button" className="btn-danger" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn-success">Crear</button>
              </div>
            </form>
          </div>
        )}

        <div style={styles.grid}>
          {servicios.map((s) => (
            <div key={s.id} className="card" style={styles.servicioCard}>
              <div style={styles.cardHeader}>
                <h4>{getCategoriaEmoji(s.categoria)} {s.nombre}</h4>
                <span style={{ ...styles.disponibleBadge, backgroundColor: s.disponible ? '#48bb78' : '#fc8181' }}>
                  {s.disponible ? '✅ Disponible' : '❌ No disponible'}
                </span>
              </div>
              <p><strong>Categoría:</strong> {s.categoria}</p>
              <p><strong>Descripción:</strong> {s.descripcion || 'N/A'}</p>
              <p><strong>Precio:</strong> S/{s.precio}</p>
              {s.urlImagen && <img src={s.urlImagen} alt={s.nombre} style={styles.imagen} />}
              <div style={styles.buttonContainer}>
                <button className="btn-primary" onClick={() => toggleDisponibilidad(s.id, s.disponible)}>
                  {s.disponible ? 'Desactivar' : 'Activar'}
                </button>
                <button className="btn-danger" onClick={() => eliminarServicio(s.id)}>🗑️ Eliminar</button>
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
  servicioCard: {
    padding: '16px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  disponibleBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
  imagen: {
    maxWidth: '100%',
    maxHeight: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginTop: '8px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
};

export default AdminServicios;