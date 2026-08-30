package com.reservashoteleras.repository;

import com.reservashoteleras.entity.Reserva;
import com.reservashoteleras.entity.enums.EstadoReserva; 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByClienteId(Long clienteId);
    List<Reserva> findByEstado(EstadoReserva estado);  
    List<Reserva> findByFechaEntradaBetween(LocalDate inicio, LocalDate fin);
    List<Reserva> findByFechaSalidaBetween(LocalDate inicio, LocalDate fin);
    boolean existsByHabitacionIdAndFechaEntradaLessThanEqualAndFechaSalidaGreaterThanEqual(
        Integer habitacionId, LocalDate fechaSalida, LocalDate fechaEntrada);
}