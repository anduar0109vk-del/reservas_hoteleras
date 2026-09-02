package com.reservashoteleras.controller;

import com.reservashoteleras.entity.Habitacion;
import com.reservashoteleras.entity.Promocion;
import com.reservashoteleras.entity.Reserva;
import com.reservashoteleras.service.HabitacionService;
import com.reservashoteleras.service.PromocionService;
import com.reservashoteleras.service.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/gerente")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'GERENTE')")
public class GerenteController {
    private final HabitacionService habitacionService;
    private final PromocionService promocionService;
    private final ReservaService reservaService;

    @GetMapping("/reservas")
    public ResponseEntity<List<Reserva>> getReservas() {
        return ResponseEntity.ok(reservaService.getAllReservas());
    }

    @GetMapping("/habitaciones")
    public ResponseEntity<List<Habitacion>> getHabitaciones() {
        return ResponseEntity.ok(habitacionService.getAllHabitaciones());
    }

    @PostMapping("/habitaciones")
    public ResponseEntity<Habitacion> crearHabitacion(@RequestBody Habitacion habitacion) {
        return ResponseEntity.ok(habitacionService.save(habitacion));
    }

    @GetMapping("/promociones")
    public ResponseEntity<List<Promocion>> getPromociones() {
        return ResponseEntity.ok(promocionService.getAllPromociones());
    }

    @PostMapping("/promociones")
    public ResponseEntity<Promocion> crearPromocion(@RequestBody Promocion promocion) {
        return ResponseEntity.ok(promocionService.save(promocion));
    }
}