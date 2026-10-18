package com.reservashoteleras.repository;

import com.reservashoteleras.entity.ServicioHabitacion;
import com.reservashoteleras.entity.enums.CategoriaServicio;  
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ServicioHabitacionRepository extends JpaRepository<ServicioHabitacion, Long> {
    List<ServicioHabitacion> findByDisponibleTrue();
    List<ServicioHabitacion> findByCategoria(CategoriaServicio categoria);  

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select servicio from ServicioHabitacion servicio where servicio.id = :id")
    Optional<ServicioHabitacion> findByIdForUpdate(@Param("id") Long id);
}