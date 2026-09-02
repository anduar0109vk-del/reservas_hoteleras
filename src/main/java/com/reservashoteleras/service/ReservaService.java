package com.reservashoteleras.service;

import com.reservashoteleras.dto.ClienteDTO;
import com.reservashoteleras.dto.HabitacionDTO;
import com.reservashoteleras.dto.ReservaDTO;
import com.reservashoteleras.dto.ReservaRequest;
import com.reservashoteleras.entity.CheckIn;
import com.reservashoteleras.entity.Cliente;
import com.reservashoteleras.entity.Habitacion;
import com.reservashoteleras.entity.Pago;
import com.reservashoteleras.entity.Promocion;
import com.reservashoteleras.entity.Reserva;
import com.reservashoteleras.entity.ReservaServicio;
import com.reservashoteleras.entity.ServicioHabitacion;
import com.reservashoteleras.entity.Usuario;
import com.reservashoteleras.entity.enums.EstadoHabitacion;
import com.reservashoteleras.entity.enums.EstadoPago;
import com.reservashoteleras.entity.enums.EstadoReserva;
import com.reservashoteleras.entity.enums.EstadoServicio;
import com.reservashoteleras.entity.enums.MetodoPago;
import com.reservashoteleras.entity.enums.TipoDescuento;
import com.reservashoteleras.repository.CheckInRepository;
import com.reservashoteleras.repository.ClienteRepository;
import com.reservashoteleras.repository.HabitacionRepository;
import com.reservashoteleras.repository.PagoRepository;
import com.reservashoteleras.repository.PromocionRepository;
import com.reservashoteleras.repository.ReservaRepository;
import com.reservashoteleras.repository.ReservaServicioRepository;
import com.reservashoteleras.repository.ServicioHabitacionRepository;
import com.reservashoteleras.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservaService {
    private final ReservaRepository reservaRepository;
    private final HabitacionRepository habitacionRepository;
    private final ClienteRepository clienteRepository;
    private final PromocionRepository promocionRepository;
    private final UsuarioRepository usuarioRepository;
    private final ServicioHabitacionRepository servicioHabitacionRepository;
    private final ReservaServicioRepository reservaServicioRepository;
    private final PagoRepository pagoRepository;
    private final CheckInRepository checkInRepository;

    // ==================== MÉTODOS DTO ====================

    public List<ReservaDTO> getAllReservasDTO() {
        List<Reserva> reservas = reservaRepository.findAll();
        return reservas.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ReservaDTO getReservaByIdDTO(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        return convertToDTO(reserva);
    }

    public List<ReservaDTO> getReservasByClienteDTO(Long clienteId) {
        List<Reserva> reservas = reservaRepository.findByClienteId(clienteId);
        return reservas.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ReservaDTO convertToDTO(Reserva reserva) {
        ClienteDTO clienteDTO = null;
        if (reserva.getCliente() != null) {
            Cliente cliente = reserva.getCliente();
            Usuario usuario = cliente.getUsuario();
            clienteDTO = new ClienteDTO(
                cliente.getId(),
                usuario != null ? usuario.getId() : null,
                usuario != null ? usuario.getNombres() : "Cliente sin nombre",
                usuario != null ? usuario.getApellidos() : "",
                usuario != null ? usuario.getEmail() : "sin email",
                usuario != null ? usuario.getTelefono() : ""
            );
        }

        HabitacionDTO habitacionDTO = null;
        if (reserva.getHabitacion() != null && reserva.getHabitacion().getTipoHabitacion() != null) {
            Habitacion habitacion = reserva.getHabitacion();
            habitacionDTO = new HabitacionDTO(
                habitacion.getId(),
                habitacion.getNumero(),
                habitacion.getPiso(),
                habitacion.getTipoHabitacion().getNombre(),
                habitacion.getTipoHabitacion().getCapacidad(),
                habitacion.getPrecioActual(),
                habitacion.getEstado().name(),
                habitacion.getDestacada()
            );
        }

        return new ReservaDTO(
            reserva.getId(),
            reserva.getCodigoReserva(),
            clienteDTO,
            habitacionDTO,
            reserva.getFechaEntrada(),
            reserva.getFechaSalida(),
            reserva.getNumeroHuespedes(),
            reserva.getEstado() != null ? reserva.getEstado().name() : null,
            reserva.getMontoTotal(),
            reserva.getFechaCreacion()
        );
    }

    // ==================== MÉTODOS CRUD ====================

    public List<Reserva> getAllReservas() {
        return reservaRepository.findAll();
    }

    public List<Reserva> getReservasByCliente(Long clienteId) {
        return reservaRepository.findByClienteId(clienteId);
    }

    public List<Reserva> getReservasByEstado(EstadoReserva estado) {
        return reservaRepository.findByEstado(estado);
    }

    public Reserva getReservaById(Long id) {
        return reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
    }

    // ==================== CREAR RESERVA ====================

    @Transactional
    public Reserva crearReserva(ReservaRequest request, Long usuarioId) {
        if (request.getFechaEntrada() == null || request.getFechaSalida() == null
                || !request.getFechaSalida().isAfter(request.getFechaEntrada())) {
            throw new RuntimeException("Las fechas de entrada y salida son obligatorias y válidas");
        }
        if (request.getHabitacionId() == null || request.getClienteId() == null) {
            throw new RuntimeException("El cliente y la habitación son obligatorios");
        }
        if (request.getMetodoPago() == null || request.getMetodoPago().isBlank()) {
            throw new RuntimeException("El método de pago es obligatorio");
        }

        List<Habitacion> disponibles = habitacionRepository.findDisponiblesEntreFechas(
            request.getFechaEntrada(), request.getFechaSalida()
        );
        
        if (disponibles.stream().noneMatch(h -> h.getId().equals(request.getHabitacionId()))) {
            throw new RuntimeException("Habitación no disponible en las fechas seleccionadas");
        }
        
        Habitacion habitacion = habitacionRepository.findById(request.getHabitacionId())
                .orElseThrow(() -> new RuntimeException("Habitación no encontrada"));
        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        Usuario creador = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        long dias = java.time.temporal.ChronoUnit.DAYS.between(request.getFechaEntrada(), request.getFechaSalida());
        BigDecimal subtotalHabitacion = habitacion.getPrecioActual().multiply(BigDecimal.valueOf(dias));
        
        BigDecimal descuento = BigDecimal.ZERO;
        Promocion promocion = null;
        if (request.getCodigoPromocion() != null && !request.getCodigoPromocion().isEmpty()) {
            promocion = promocionRepository.findByCodigoAndActivoTrue(request.getCodigoPromocion())
                .filter(p -> !p.getFechaInicio().isAfter(request.getFechaEntrada()) &&
                            !p.getFechaFin().isBefore(request.getFechaSalida()))
                .orElse(null);
            
            if (promocion != null) {
                if (promocion.getTipoDescuento() == TipoDescuento.PORCENTAJE) {
                    descuento = subtotalHabitacion.multiply(promocion.getValor().divide(BigDecimal.valueOf(100)));
                } else {
                    descuento = promocion.getValor().min(subtotalHabitacion);
                }
            }
        }
        
        BigDecimal montoTotal = subtotalHabitacion.subtract(descuento);
        
        String codigo = generarCodigoReserva();
        Reserva reserva = new Reserva();
        reserva.setCodigoReserva(codigo);
        reserva.setCliente(cliente);
        reserva.setHabitacion(habitacion);
        reserva.setFechaEntrada(request.getFechaEntrada());
        reserva.setFechaSalida(request.getFechaSalida());
        reserva.setNumeroHuespedes(request.getNumeroHuespedes());
        reserva.setEstado(EstadoReserva.PENDIENTE);
        reserva.setPromocion(promocion);
        reserva.setSubtotalHabitacion(subtotalHabitacion);
        reserva.setSubtotalServicios(BigDecimal.ZERO);
        reserva.setDescuento(descuento);
        reserva.setMontoTotal(montoTotal);
        reserva.setCreadoPor(creador);
        reserva.setFechaCreacion(LocalDateTime.now());
        
        Reserva saved = reservaRepository.save(reserva);
        
        habitacion.setVecesReservada(habitacion.getVecesReservada() + 1);
        habitacionRepository.save(habitacion);
        
        Pago pago = new Pago();
        pago.setReserva(saved);
        try {
            pago.setMetodoPago(MetodoPago.valueOf(request.getMetodoPago().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Método de pago inválido");
        }
        pago.setMonto(montoTotal);
        pago.setEstado(EstadoPago.PENDIENTE);
        pago.setFechaCreacion(LocalDateTime.now());
        pagoRepository.save(pago);
        
        return saved;
    }
    
    private String generarCodigoReserva() {
        String fecha = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String random = String.valueOf((int) (Math.random() * 9000) + 1000);
        return "RES-" + fecha + "-" + random;
    }

    // ==================== GESTIÓN DE RESERVAS ====================

    @Transactional
    public Reserva cancelarReserva(Long id, String motivo, Usuario usuario) {
        Reserva reserva = getReservaById(id);
        
        String rol = usuario.getRol().getNombre();
        boolean isAdmin = "ADMIN".equals(rol);
        boolean isGerente = "GERENTE".equals(rol);
        boolean isRecepcionista = "RECEPCIONISTA".equals(rol);
        boolean isCliente = "CLIENTE".equals(rol);
        
        if (isCliente) {
            Cliente cliente = clienteRepository.findByUsuarioId(usuario.getId())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
            if (!reserva.getCliente().getId().equals(cliente.getId())) {
                throw new RuntimeException("No tienes permiso para cancelar esta reserva");
            }
        }
        
        if (reserva.getEstado() == EstadoReserva.CONFIRMADA) {
            throw new RuntimeException("No se puede cancelar una reserva ya confirmada");
        }
        if (reserva.getEstado() == EstadoReserva.FINALIZADA) {
            throw new RuntimeException("No se puede cancelar una reserva ya finalizada");
        }
        if (reserva.getEstado() == EstadoReserva.CANCELADA) {
            throw new RuntimeException("La reserva ya está cancelada");
        }
        
        reserva.setEstado(EstadoReserva.CANCELADA);
        reserva.setFechaCancelacion(LocalDateTime.now());
        reserva.setMotivoCancelacion(motivo);
        
        Habitacion habitacion = reserva.getHabitacion();
        if (habitacion.getEstado() == EstadoHabitacion.OCUPADA) {
            habitacion.setEstado(EstadoHabitacion.DISPONIBLE);
            habitacionRepository.save(habitacion);
        }
        
        return reservaRepository.save(reserva);
    }

    @Transactional
    public Reserva confirmarReserva(Long id) {
        Reserva reserva = getReservaById(id);
        
        if (reserva.getEstado() == EstadoReserva.CANCELADA) {
            throw new RuntimeException("No se puede confirmar una reserva cancelada");
        }
        if (reserva.getEstado() == EstadoReserva.CONFIRMADA) {
            throw new RuntimeException("La reserva ya está confirmada");
        }
        if (reserva.getEstado() == EstadoReserva.FINALIZADA) {
            throw new RuntimeException("No se puede confirmar una reserva ya finalizada");
        }
        
        reserva.setEstado(EstadoReserva.CONFIRMADA);
        
        Habitacion habitacion = reserva.getHabitacion();
        habitacion.setEstado(EstadoHabitacion.OCUPADA);
        habitacionRepository.save(habitacion);
        
        Pago pago = pagoRepository.findByReservaId(id).orElse(null);
        if (pago != null) {
            pago.setEstado(EstadoPago.COMPLETADO);
            pago.setFechaPago(LocalDateTime.now());
            pagoRepository.save(pago);
        }
        
        return reservaRepository.save(reserva);
    }

    @Transactional
    public void finalizarReserva(Long id) {
        Reserva reserva = getReservaById(id);
        
        if (reserva.getEstado() == EstadoReserva.CANCELADA) {
            throw new RuntimeException("No se puede finalizar una reserva cancelada");
        }
        if (reserva.getEstado() == EstadoReserva.FINALIZADA) {
            throw new RuntimeException("La reserva ya está finalizada");
        }
        
        reserva.setEstado(EstadoReserva.FINALIZADA);
        
        Habitacion habitacion = reserva.getHabitacion();
        habitacion.setEstado(EstadoHabitacion.DISPONIBLE);
        habitacionRepository.save(habitacion);
        
        reservaRepository.save(reserva);
    }

    // ==================== CHECK-IN Y CHECK-OUT ====================

    @Transactional
    public Reserva realizarCheckIn(Long reservaId) {
        Reserva reserva = getReservaById(reservaId);
        
        if (reserva.getEstado() != EstadoReserva.CONFIRMADA) {
            throw new RuntimeException("Solo se puede hacer check-in de reservas confirmadas");
        }
        
        // Cambiar estado de la habitación a OCUPADA
        Habitacion habitacion = reserva.getHabitacion();
        habitacion.setEstado(EstadoHabitacion.OCUPADA);
        habitacionRepository.save(habitacion);
        
        // Crear o actualizar CheckIn
        CheckIn checkIn = checkInRepository.findByReservaId(reservaId).orElse(new CheckIn());
        checkIn.setReserva(reserva);
        checkIn.setFechaHoraCheckin(LocalDateTime.now());
        checkInRepository.save(checkIn);
        
        return reservaRepository.save(reserva);
    }

    @Transactional
    public Reserva realizarCheckOut(Long reservaId) {
        Reserva reserva = getReservaById(reservaId);
        
        if (reserva.getEstado() != EstadoReserva.CONFIRMADA) {
            throw new RuntimeException("Solo se puede hacer check-out de reservas confirmadas");
        }
        
        // Cambiar estado de la habitación a DISPONIBLE
        Habitacion habitacion = reserva.getHabitacion();
        habitacion.setEstado(EstadoHabitacion.DISPONIBLE);
        habitacionRepository.save(habitacion);
        
        // Actualizar CheckIn con fecha de checkout
        CheckIn checkIn = checkInRepository.findByReservaId(reservaId).orElse(null);
        if (checkIn != null) {
            checkIn.setFechaHoraCheckout(LocalDateTime.now());
            checkInRepository.save(checkIn);
        }
        
        // Cambiar estado de la reserva a FINALIZADA
        reserva.setEstado(EstadoReserva.FINALIZADA);
        
        return reservaRepository.save(reserva);
    }

    // ==================== SERVICIOS A LA HABITACIÓN ====================

    @Transactional
    public ReservaServicio agregarServicioAReserva(Long reservaId, Long servicioId, Integer cantidad, Usuario usuario) {
        Reserva reserva = getReservaById(reservaId);
        
        if (reserva.getEstado() == EstadoReserva.CANCELADA || reserva.getEstado() == EstadoReserva.FINALIZADA) {
            throw new RuntimeException("No se pueden agregar servicios a una reserva cancelada o finalizada");
        }
        
        if (reserva.getEstado() != EstadoReserva.PENDIENTE && reserva.getEstado() != EstadoReserva.CONFIRMADA) {
            throw new RuntimeException("Solo se pueden agregar servicios a reservas pendientes o confirmadas");
        }
        
        ServicioHabitacion servicio = servicioHabitacionRepository.findById(servicioId)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
        
        if (!servicio.getDisponible()) {
            throw new RuntimeException("Servicio no disponible");
        }
        
        if (cantidad == null || cantidad <= 0) {
            throw new RuntimeException("La cantidad debe ser mayor a 0");
        }
        
        BigDecimal subtotal = servicio.getPrecio().multiply(BigDecimal.valueOf(cantidad));
        
        ReservaServicio reservaServicio = new ReservaServicio();
        reservaServicio.setReserva(reserva);
        reservaServicio.setServicio(servicio);
        reservaServicio.setCantidad(cantidad);
        reservaServicio.setPrecioUnitario(servicio.getPrecio());
        reservaServicio.setSubtotal(subtotal);
        reservaServicio.setEstado(EstadoServicio.SOLICITADO);
        reservaServicio.setFechaSolicitud(LocalDateTime.now());
        
        ReservaServicio saved = reservaServicioRepository.save(reservaServicio);
        
        BigDecimal nuevoTotal = reserva.getMontoTotal().add(subtotal);
        reserva.setMontoTotal(nuevoTotal);
        reserva.setSubtotalServicios(reserva.getSubtotalServicios().add(subtotal));
        reservaRepository.save(reserva);
        
        return saved;
    }

    public List<ReservaServicio> getServiciosByReserva(Long reservaId) {
        getReservaById(reservaId);
        return reservaServicioRepository.findByReservaId(reservaId);
    }

    public List<ReservaServicio> getServiciosByReservaAndEstado(Long reservaId, EstadoServicio estado) {
        getReservaById(reservaId);
        return reservaServicioRepository.findByReservaIdAndEstado(reservaId, estado);
    }

    @Transactional
    public void eliminarServicioDeReserva(Long reservaServicioId, Usuario usuario) {
        ReservaServicio reservaServicio = reservaServicioRepository.findById(reservaServicioId)
                .orElseThrow(() -> new RuntimeException("Servicio de reserva no encontrado"));
        
        Reserva reserva = reservaServicio.getReserva();
        
        if (reserva.getEstado() == EstadoReserva.CANCELADA || reserva.getEstado() == EstadoReserva.FINALIZADA) {
            throw new RuntimeException("No se pueden eliminar servicios de una reserva cancelada o finalizada");
        }
        
        if (reservaServicio.getEstado() == EstadoServicio.ENTREGADO) {
            throw new RuntimeException("No se puede eliminar un servicio que ya ha sido entregado");
        }
        
        BigDecimal subtotal = reservaServicio.getSubtotal();
        reserva.setMontoTotal(reserva.getMontoTotal().subtract(subtotal));
        reserva.setSubtotalServicios(reserva.getSubtotalServicios().subtract(subtotal));
        reservaRepository.save(reserva);
        
        reservaServicioRepository.delete(reservaServicio);
    }

    @Transactional
    public ReservaServicio actualizarEstadoServicio(Long reservaServicioId, String estadoStr, Usuario usuario) {
        ReservaServicio reservaServicio = reservaServicioRepository.findById(reservaServicioId)
                .orElseThrow(() -> new RuntimeException("Servicio de reserva no encontrado"));
        
        EstadoServicio estado;
        try {
            estado = EstadoServicio.valueOf(estadoStr);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado inválido. Valores permitidos: SOLICITADO, EN_PREPARACION, ENTREGADO, CANCELADO");
        }
        
        if (reservaServicio.getEstado() == EstadoServicio.ENTREGADO && estado != EstadoServicio.ENTREGADO) {
            throw new RuntimeException("Un servicio entregado no puede cambiar de estado");
        }
        
        if (reservaServicio.getEstado() == EstadoServicio.CANCELADO && estado != EstadoServicio.CANCELADO) {
            throw new RuntimeException("Un servicio cancelado no puede cambiar de estado");
        }
        
        reservaServicio.setEstado(estado);
        
        if (estado == EstadoServicio.ENTREGADO) {
            reservaServicio.setFechaEntrega(LocalDateTime.now());
        }
        
        if (estado == EstadoServicio.CANCELADO) {
            Reserva reserva = reservaServicio.getReserva();
            BigDecimal subtotal = reservaServicio.getSubtotal();
            reserva.setMontoTotal(reserva.getMontoTotal().subtract(subtotal));
            reserva.setSubtotalServicios(reserva.getSubtotalServicios().subtract(subtotal));
            reservaRepository.save(reserva);
        }
        
        return reservaServicioRepository.save(reservaServicio);
    }

    public List<ReservaServicio> getServiciosActivosByReserva(Long reservaId) {
        getReservaById(reservaId);
        return reservaServicioRepository.findByReservaIdAndEstadoNot(reservaId, EstadoServicio.CANCELADO);
    }

    public BigDecimal calcularTotalServicios(Long reservaId) {
        List<ReservaServicio> servicios = reservaServicioRepository.findByReservaId(reservaId);
        return servicios.stream()
                .filter(rs -> rs.getEstado() != EstadoServicio.CANCELADO)
                .map(ReservaServicio::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}