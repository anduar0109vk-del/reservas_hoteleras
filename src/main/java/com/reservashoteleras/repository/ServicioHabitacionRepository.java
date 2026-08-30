package com.reservashoteleras.repository;

import com.reservashoteleras.entity.ServicioHabitacion;
import com.reservashoteleras.entity.enums.CategoriaServicio;  
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServicioHabitacionRepository extends JpaRepository<ServicioHabitacion, Long> {
    List<ServicioHabitacion> findByDisponibleTrue();
    List<ServicioHabitacion> findByCategoria(CategoriaServicio categoria);  
}