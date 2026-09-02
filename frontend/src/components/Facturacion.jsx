import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from './Navbar';
import logo from '../assets/casa-andina-logo.png';

const money = (value) => `S/ ${Number(value || 0).toFixed(2)}`;

const Facturacion = () => {
  const { reservaId } = useParams();
  const navigate = useNavigate();
  const [reserva, setReserva] = useState(null);
  const [factura, setFactura] = useState({ tipo: 'BOLETA', ruc: '', razonSocial: '', direccion: '' });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.get(`/reservas/${reservaId}`).then(({ data }) => active && setReserva(data))
      .catch(() => active && setError('No se pudo cargar la reserva. Verifica tu sesión e inténtalo nuevamente.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [reservaId]);

  const handleChange = ({ target: { name, value } }) => setFactura((current) => ({ ...current, [name]: value }));

  const generarFactura = async (event) => {
    event.preventDefault();
    setError('');
    if (factura.tipo === 'FACTURA' && !/^\d{11}$/.test(factura.ruc)) {
      setError('El RUC debe contener exactamente 11 dígitos.');
      return;
    }
    setProcessing(true);
    try {
      const response = await api.post(`/reservas/${reservaId}/factura/pdf`, factura, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url; link.download = `comprobante-${reserva.codigoReserva || reservaId}.pdf`;
      document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
    } catch { setError('No se pudo generar el comprobante. Inténtalo nuevamente.'); }
    finally { setProcessing(false); }
  };

  if (loading) return <><Navbar /><div className="loading-spinner">Cargando comprobante...</div></>;
  if (!reserva) return <><Navbar /><main style={styles.container}><div className="error-message">{error}</div></main></>;
  const cliente = reserva.cliente?.usuario;
  const neto = Number(reserva.montoTotal || 0);
  const igv = neto * 0.18;
  const totalConIgv = neto + igv;
  return <>
    <Navbar />
    <main style={styles.container}><section className="card" style={styles.card}>
      <header style={styles.header}><img src={logo} alt="Casa Andina" style={styles.logo} /><div><span style={styles.eyebrow}>DOCUMENTOS</span><h1 style={styles.title}>Emitir comprobante</h1><p style={styles.muted}>Reserva {reserva.codigoReserva}</p></div></header>
      {error && <div className="error-message" role="alert">{error}</div>}
      <div style={styles.summary}>
        <div><span style={styles.label}>Huésped</span><strong>{cliente ? `${cliente.nombres} ${cliente.apellidos}` : 'Cliente'}</strong><span>{cliente?.email || ''}</span></div>
        <div><span style={styles.label}>Estadía</span><strong>Habitación {reserva.habitacion?.numero || '—'}</strong><span>{reserva.fechaEntrada} — {reserva.fechaSalida}</span></div>
        <div><span style={styles.label}>Importe neto</span><strong>{money(neto)}</strong><span>IGV 18%: {money(igv)}</span></div>
        <div style={styles.total}><span style={styles.label}>Total con IGV</span><strong>{money(totalConIgv)}</strong></div>
      </div>
      <form onSubmit={generarFactura} style={styles.form}><h2 style={styles.sectionTitle}>Datos fiscales</h2>
        <label style={styles.field}>Tipo de comprobante<select name="tipo" value={factura.tipo} onChange={handleChange} style={styles.input}><option value="BOLETA">Boleta electrónica</option><option value="FACTURA">Factura electrónica</option></select></label>
        {factura.tipo === 'FACTURA' && <div style={styles.grid}>
          <label style={styles.field}>RUC *<input name="ruc" inputMode="numeric" maxLength="11" value={factura.ruc} onChange={handleChange} style={styles.input} required /></label>
          <label style={styles.field}>Razón social *<input name="razonSocial" maxLength="150" value={factura.razonSocial} onChange={handleChange} style={styles.input} required /></label>
          <label style={styles.field}>Dirección<input name="direccion" maxLength="200" value={factura.direccion} onChange={handleChange} style={styles.input} /></label>
        </div>}
        <div style={styles.actions}><button type="button" className="btn-danger" onClick={() => navigate('/mis-reservas')}>Cancelar</button><button type="submit" className="btn-primary" disabled={processing}>{processing ? 'Generando...' : 'Descargar PDF'}</button></div>
      </form>
      <div style={styles.taxNote}>La factura detalla alojamiento, servicios y descuentos. El IGV aplicado es del 18% sobre el importe neto.</div>
      <p style={styles.note}>El PDF se genera en el servidor con los datos de esta reserva.</p>
    </section></main>
  </>;
};

const styles = {
  container: { maxWidth: '960px', margin: '0 auto', padding: '32px 20px' }, card: { padding: '32px' },
  header: { display: 'flex', gap: '18px', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '24px', marginBottom: '24px' }, logo: { width: '170px', maxHeight: '64px', objectFit: 'contain' },
  eyebrow: { color: '#718096', fontSize: '12px', letterSpacing: '1.5px', fontWeight: '700' }, title: { margin: '4px 0', color: '#1a365d', fontSize: '28px' }, muted: { color: '#718096', margin: 0 },
  summary: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: '20px', background: '#f7fafc', padding: '20px', borderRadius: '10px' }, label: { display: 'block', color: '#718096', fontSize: '12px', textTransform: 'uppercase', marginBottom: '5px' }, total: { color: '#1a365d' },
  form: { marginTop: '28px' }, sectionTitle: { color: '#1a365d', fontSize: '18px' }, grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '16px' }, field: { display: 'flex', flexDirection: 'column', gap: '7px', color: '#2d3748', fontWeight: '600', fontSize: '14px' }, input: { boxSizing: 'border-box', padding: '11px 12px', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '15px', background: '#fff' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }, taxNote: { marginTop: '18px', padding: '12px', borderRadius: '6px', background: '#ebf8ff', color: '#2c5282', fontSize: '13px' }, note: { color: '#718096', fontSize: '12px', marginTop: '20px' }
};
export default Facturacion;
