// src/components/AdminUsuarios.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from './Navbar';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    email: '',
    telefono: '',
    password: '',
    rol: 'CLIENTE'
  });
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await api.get('/admin/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      setError('Error al cargar usuarios');
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
      await api.post('/auth/registro', formData);
      alert('✅ Usuario creado exitosamente');
      setShowForm(false);
      setFormData({
        nombres: '',
        apellidos: '',
        tipoDocumento: 'DNI',
        numeroDocumento: '',
        email: '',
        telefono: '',
        password: '',
        rol: 'CLIENTE'
      });
      cargarUsuarios();
    } catch (error) {
      alert('❌ Error al crear usuario: ' + (error.response?.data?.message || 'Error desconocido'));
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    try {
      await api.delete(`/admin/usuarios/${id}`);
      alert('✅ Usuario eliminado');
      cargarUsuarios();
    } catch (error) {
      alert('❌ Error al eliminar');
    }
  };

  const getRolColor = (rol) => {
    const colors = {
      'ADMIN': '#fc8181',
      'GERENTE': '#f6ad55',
      'RECEPCIONISTA': '#48bb78',
      'CLIENTE': '#63b3ed'
    };
    return colors[rol] || '#a0aec0';
  };

  if (loading) return <><Navbar /><div className="loading-spinner">Cargando...</div></>;

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>👥 Gestión de Usuarios</h2>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✖ Cerrar' : '➕ Nuevo Usuario'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <div className="card" style={styles.formCard}>
            <h3>Registrar Nuevo Usuario</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.row}>
                <div style={styles.field}>
                  <label>Nombres *</label>
                  <input name="nombres" value={formData.nombres} onChange={handleChange} required />
                </div>
                <div style={styles.field}>
                  <label>Apellidos *</label>
                  <input name="apellidos" value={formData.apellidos} onChange={handleChange} required />
                </div>
              </div>
              <div style={styles.row}>
                <div style={styles.field}>
                  <label>Tipo Documento</label>
                  <select name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange}>
                    <option value="DNI">DNI</option>
                    <option value="CE">CE</option>
                    <option value="PASAPORTE">Pasaporte</option>
                  </select>
                </div>
                <div style={styles.field}>
                  <label>Número Documento *</label>
                  <input name="numeroDocumento" value={formData.numeroDocumento} onChange={handleChange} required />
                </div>
              </div>
              <div style={styles.field}>
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div style={styles.row}>
                <div style={styles.field}>
                  <label>Teléfono</label>
                  <input name="telefono" value={formData.telefono} onChange={handleChange} />
                </div>
                <div style={styles.field}>
                  <label>Contraseña *</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
              </div>
              <div style={styles.field}>
                <label>Rol *</label>
                <select name="rol" value={formData.rol} onChange={handleChange}>
                  <option value="ADMIN">Administrador</option>
                  <option value="GERENTE">Gerente</option>
                  <option value="RECEPCIONISTA">Recepcionista</option>
                  <option value="CLIENTE">Cliente</option>
                </select>
              </div>
              <div style={styles.buttonRow}>
                <button type="button" className="btn-danger" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn-success">Registrar</button>
              </div>
            </form>
          </div>
        )}

        <div style={styles.grid}>
          {usuarios.map((u) => (
            <div key={u.id} className="card" style={styles.userCard}>
              <div style={styles.userHeader}>
                <span style={styles.userAvatar}>{u.nombres?.charAt(0) || 'U'}</span>
                <div style={styles.userInfo}>
                  <h4>{u.nombres} {u.apellidos}</h4>
                  <span style={{ ...styles.userRol, backgroundColor: getRolColor(u.rol?.nombre) }}>
                    {u.rol?.nombre || 'Sin rol'}
                  </span>
                </div>
              </div>
              <p><strong>Email:</strong> {u.email}</p>
              <p><strong>Documento:</strong> {u.numeroDocumento}</p>
              <p><strong>Teléfono:</strong> {u.telefono || 'N/A'}</p>
              <p><strong>Estado:</strong> {u.activo ? '✅ Activo' : '❌ Inactivo'}</p>
              <div style={styles.buttonContainer}>
                <button className="btn-danger" onClick={() => eliminarUsuario(u.id)}>🗑️ Eliminar</button>
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  userCard: {
    padding: '16px',
  },
  userHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  userAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#4299e1',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userRol: {
    display: 'inline-block',
    padding: '2px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    color: 'white',
  },
  buttonContainer: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
};

export default AdminUsuarios;