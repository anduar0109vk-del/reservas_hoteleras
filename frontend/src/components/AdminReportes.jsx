// src/components/AdminReportes.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from './Navbar';

const AdminReportes = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    pendientes: 0,
    confirmadas: 0,
    canceladas: 0,
    finalizadas: 0,
    ingresosTotales: 0
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const normalizeList = (value) => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.data)) return value.data;
    if (Array.isArray(value?.content)) return value.content;
    if (value && typeof value === 'object') {
      const nested = Object.values(value).find(Array.isArray);
      return Array.isArray(nested) ? nested : [];
    }
    return [];
  };

  const cargarDatos = async () => {
    try {
      const response = await api.get('/admin/reservas');
      const data = normalizeList(response.data);
      setReservas(data);

      const stats = {
        total: data.length,
        pendientes: data.filter(r => r.estado === 'PENDIENTE').length,
        confirmadas: data.filter(r => r.estado === 'CONFIRMADA').length,
        canceladas: data.filter(r => r.estado === 'CANCELADA').length,
        finalizadas: data.filter(r => r.estado === 'FINALIZADA').length,
        ingresosTotales: data.reduce((total, r) => total + (Number(r.montoTotal) || 0), 0)
      };
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generarReportePDF = async () => {
    try {
      const response = await api.get('/admin/reportes/pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reporte-reservas.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('❌ Error al generar reporte PDF');
    }
  };

  const generarReporteExcel = async () => {
    try {
      const response = await api.get('/admin/reportes/excel', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reporte-reservas.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('❌ Error al generar reporte Excel');
    }
  };

  const generarReporteCSV = async () => {
    try {
      const response = await api.get('/admin/reportes/csv', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reporte-reservas.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('❌ Error al generar reporte CSV');
    }
  };

  if (loading) return <><Navbar /><div className="loading-spinner">Cargando...</div></>;

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>📊 Reportes y Estadísticas</h2>

        <div style={styles.statsGrid}>
          <div className="card" style={styles.statCard}>
            <span style={styles.statNumber}>{estadisticas.total}</span>
            <span style={styles.statLabel}>📋 Total Reservas</span>
          </div>
          <div className="card" style={{ ...styles.statCard, borderTop: '4px solid #f6ad55' }}>
            <span style={styles.statNumber}>{estadisticas.pendientes}</span>
            <span style={styles.statLabel}>⏳ Pendientes</span>
          </div>
          <div className="card" style={{ ...styles.statCard, borderTop: '4px solid #48bb78' }}>
            <span style={styles.statNumber}>{estadisticas.confirmadas}</span>
            <span style={styles.statLabel}>✅ Confirmadas</span>
          </div>
          <div className="card" style={{ ...styles.statCard, borderTop: '4px solid #fc8181' }}>
            <span style={styles.statNumber}>{estadisticas.canceladas}</span>
            <span style={styles.statLabel}>❌ Canceladas</span>
          </div>
          <div className="card" style={{ ...styles.statCard, borderTop: '4px solid #63b3ed' }}>
            <span style={styles.statNumber}>{estadisticas.finalizadas}</span>
            <span style={styles.statLabel}>📌 Finalizadas</span>
          </div>
          <div className="card" style={{ ...styles.statCard, borderTop: '4px solid #38a169' }}>
            <span style={styles.statNumber}>S/{estadisticas.ingresosTotales}</span>
            <span style={styles.statLabel}>💰 Ingresos Totales</span>
          </div>
        </div>

        <div style={styles.buttonsContainer}>
          <button className="btn-primary" onClick={generarReportePDF} style={styles.reportBtn}>
            📄 Generar PDF
          </button>
          <button className="btn-success" onClick={generarReporteExcel} style={styles.reportBtn}>
            📊 Generar Excel
          </button>
          <button className="btn-primary" onClick={generarReporteCSV} style={styles.reportBtn}>
            📋 Generar CSV
          </button>
        </div>

        <div style={styles.tableContainer}>
          <h3>Últimas Reservas</h3>
          <table className="report-table" style={styles.table}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Habitación</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservas.slice(0, 10).map((r) => (
                <tr key={r.id}>
                  <td>{r.codigoReserva}</td>
                  <td>{r.cliente?.usuario?.nombres || 'N/A'}</td>
                  <td>{r.habitacion?.numero || 'N/A'}</td>
                  <td>{r.fechaEntrada}</td>
                  <td>{r.fechaSalida}</td>
                  <td>S/{r.montoTotal}</td>
                  <td>
                    <span style={{ ...styles.estadoBadge, backgroundColor: getEstadoColor(r.estado) }}>
                      {r.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const getEstadoColor = (estado) => {
  const colors = {
    'PENDIENTE': '#f6ad55',
    'CONFIRMADA': '#48bb78',
    'CANCELADA': '#fc8181',
    'FINALIZADA': '#63b3ed',
    'NO_SHOW': '#a0aec0'
  };
  return colors[estado] || '#a0aec0';
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    color: '#2d3748',
    marginBottom: '24px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  statCard: {
    textAlign: 'center',
    padding: '20px',
  },
  statNumber: {
    display: 'block',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2b6cb0',
  },
  statLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#718096',
    marginTop: '4px',
  },
  buttonsContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  },
  reportBtn: {
    padding: '10px 24px',
    fontSize: '14px',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '12px',
  },
  estadoBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
};

export default AdminReportes;