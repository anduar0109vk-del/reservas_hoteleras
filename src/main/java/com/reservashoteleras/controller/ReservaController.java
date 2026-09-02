package com.reservashoteleras.controller;

import com.reservashoteleras.dto.ReservaDTO;
import com.reservashoteleras.dto.ReservaRequest;
import com.reservashoteleras.entity.Reserva;
import com.reservashoteleras.entity.ReservaServicio;
import com.reservashoteleras.entity.Usuario;
import com.reservashoteleras.entity.enums.EstadoServicio;
import com.reservashoteleras.service.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReservaController {
    private final ReservaService reservaService;
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE', 'RECEPCIONISTA')")
    public ResponseEntity<List<Reserva>> getAllReservas() {
        return ResponseEntity.ok(reservaService.getAllReservas());
    }
    
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Reserva>> getByCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(reservaService.getReservasByCliente(clienteId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Reserva> getById(@PathVariable Long id) {
        return ResponseEntity.ok(reservaService.getReservaById(id));
    }
    
    @PostMapping
    public ResponseEntity<Reserva> crearReserva(@RequestBody ReservaRequest request, Authentication auth) {
        Usuario usuario = obtenerUsuario(auth);
        return ResponseEntity.ok(reservaService.crearReserva(request, usuario.getId()));
    }
    
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Reserva> cancelarReserva(@PathVariable Long id, @RequestParam String motivo, Authentication auth) {
        Usuario usuario = obtenerUsuario(auth);
        return ResponseEntity.ok(reservaService.cancelarReserva(id, motivo, usuario));
    }
    
    @PatchMapping("/{id}/confirmar")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE', 'RECEPCIONISTA')")
    public ResponseEntity<Reserva> confirmarReserva(@PathVariable Long id) {
        return ResponseEntity.ok(reservaService.confirmarReserva(id));
    }
    
    @PatchMapping("/{id}/finalizar")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE', 'RECEPCIONISTA')")
    public ResponseEntity<Void> finalizarReserva(@PathVariable Long id) {
        reservaService.finalizarReserva(id);
        return ResponseEntity.ok().build();
    }

    // ========== SERVICIOS A LA HABITACIÓN ==========
    
    @PostMapping("/{reservaId}/servicios")
    public ResponseEntity<ReservaServicio> agregarServicio(
            @PathVariable Long reservaId,
            @RequestBody Map<String, Object> request,
            Authentication auth) {
        Usuario usuario = obtenerUsuario(auth);
        Long servicioId = Long.valueOf(request.get("servicioId").toString());
        Integer cantidad = Integer.valueOf(request.get("cantidad").toString());
        return ResponseEntity.ok(reservaService.agregarServicioAReserva(reservaId, servicioId, cantidad, usuario));
    }

    @GetMapping("/{reservaId}/servicios")
    public ResponseEntity<List<ReservaServicio>> getServiciosByReserva(@PathVariable Long reservaId) {
        return ResponseEntity.ok(reservaService.getServiciosByReserva(reservaId));
    }

    @PatchMapping("/servicios/{reservaServicioId}/estado")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE', 'RECEPCIONISTA')")
    public ResponseEntity<ReservaServicio> actualizarEstadoServicio(
            @PathVariable Long reservaServicioId,
            @RequestBody Map<String, String> request,
            Authentication auth) {
        Usuario usuario = (Usuario) auth.getPrincipal();
        String estado = request.get("estado");
        return ResponseEntity.ok(reservaService.actualizarEstadoServicio(reservaServicioId, estado, usuario));
    }

    @DeleteMapping("/servicios/{reservaServicioId}")
    public ResponseEntity<Void> eliminarServicioDeReserva(
            @PathVariable Long reservaServicioId,
            Authentication auth) {
        Usuario usuario = obtenerUsuario(auth);
        reservaService.eliminarServicioDeReserva(reservaServicioId, usuario);
        return ResponseEntity.ok().build();
    }

    private Usuario obtenerUsuario(Authentication auth) {
        if (auth.getPrincipal() instanceof Usuario usuario) {
            return usuario;
        }
        throw new IllegalStateException("La sesión autenticada no contiene un usuario válido");
    }
}