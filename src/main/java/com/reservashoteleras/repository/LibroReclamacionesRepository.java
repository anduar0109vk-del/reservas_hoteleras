package com.reservashoteleras.repository;

import com.reservashoteleras.entity.LibroReclamaciones;
import com.reservashoteleras.entity.enums.EstadoReclamo; 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LibroReclamacionesRepository extends JpaRepository<LibroReclamaciones, Long> {
    List<LibroReclamaciones> findByEstado(EstadoReclamo estado);  
    List<LibroReclamaciones> findByClienteId(Long clienteId);
}