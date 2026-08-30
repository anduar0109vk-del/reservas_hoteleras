package com.reservashoteleras.repository;

import com.reservashoteleras.entity.TipoHabitacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoHabitacionRepository extends JpaRepository<TipoHabitacion, Integer> {
}