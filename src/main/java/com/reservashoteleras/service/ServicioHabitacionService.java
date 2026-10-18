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
                                           BigDecimal precio, String urlImagen, Integer stock) {
        ServicioHabitacion servicio = new ServicioHabitacion();
        servicio.setNombre(nombre);
        servicio.setCategoria(categoria);
        servicio.setDescripcion(descripcion);
        servicio.setPrecio(precio);
        servicio.setUrlImagen(urlImagen);
        servicio.setStock(validarStock(stock == null ? 0 : stock));
        servicio.setDisponible(true);
        return servicioHabitacionRepository.save(servicio);
    }

    @Transactional
    public ServicioHabitacion actualizarServicio(Long id, String nombre, CategoriaServicio categoria, 
                                                 String descripcion, BigDecimal precio, String urlImagen,
                                                 Integer stock) {
        ServicioHabitacion servicio = getServicioById(id);
        servicio.setNombre(nombre);
        servicio.setCategoria(categoria);
        servicio.setDescripcion(descripcion);
        servicio.setPrecio(precio);
        servicio.setUrlImagen(urlImagen);
        if (stock != null) {
            servicio.setStock(validarStock(stock));
        }
        return servicioHabitacionRepository.save(servicio);
    }

    @Transactional
    public ServicioHabitacion actualizarStock(Long id, Integer stock) {
        ServicioHabitacion servicio = getServicioForUpdate(id);
        servicio.setStock(validarStock(stock));
        return servicioHabitacionRepository.save(servicio);
    }

    @Transactional
    public ServicioHabitacion descontarStock(Long id, Integer cantidad) {
        if (cantidad == null || cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a 0");
        }

        ServicioHabitacion servicio = getServicioForUpdate(id);
        if (!Boolean.TRUE.equals(servicio.getDisponible())) {
            throw new IllegalStateException("Servicio no disponible");
        }
        int stockActual = servicio.getStock() == null ? 0 : servicio.getStock();
        if (stockActual < cantidad) {
            throw new IllegalStateException("Stock insuficiente. Disponibles: " + stockActual);
        }

        servicio.setStock(stockActual - cantidad);
        return servicioHabitacionRepository.save(servicio);
    }

    @Transactional
    public ServicioHabitacion reponerStock(Long id, Integer cantidad) {
        if (cantidad == null || cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad a reponer debe ser mayor a 0");
        }

        ServicioHabitacion servicio = getServicioForUpdate(id);
        int stockActual = servicio.getStock() == null ? 0 : servicio.getStock();
        servicio.setStock(Math.addExact(stockActual, cantidad));
        return servicioHabitacionRepository.save(servicio);
    }

    private ServicioHabitacion getServicioForUpdate(Long id) {
        return servicioHabitacionRepository.findByIdForUpdate(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
    }

    private Integer validarStock(Integer stock) {
        if (stock == null || stock < 0) {
            throw new IllegalArgumentException("El stock no puede ser negativo");
        }
        return stock;
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