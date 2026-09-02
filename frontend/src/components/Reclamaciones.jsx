import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const estados = ['PENDIENTE', 'EN_PROCESO', 'RESUELTO'];

export default function Reclamaciones() {
  const { user } = useAuth();
  const personal = ['ADMIN', 'GERENTE', 'RECEPCIONISTA'].includes(user?.rol);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    nombresReclamante: user?.nombres || '', tipoDocumento: 'DNI', numeroDocumento: '',
    email: user?.email || '', telefono: '', tipo: 'RECLAMO', detalle: '', pedidoCliente: ''
  });
  const [message, setMessage] = useState('');

  const cargar = async () => {
    const response = await api.get(personal ? '/reclamos' : '/reclamos/mis-reclamos');
    setItems(response.data || []);
  };
  useEffect(() => { cargar().catch(() => setMessage('No se pudieron cargar los reclamos.')); }, [personal]);
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const enviar = async (event) => {
    event.preventDefault(); setMessage('');
    try {
      await api.post('/reclamos', form);
      setMessage('Reclamo registrado correctamente. Guarda tu número para hacer seguimiento.');
      setForm({ ...form, detalle: '', pedidoCliente: '' }); await cargar();
    } catch (error) { setMessage(error.response?.data?.message || 'Revisa los datos ingresados.'); }
  };
  const actualizar = async (item, estado) => {
    const respuesta = window.prompt('Respuesta al cliente (opcional):', item.respuesta || '');
    if (respuesta === null) return;
    await api.patch(`/reclamos/${item.id}/estado`, { estado, respuesta });
    cargar();
  };
  return <><Navbar /><main style={styles.page}>
    <header style={styles.hero}>
      <div style={styles.heroIcon}>📖</div>
      <div><h1 style={styles.title}>Libro de reclamaciones</h1>
      <p style={styles.subtitle}>Tu opinión nos ayuda a mejorar. Registra y consulta el estado de tus solicitudes.</p></div>
    </header>
    {message && <p role="status" style={styles.message}>{message}</p>}
    <form className="card reclamos-form" onSubmit={enviar} style={styles.form}>
      <h2 style={styles.sectionTitle}>Registrar una solicitud</h2>
      <p style={styles.help}>Completa los datos con información clara y verificable.</p>
      {personal && <label>Cliente ID (opcional) <input name="clienteId" type="number" onChange={change} /></label>}
      <label>Nombres completos <input name="nombresReclamante" required value={form.nombresReclamante} onChange={change} /></label>
      <label>Tipo de documento <select name="tipoDocumento" value={form.tipoDocumento} onChange={change}><option>DNI</option><option>CE</option><option>PASAPORTE</option></select></label>
      <label>Número de documento <input name="numeroDocumento" required value={form.numeroDocumento} onChange={change} /></label>
      <label>Correo electrónico <input name="email" type="email" required value={form.email} onChange={change} /></label>
      <label>Teléfono <input name="telefono" value={form.telefono} onChange={change} /></label>
      <label>Tipo <select name="tipo" value={form.tipo} onChange={change}><option>RECLAMO</option><option>QUEJA</option></select></label>
      <label>Detalle <textarea name="detalle" required minLength="10" rows="4" value={form.detalle} onChange={change} /></label>
      <label>Pedido del cliente <textarea name="pedidoCliente" rows="3" value={form.pedidoCliente} onChange={change} /></label>
      <button className="btn-primary" type="submit">Registrar en el libro</button>
    </form>
    <section className="card" style={styles.listCard}>
      <h2 style={styles.sectionTitle}>{personal ? 'Reclamos recibidos' : 'Mis reclamos'}</h2>
    {items.length === 0 ? <p style={styles.empty}>Aún no hay reclamos registrados.</p> : <div style={{ overflowX: 'auto' }}><table className="claims-table"><thead><tr><th>Número</th><th>Fecha</th><th>Tipo</th><th>Estado</th><th>Detalle</th>{personal && <th>Actualizar</th>}</tr></thead>
      <tbody>{items.map((item) => <tr key={item.id}><td>{item.numeroReclamo}</td><td>{item.fechaRegistro?.slice(0, 10)}</td><td>{item.tipo}</td><td>{item.estado}</td><td>{item.detalle}</td>
        {personal && <td><select value={item.estado} onChange={(e) => actualizar(item, e.target.value)}>{estados.map((estado) => <option key={estado}>{estado}</option>)}</select>{item.respuesta && <small>{item.respuesta}</small>}</td>}</tr>)}</tbody>
    </table></div>}
    </section>
  </main></>;
}

const styles = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '32px 20px' },
  hero: { display: 'flex', gap: 16, alignItems: 'center', padding: 24, marginBottom: 20, borderRadius: 14, background: 'linear-gradient(135deg, #1a365d, #2b6cb0)', color: 'white', boxShadow: '0 8px 20px rgba(26,54,93,.2)' },
  heroIcon: { fontSize: 42 },
  title: { color: 'white', margin: '0 0 6px' },
  subtitle: { color: '#dbeafe', margin: 0 },
  message: { padding: 14, borderRadius: 8, background: '#e6fffa', color: '#276749', marginBottom: 18 },
  form: { display: 'grid', gap: 10, maxWidth: 720, margin: '0 auto 24px', padding: 24 },
  sectionTitle: { margin: '0 0 4px', color: '#1a365d' },
  help: { color: '#718096', marginBottom: 8 },
  listCard: { padding: 24, overflow: 'hidden' },
  empty: { color: '#718096', padding: '20px 0' },
};
