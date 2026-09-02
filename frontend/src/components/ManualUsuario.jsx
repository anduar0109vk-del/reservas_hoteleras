import React from 'react';
import Navbar from './Navbar';

const secciones = [
  {
    rol: 'Todos los usuarios',
    contenido: [
      ['Iniciar sesión', 'Ingresa tu correo y contraseña. El sistema abrirá automáticamente el panel correspondiente a tu rol. Usa Cerrar Sesión al terminar.'],
      ['Navegación', 'Desde la barra superior puedes acceder al dashboard, habitaciones, reservas, servicios, perfil, libro de reclamaciones y cambio de tema claro u oscuro.'],
      ['Nueva reserva', 'Selecciona fechas de entrada y salida, cantidad de huéspedes, habitación y método de pago. Verifica el resumen antes de registrar la reserva.'],
      ['Mis reservas', 'Consulta el código, fechas, habitación, estado y monto. Según el estado podrás cancelar, pagar, confirmar, facturar, agregar servicios o realizar checkout.'],
      ['Libro de reclamaciones', 'Completa tus datos, selecciona Queja o Reclamo, describe los hechos y registra tu solicitud. Guarda el número generado para consultar el estado y la respuesta.'],
    ],
  },
  {
    rol: 'Cliente',
    contenido: [
      ['Reservar', 'Consulta habitaciones disponibles, crea una reserva y revisa su estado desde Mis Reservas. La disponibilidad se valida para todo el rango de fechas.'],
      ['Pagos y servicios', 'Usa Pagar para registrar el pago y Servicios para seleccionar servicios adicionales disponibles para tu reserva.'],
      ['Seguimiento de reclamos', 'Puedes crear reclamos y ver únicamente tus propios reclamos, su estado, fecha, detalle y respuesta del hotel. No puedes cambiar estados.'],
      ['Perfil', 'Revisa tus datos personales y mantén actualizado el correo utilizado para recibir comunicaciones.'],
    ],
  },
  {
    rol: 'Recepcionista',
    contenido: [
      ['Recepción', 'Consulta las reservas del sistema y atiende las operaciones de llegada y salida de huéspedes.'],
      ['Confirmación y check-in', 'Confirma reservas pendientes y registra el check-in únicamente cuando la reserva corresponda al huésped y esté confirmada.'],
      ['Check-out', 'Verifica la reserva, registra la salida y confirma que la habitación quede disponible nuevamente.'],
      ['Reclamos', 'Puedes registrar reclamos en nombre de un cliente usando su Cliente ID, consultar todos los casos y actualizar su estado con una respuesta.'],
    ],
  },
  {
    rol: 'Gerente',
    contenido: [
      ['Dashboard y reportes', 'Revisa indicadores de reservas, ocupación, ingresos y el comportamiento general del hotel. Utiliza los reportes para supervisar la operación.'],
      ['Supervisión de reservas', 'Consulta todas las reservas, apoya confirmaciones, check-in y check-out, y verifica que los estados coincidan con la operación real.'],
      ['Seguimiento de reclamos', 'Revisa reclamos recibidos, cambia a EN_PROCESO durante la atención y marca RESUELTO solo cuando exista una respuesta clara para el cliente.'],
    ],
  },
  {
    rol: 'Administrador',
    contenido: [
      ['Administración', 'Gestiona usuarios y roles, habitaciones, promociones y servicios desde las secciones administrativas.'],
      ['Reportes', 'Genera y descarga reportes en los formatos disponibles para analizar reservas, ocupación e ingresos.'],
      ['Control operativo', 'También puedes revisar reservas, recepción, check-in, check-out y reclamos para validar que los datos del sistema sean consistentes.'],
      ['Seguridad', 'Asigna únicamente los permisos necesarios, no compartas credenciales y cierra sesiones en equipos compartidos.'],
    ],
  },
];

export default function ManualUsuario() {
  return (
    <>
      <Navbar />
      <main style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>📘 Manual de usuario</h1>
          <p style={styles.subtitle}>
            Guía de uso del sistema de reservas hoteleras y sus funciones por rol.
          </p>
        </header>
        {secciones.map((seccion) => (
          <section className="card" style={styles.section} key={seccion.rol}>
            <h2 style={styles.role}>{seccion.rol}</h2>
            {seccion.contenido.map(([titulo, detalle]) => (
              <article style={styles.article} key={titulo}>
                <h3 style={styles.articleTitle}>{titulo}</h3>
                <p style={styles.text}>{detalle}</p>
              </article>
            ))}
          </section>
        ))}
      </main>
    </>
  );
}

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '24px 20px' },
  header: { marginBottom: '20px' },
  title: { marginBottom: '8px' },
  subtitle: { color: '#4a5568' },
  section: { marginBottom: '18px' },
  role: { color: '#2b6cb0', marginBottom: '14px' },
  article: { borderTop: '1px solid #e2e8f0', padding: '12px 0' },
  articleTitle: { marginBottom: '5px' },
  text: { lineHeight: 1.6 },
};
