package com.reservashoteleras.repository;

import com.reservashoteleras.entity.Promocion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromocionRepository extends JpaRepository<Promocion, Long> {
    Optional<Promocion> findByCodigoAndActivoTrue(String codigo);
    List<Promocion> findByActivoTrueAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
        LocalDate fechaInicio, LocalDate fechaFin);
}