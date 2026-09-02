// src/components/AdminPromociones.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from './Navbar';

const AdminPromociones = () => {
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    tipoDescuento: 'PORCENTAJE',
    valor: '',
    fechaInicio: '',
    fechaFin: ''
  });

  useEffect(() => {
    cargarPromociones();
  }, []);

  const cargarPromociones = async () => {
    try {
      const response = await api.get('/admin/promociones');
      setPromociones(response.data);
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
      await api.post('/admin/promociones', formData);
      alert('✅ Promoción creada exitosamente');
      setShowForm(false);
      setFormData({ codigo: '', nombre: '', descripcion: '', tipoDescuento: 'PORCENTAJE', valor: '', fechaInicio: '', fechaFin: '' });
      cargarPromociones();
    } catch (error) {
      alert('❌ Error al crear promoción');
    }
  };

  const togglePromocion = async (id, activo) => {
    try {
      await api.patch(`/admin/promociones/${id}/toggle`, { activo: !activo });
      cargarPromociones();
    } catch (error) {
      alert('❌ Error al cambiar estado');
    }
  };

  const eliminarPromocion = async (id) => {
    if (!window.confirm('¿Eliminar esta promoción?')) return;
    try {
      await api.delete(`/admin/promociones/${id}`);
      alert('✅ Promoción eliminada');
      cargarPromociones();
    } catch (error) {
      alert('❌ Error al eliminar');
    }
  };

  if (loading) return <><Navbar /><div className="loading-spinner">Cargando...</div></>;

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>🎯 Gestión de Promociones</h2>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✖ Cerrar' : '➕ Nueva Promoción'}
          </button>
        </div>

        {showForm && (
          <div className="card" style={styles.formCard}>
            <h3>Nueva Promoción</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.row}>
                <div style={styles.field}>
                  <label>Código *</label>
                  <input name="codigo" value={formData.codigo} onChange={handleChange} required placeholder="PROMO10" />
                </div>
                <div style={styles.field}>
                  <label>Nombre *</label>
                  <input name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
              </div>
              <div style={styles.field}>
                <label>Descripción</label>
                <input name="descripcion" value={formData.descripcion} onChange={handleChange} />
              </div>
              <div style={styles.row}>
                <div style={styles.field}>
                  <label>Tipo Descuento *</label>
                  <select name="tipoDescuento" value={formData.tipoDescuento} onChange={handleChange}>
                    <option value="PORCENTAJE">Porcentaje (%)</option>
                    <option value="MONTO_FIJO">Monto Fijo (S/)</option>
                  </select>
                </div>
                <div style={styles.field}>
                  <label>Valor *</label>
                  <input type="number" step="0.01" name="valor" value={formData.valor} onChange={handleChange} required />
                </div>
              </div>
              <div style={styles.row}>
                <div style={styles.field}>
                  <label>Fecha Inicio *</label>
                  <input type="date" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} required />
                </div>
                <div style={styles.field}>
                  <label>Fecha Fin *</label>
                  <input type="date" name="fechaFin" value={formData.fechaFin} onChange={handleChange} required />
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
          {promociones.map((p) => (
            <div key={p.id} className="card" style={styles.promocionCard}>
              <div style={styles.cardHeader}>
                <h4>{p.nombre}</h4>
                <span style={{ ...styles.activoBadge, backgroundColor: p.activo ? '#48bb78' : '#fc8181' }}>
                  {p.activo ? '✅ Activa' : '❌ Inactiva'}
                </span>
              </div>
              <p><strong>Código:</strong> {p.codigo}</p>
              <p><strong>Descuento:</strong> {p.tipoDescuento === 'PORCENTAJE' ? `${p.valor}%` : `S/${p.valor}`}</p>
              <p><strong>Vigencia:</strong> {p.fechaInicio} al {p.fechaFin}</p>
              <p><strong>Descripción:</strong> {p.descripcion || 'N/A'}</p>
              <div style={styles.buttonContainer}>
                <button className="btn-primary" onClick={() => togglePromocion(p.id, p.activo)}>
                  {p.activo ? 'Desactivar' : 'Activar'}
                </button>
                <button className="btn-danger" onClick={() => eliminarPromocion(p.id)}>🗑️ Eliminar</button>
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
  promocionCard: {
    padding: '16px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  activoBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
  buttonContainer: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
};

export default AdminPromociones;