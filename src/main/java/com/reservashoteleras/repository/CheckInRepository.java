package com.reservashoteleras.repository;

import com.reservashoteleras.entity.CheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
    Optional<CheckIn> findByReservaId(Long reservaId);
}