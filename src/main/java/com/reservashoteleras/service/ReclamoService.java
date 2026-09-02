package com.reservashoteleras.service;

import com.reservashoteleras.dto.ReclamoEstadoRequest;
import com.reservashoteleras.dto.ReclamoRequest;
import com.reservashoteleras.dto.ReclamoResponse;
import com.reservashoteleras.entity.*;
import com.reservashoteleras.entity.enums.EstadoReclamo;
import com.reservashoteleras.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service @RequiredArgsConstructor
public class ReclamoService {
    private final LibroReclamacionesRepository repository;
    private final ClienteRepository clienteRepository;
    private final ReservaRepository reservaRepository;

    @Transactional
    public ReclamoResponse crear(ReclamoRequest request, Usuario usuario) {
        Cliente cliente;
        if ("CLIENTE".equals(usuario.getRol().getNombre())) {
            cliente = clienteRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new IllegalArgumentException("El usuario no tiene perfil de cliente"));
        } else {
            if (request.getClienteId() == null) throw new IllegalArgumentException("clienteId es obligatorio para personal");
            cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado"));
        }
        LibroReclamaciones r = new LibroReclamaciones();
        r.setNumeroReclamo("REC-" + System.currentTimeMillis());
        r.setCliente(cliente);
        r.setNombresReclamante(request.getNombresReclamante());
        r.setTipoDocumento(request.getTipoDocumento());
        r.setNumeroDocumento(request.getNumeroDocumento());
        r.setEmail(request.getEmail()); r.setTelefono(request.getTelefono());
        r.setTipo(request.getTipo()); r.setDetalle(request.getDetalle());
        r.setPedidoCliente(request.getPedidoCliente()); r.setEstado(EstadoReclamo.PENDIENTE);
        if (request.getReservaId() != null) {
            Reserva reserva = reservaRepository.findById(request.getReservaId())
                .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada"));
            if ("CLIENTE".equals(usuario.getRol().getNombre())
                    && (reserva.getCliente() == null || !reserva.getCliente().getId().equals(cliente.getId()))) {
                throw new IllegalArgumentException("La reserva no pertenece al cliente autenticado");
            }
            r.setReserva(reserva);
        }
        return ReclamoResponse.from(repository.save(r));
    }

    public List<ReclamoResponse> listar(Usuario usuario) {
        List<LibroReclamaciones> rows = "CLIENTE".equals(usuario.getRol().getNombre())
            ? clienteRepository.findByUsuarioId(usuario.getId()).map(c -> repository.findByClienteId(c.getId())).orElse(List.of())
            : repository.findAll();
        return rows.stream().map(ReclamoResponse::from).toList();
    }

    @Transactional
    public ReclamoResponse actualizar(Long id, ReclamoEstadoRequest request, Usuario usuario) {
        LibroReclamaciones r = repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Reclamo no encontrado"));
        r.setEstado(request.getEstado());
        r.setRespuesta(request.getRespuesta());
        r.setAtendidoPor(usuario);
        r.setFechaRespuesta(request.getEstado() == EstadoReclamo.RESUELTO ? LocalDateTime.now() : null);
        return ReclamoResponse.from(repository.save(r));
    }
}
