package com.reservashoteleras.repository;

import com.reservashoteleras.entity.ReservaServicio;
import com.reservashoteleras.entity.enums.EstadoServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReservaServicioRepository extends JpaRepository<ReservaServicio, Long> {
    
    List<ReservaServicio> findByReservaId(Long reservaId);
    
    List<ReservaServicio> findByEstado(EstadoServicio estado);
    
    List<ReservaServicio> findByReservaIdAndEstado(Long reservaId, EstadoServicio estado);
    
    // ✅ Método para encontrar servicios NO cancelados
    @Query("SELECT rs FROM ReservaServicio rs WHERE rs.reserva.id = :reservaId AND rs.estado != :estado")
    List<ReservaServicio> findByReservaIdAndEstadoNot(
        @Param("reservaId") Long reservaId, 
        @Param("estado") EstadoServicio estado
    );
    
    // ✅ Método para encontrar servicios por múltiples estados
    @Query("SELECT rs FROM ReservaServicio rs WHERE rs.reserva.id = :reservaId AND rs.estado IN :estados")
    List<ReservaServicio> findByReservaIdAndEstadoIn(
        @Param("reservaId") Long reservaId, 
        @Param("estados") List<EstadoServicio> estados
    );
    
    // ✅ Contar servicios por reserva y estado
    long countByReservaIdAndEstado(Long reservaId, EstadoServicio estado);
    
    // ✅ Eliminar todos los servicios de una reserva
    void deleteByReservaId(Long reservaId);
}