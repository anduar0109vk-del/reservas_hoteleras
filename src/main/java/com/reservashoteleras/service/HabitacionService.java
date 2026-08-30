package com.reservashoteleras.service;

import com.reservashoteleras.dto.HabitacionRequest;
import com.reservashoteleras.entity.Habitacion;
import com.reservashoteleras.entity.TipoHabitacion;
import com.reservashoteleras.entity.enums.EstadoHabitacion;
import com.reservashoteleras.repository.HabitacionRepository;
import com.reservashoteleras.repository.TipoHabitacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HabitacionService {
    private final HabitacionRepository habitacionRepository;
    private final TipoHabitacionRepository tipoHabitacionRepository;
    
    public List<Habitacion> getAllHabitaciones() {
        return habitacionRepository.findAll();
    }
    
    public List<Habitacion> getDisponibles() {
        return habitacionRepository.findByEstado(EstadoHabitacion.DISPONIBLE);
    }
    
    public List<Habitacion> getDisponiblesEntreFechas(LocalDate entrada, LocalDate salida) {
        return habitacionRepository.findDisponiblesEntreFechas(entrada, salida);
    }
    
    public List<Habitacion> getMasPedidas() {
        return habitacionRepository.findTopMasPedidas();
    }
    
    public List<Habitacion> getDestacadas() {
        return habitacionRepository.findByDestacadaTrue();
    }
    
    public Habitacion getHabitacionById(Integer id) {
        return habitacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Habitación no encontrada"));
    }
    
    // ✅ MÉTODO SAVE PARA CREAR HABITACIÓN
    public Habitacion save(Habitacion habitacion) {
        return habitacionRepository.save(habitacion);
    }
    
    @Transactional
    public Habitacion crearHabitacion(HabitacionRequest request) {
        TipoHabitacion tipo = tipoHabitacionRepository.findById(request.getTipoHabitacionId())
                .orElseThrow(() -> new RuntimeException("Tipo de habitación no encontrado"));
        
        Habitacion habitacion = new Habitacion();
        habitacion.setNumero(request.getNumero());
        habitacion.setPiso(request.getPiso());
        habitacion.setTipoHabitacion(tipo);
        habitacion.setPrecioActual(request.getPrecioActual());
        habitacion.setDestacada(request.getDestacada() != null ? request.getDestacada() : false);
        habitacion.setEstado(EstadoHabitacion.DISPONIBLE);
        habitacion.setVecesReservada(0);
        
        return habitacionRepository.save(habitacion);
    }
    
    @Transactional
    public Habitacion actualizarHabitacion(Integer id, HabitacionRequest request) {
        Habitacion habitacion = getHabitacionById(id);
        
        if (request.getNumero() != null) {
            habitacion.setNumero(request.getNumero());
        }
        if (request.getPiso() != null) {
            habitacion.setPiso(request.getPiso());
        }
        if (request.getTipoHabitacionId() != null) {
            TipoHabitacion tipo = tipoHabitacionRepository.findById(request.getTipoHabitacionId())
                    .orElseThrow(() -> new RuntimeException("Tipo de habitación no encontrado"));
            habitacion.setTipoHabitacion(tipo);
        }
        if (request.getPrecioActual() != null) {
            habitacion.setPrecioActual(request.getPrecioActual());
        }
        if (request.getDestacada() != null) {
            habitacion.setDestacada(request.getDestacada());
        }
        
        return habitacionRepository.save(habitacion);
    }
    
    @Transactional
    public void cambiarEstadoHabitacion(Integer id, EstadoHabitacion estado) {
        Habitacion habitacion = getHabitacionById(id);
        habitacion.setEstado(estado);
        habitacionRepository.save(habitacion);
    }
}