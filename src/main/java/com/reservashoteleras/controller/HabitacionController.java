package com.reservashoteleras.controller;

import com.reservashoteleras.dto.HabitacionRequest;
import com.reservashoteleras.entity.Habitacion;
import com.reservashoteleras.service.HabitacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/habitaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HabitacionController {
    private final HabitacionService habitacionService;
    
    @GetMapping
    public ResponseEntity<List<Habitacion>> getAll() {
        return ResponseEntity.ok(habitacionService.getAllHabitaciones());
    }
    
    @GetMapping("/disponibles")
    public ResponseEntity<List<Habitacion>> getDisponibles() {
        return ResponseEntity.ok(habitacionService.getDisponibles());
    }
    
    @GetMapping("/disponibles/fechas")
    public ResponseEntity<List<Habitacion>> getDisponiblesEntreFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate entrada,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate salida) {
        return ResponseEntity.ok(habitacionService.getDisponiblesEntreFechas(entrada, salida));
    }
    
    @GetMapping("/mas-pedidas")
    public ResponseEntity<List<Habitacion>> getMasPedidas() {
        return ResponseEntity.ok(habitacionService.getMasPedidas());
    }
    
    @GetMapping("/destacadas")
    public ResponseEntity<List<Habitacion>> getDestacadas() {
        return ResponseEntity.ok(habitacionService.getDestacadas());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Habitacion> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(habitacionService.getHabitacionById(id));
    }
    
    @PostMapping
    public ResponseEntity<Habitacion> crear(@RequestBody HabitacionRequest request) {
        return ResponseEntity.ok(habitacionService.crearHabitacion(request));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Habitacion> actualizar(@PathVariable Integer id, @RequestBody HabitacionRequest request) {
        return ResponseEntity.ok(habitacionService.actualizarHabitacion(id, request));
    }
}