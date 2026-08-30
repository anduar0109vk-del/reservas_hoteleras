package com.reservashoteleras.controller;

import com.reservashoteleras.dto.ReservaDTO;
import com.reservashoteleras.entity.Reserva;
import com.reservashoteleras.entity.Usuario;
import com.reservashoteleras.service.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/recepcion")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'GERENTE', 'RECEPCIONISTA')")
public class RecepcionController {
    private final ReservaService reservaService;

    @GetMapping("/reservas")
    public ResponseEntity<List<ReservaDTO>> getReservas() {
        return ResponseEntity.ok(reservaService.getAllReservasDTO());
    }

    @GetMapping("/reservas/{id}")
    public ResponseEntity<ReservaDTO> getReservaById(@PathVariable Long id) {
        return ResponseEntity.ok(reservaService.getReservaByIdDTO(id));
    }

    @PatchMapping("/reservas/{id}/cancelar")
    public ResponseEntity<Reserva> cancelarReserva(@PathVariable Long id, @RequestParam String motivo, Authentication auth) {
        Usuario usuario = (Usuario) auth.getPrincipal();
        return ResponseEntity.ok(reservaService.cancelarReserva(id, motivo, usuario));
    }

    @PatchMapping("/reservas/{id}/confirmar")
    public ResponseEntity<Reserva> confirmarReserva(@PathVariable Long id) {
        return ResponseEntity.ok(reservaService.confirmarReserva(id));
    }

    @PatchMapping("/reservas/{id}/finalizar")
    public ResponseEntity<Void> finalizarReserva(@PathVariable Long id) {
        reservaService.finalizarReserva(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/checkin/{reservaId}")
    public ResponseEntity<Reserva> realizarCheckIn(@PathVariable Long reservaId) {
        return ResponseEntity.ok(reservaService.realizarCheckIn(reservaId));
    }

    @PatchMapping("/checkout/{reservaId}")
    public ResponseEntity<Reserva> realizarCheckOut(@PathVariable Long reservaId) {
        return ResponseEntity.ok(reservaService.realizarCheckOut(reservaId));
    }
}