package com.reservashoteleras.controller;

import com.reservashoteleras.entity.ReservaServicio;
import com.reservashoteleras.entity.ServicioHabitacion;
import com.reservashoteleras.entity.Usuario;
import com.reservashoteleras.service.ReservaService;
import com.reservashoteleras.service.ServicioHabitacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/servicios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ServicioController {
    private final ServicioHabitacionService servicioService;
    private final ReservaService reservaService;

    @GetMapping("/disponibles")
    public ResponseEntity<List<ServicioHabitacion>> getServiciosDisponibles() {
        return ResponseEntity.ok(servicioService.getServiciosDisponibles());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ServicioHabitacion>> getAllServicios() {
        return ResponseEntity.ok(servicioService.getAllServicios());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServicioHabitacion> crearServicio(@RequestBody ServicioHabitacion servicio) {
        return ResponseEntity.ok(servicioService.crearServicio(
            servicio.getNombre(),
            servicio.getCategoria(),
            servicio.getDescripcion(),
            servicio.getPrecio(),
            servicio.getUrlImagen()
        ));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServicioHabitacion> actualizarServicio(@PathVariable Long id, @RequestBody ServicioHabitacion servicio) {
        return ResponseEntity.ok(servicioService.actualizarServicio(
            id,
            servicio.getNombre(),
            servicio.getCategoria(),
            servicio.getDescripcion(),
            servicio.getPrecio(),
            servicio.getUrlImagen()
        ));
    }

    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServicioHabitacion> toggleDisponibilidad(@PathVariable Long id, @RequestBody boolean disponible) {
        return ResponseEntity.ok(servicioService.cambiarDisponibilidad(id, disponible));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarServicio(@PathVariable Long id) {
        servicioService.eliminarServicio(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reserva/{reservaId}")
    public ResponseEntity<ReservaServicio> agregarServicioAReserva(
            @PathVariable Long reservaId,
            @RequestBody Map<String, Object> request,
            Authentication auth) {
        Usuario usuario = (Usuario) auth.getPrincipal();
        Long servicioId = Long.valueOf(request.get("servicioId").toString());
        Integer cantidad = Integer.valueOf(request.get("cantidad").toString());
        return ResponseEntity.ok(reservaService.agregarServicioAReserva(reservaId, servicioId, cantidad, usuario));
    }

    @GetMapping("/reserva/{reservaId}")
    public ResponseEntity<List<ReservaServicio>> getServiciosByReserva(@PathVariable Long reservaId) {
        return ResponseEntity.ok(reservaService.getServiciosByReserva(reservaId));
    }

    @PatchMapping("/reserva/{reservaServicioId}/estado")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE', 'RECEPCIONISTA')")
    public ResponseEntity<ReservaServicio> actualizarEstadoServicio(
            @PathVariable Long reservaServicioId,
            @RequestBody Map<String, String> request,
            Authentication auth) {
        Usuario usuario = (Usuario) auth.getPrincipal();
        String estado = request.get("estado");
        return ResponseEntity.ok(reservaService.actualizarEstadoServicio(reservaServicioId, estado, usuario));
    }

    @DeleteMapping("/reserva/{reservaServicioId}")
    public ResponseEntity<Void> eliminarServicioDeReserva(
            @PathVariable Long reservaServicioId,
            Authentication auth) {
        Usuario usuario = (Usuario) auth.getPrincipal();
        reservaService.eliminarServicioDeReserva(reservaServicioId, usuario);
        return ResponseEntity.ok().build();
    }
}