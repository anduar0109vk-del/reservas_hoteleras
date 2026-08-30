package com.reservashoteleras.service;

import com.reservashoteleras.entity.ServicioHabitacion;
import com.reservashoteleras.entity.enums.CategoriaServicio;
import com.reservashoteleras.repository.ServicioHabitacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ServicioHabitacionService {
    private final ServicioHabitacionRepository servicioHabitacionRepository;

    public List<ServicioHabitacion> getAllServicios() {
        return servicioHabitacionRepository.findAll();
    }

    public List<ServicioHabitacion> getServiciosDisponibles() {
        return servicioHabitacionRepository.findByDisponibleTrue();
    }

    public List<ServicioHabitacion> getServiciosByCategoria(CategoriaServicio categoria) {
        return servicioHabitacionRepository.findByCategoria(categoria);
    }

    public ServicioHabitacion getServicioById(Long id) {
        return servicioHabitacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
    }

    @Transactional
    public ServicioHabitacion crearServicio(String nombre, CategoriaServicio categoria, String descripcion, 
                                           BigDecimal precio, String urlImagen) {
        ServicioHabitacion servicio = new ServicioHabitacion();
        servicio.setNombre(nombre);
        servicio.setCategoria(categoria);
        servicio.setDescripcion(descripcion);
        servicio.setPrecio(precio);
        servicio.setUrlImagen(urlImagen);
        servicio.setDisponible(true);
        return servicioHabitacionRepository.save(servicio);
    }

    @Transactional
    public ServicioHabitacion actualizarServicio(Long id, String nombre, CategoriaServicio categoria, 
                                                 String descripcion, BigDecimal precio, String urlImagen) {
        ServicioHabitacion servicio = getServicioById(id);
        servicio.setNombre(nombre);
        servicio.setCategoria(categoria);
        servicio.setDescripcion(descripcion);
        servicio.setPrecio(precio);
        servicio.setUrlImagen(urlImagen);
        return servicioHabitacionRepository.save(servicio);
    }

    @Transactional
    public ServicioHabitacion cambiarDisponibilidad(Long id, Boolean disponible) {
        ServicioHabitacion servicio = getServicioById(id);
        servicio.setDisponible(disponible);
        return servicioHabitacionRepository.save(servicio);
    }

    @Transactional
    public void eliminarServicio(Long id) {
        servicioHabitacionRepository.deleteById(id);
    }
}