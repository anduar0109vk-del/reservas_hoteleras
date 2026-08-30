package com.reservashoteleras.repository;

import com.reservashoteleras.entity.Pago;
import com.reservashoteleras.entity.enums.EstadoPago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {
    List<Pago> findByEstado(EstadoPago estado);
    Optional<Pago> findByStripePaymentIntentId(String paymentIntentId);
    Optional<Pago> findByReservaId(Long reservaId);
}