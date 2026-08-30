package com.reservashoteleras.repository;

import com.reservashoteleras.entity.Habitacion;
import com.reservashoteleras.entity.enums.EstadoHabitacion; 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface HabitacionRepository extends JpaRepository<Habitacion, Integer> {
    List<Habitacion> findByEstado(EstadoHabitacion estado);
    
    @Query("SELECT h FROM Habitacion h WHERE h.estado = 'DISPONIBLE' AND h.id NOT IN " +
           "(SELECT r.habitacion.id FROM Reserva r WHERE r.estado IN ('PENDIENTE', 'CONFIRMADA') " +
           "AND (r.fechaEntrada <= ?2 AND r.fechaSalida >= ?1))")
    List<Habitacion> findDisponiblesEntreFechas(LocalDate fechaEntrada, LocalDate fechaSalida);
    
    @Query("SELECT h FROM Habitacion h ORDER BY h.vecesReservada DESC")
    List<Habitacion> findTopMasPedidas();
    
    List<Habitacion> findByDestacadaTrue();
}