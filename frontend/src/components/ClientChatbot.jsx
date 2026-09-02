import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const WHATSAPP_NUMBER = '51938789806';
const WHATSAPP_MESSAGE = 'Hola, necesito ayuda con mi reserva en Casa Andina.';

const quickQuestions = [
  { label: 'Reservas', value: '¿Cómo puedo hacer una reserva?' },
  { label: 'Habitaciones', value: '¿Qué habitaciones tienen disponibles?' },
  { label: 'Pagos', value: '¿Qué medios de pago aceptan?' },
  { label: 'Check-in / out', value: '¿Cuáles son los horarios de check-in y check-out?' },
  { label: 'Servicios', value: '¿Qué servicios ofrece el hotel?' },
  { label: 'Reclamos', value: '¿Cómo presento un reclamo?' },
];

const answers = {
  reservas: 'Puedes reservar desde “Nueva Reserva”, eligiendo fechas y habitación. Luego revisa los datos y confirma tu solicitud en el sistema.',
  habitaciones: 'Consulta “Habitaciones” para ver disponibilidad, tipo, capacidad y precio actualizado. Selecciona una habitación para iniciar tu reserva.',
  pagos: 'Aceptamos los medios de pago disponibles en la pantalla de “Pagos”. El estado de cada pago y su comprobante quedan asociados a tu reserva.',
  'check-in': 'El check-in y el check-out se coordinan en recepción. Presenta tu documento y el código de reserva al llegar; revisa los horarios indicados en tu confirmación.',
  servicios: 'Puedes consultar los servicios disponibles en “Servicios” y agregar los que necesites a una reserva desde su detalle.',
  reclamos: 'Registra tu caso en “Reclamos” desde el menú. Completa el formulario con el detalle y podrás consultar el estado de tu solicitud.',
  fallback: 'Puedo ayudarte con reservas, habitaciones, pagos, check-in, check-out, servicios y reclamos. Elige una opción o escribe tu consulta.',
};

const getAnswer = (question) => {
  const normalized = question.toLowerCase();
  if (normalized.includes('reserva')) return answers.reservas;
  if (normalized.includes('habitac')) return answers.habitaciones;
  if (normalized.includes('pago') || normalized.includes('tarjeta')) return answers.pagos;
  if (normalized.includes('check') || normalized.includes('entrada') || normalized.includes('salida')) return answers['check-in'];
  if (normalized.includes('servicio')) return answers.servicios;
  if (normalized.includes('reclamo') || normalized.includes('queja')) return answers.reclamos;
  return answers.fallback;
};

const ClientChatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: `¡Hola${user?.nombres ? `, ${user.nombres}` : ''}! Soy tu asistente de Casa Andina. ¿En qué puedo ayudarte?` },
  ]);

  if (user?.rol !== 'CLIENTE') return null;

  const ask = (question) => {
    const text = question.trim();
    if (!text) return;
    setMessages((current) => [
      ...current,
      { id: Date.now(), from: 'user', text },
      { id: Date.now() + 1, from: 'bot', text: getAnswer(text) },
    ]);
    setInput('');
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="client-chatbot">
      {isOpen && (
        <section className="chatbot-panel" aria-label="Asistente de Casa Andina">
          <header className="chatbot-header">
            <div className="chatbot-avatar" aria-hidden="true">✦</div>
            <div>
              <strong>Asistente Casa Andina</strong>
              <span><i /> En línea · Respuestas rápidas</span>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)} aria-label="Cerrar asistente">×</button>
          </header>
          <div className="chatbot-messages" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`chatbot-message chatbot-message-${message.from}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="chatbot-quick-actions">
            {quickQuestions.map((question) => (
              <button key={question.label} onClick={() => ask(question.value)}>{question.label}</button>
            ))}
          </div>
          <form className="chatbot-input-row" onSubmit={(event) => { event.preventDefault(); ask(input); }}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Escribe tu consulta..." aria-label="Escribe tu consulta" />
            <button type="submit" aria-label="Enviar consulta">➤</button>
          </form>
          <button className="chatbot-whatsapp" onClick={openWhatsApp}>
            <span aria-hidden="true">◉</span> Hablar por WhatsApp
          </button>
        </section>
      )}
      <button className={`chatbot-launcher ${isOpen ? 'chatbot-launcher-open' : ''}`} onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente'}>
        <span aria-hidden="true">{isOpen ? '×' : '✦'}</span>
        {!isOpen && <b>¿Necesitas ayuda?</b>}
      </button>
    </div>
  );
};

export default ClientChatbot;
