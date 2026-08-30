package com.reservashoteleras.service;

import com.reservashoteleras.entity.Habitacion;
import com.reservashoteleras.entity.Pago;
import com.reservashoteleras.entity.Reserva;
import com.reservashoteleras.entity.enums.EstadoHabitacion;
import com.reservashoteleras.entity.enums.EstadoPago;
import com.reservashoteleras.entity.enums.EstadoReserva;
import com.reservashoteleras.entity.enums.MetodoPago;
import com.reservashoteleras.repository.HabitacionRepository;
import com.reservashoteleras.repository.PagoRepository;
import com.reservashoteleras.repository.ReservaRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PagoService {
    private final PagoRepository pagoRepository;
    private final ReservaRepository reservaRepository;
    private final HabitacionRepository habitacionRepository;

    @Transactional
    public Map<String, String> crearPaymentIntent(Long reservaId) throws StripeException {
        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        
        BigDecimal monto = reserva.getMontoTotal();
        
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(monto.multiply(BigDecimal.valueOf(100)).longValue())
            .setCurrency("pen")
            .putAllMetadata(Map.of("reserva_id", reservaId.toString()))
            .build();
        
        PaymentIntent intent = PaymentIntent.create(params);
        
        Pago pago = pagoRepository.findByReservaId(reservaId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
        pago.setStripePaymentIntentId(intent.getId());
        pago.setEstado(EstadoPago.PENDIENTE);
        pagoRepository.save(pago);
        
        Map<String, String> response = new HashMap<>();
        response.put("clientSecret", intent.getClientSecret());
        response.put("paymentIntentId", intent.getId());
        return response;
    }

    @Transactional
    public void confirmarPago(String paymentIntentId) {
        Pago pago = pagoRepository.findByStripePaymentIntentId(paymentIntentId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
        pago.setEstado(EstadoPago.COMPLETADO);
        pago.setFechaPago(LocalDateTime.now());
        pagoRepository.save(pago);
        
        Reserva reserva = pago.getReserva();
        reserva.setEstado(EstadoReserva.CONFIRMADA);
        reservaRepository.save(reserva);
        
        Habitacion habitacion = reserva.getHabitacion();
        habitacion.setEstado(EstadoHabitacion.OCUPADA);
        habitacionRepository.save(habitacion);
    }

    @Transactional
    public Pago registrarPagoEfectivo(Long reservaId, BigDecimal monto) {
        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        
        if (reserva.getEstado() != EstadoReserva.PENDIENTE) {
            throw new RuntimeException("La reserva no está en estado pendiente");
        }
        
        Pago pago = pagoRepository.findByReservaId(reservaId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
        
        pago.setMetodoPago(MetodoPago.EFECTIVO);
        pago.setMonto(monto);
        pago.setEstado(EstadoPago.COMPLETADO);
        pago.setFechaPago(LocalDateTime.now());
        pagoRepository.save(pago);
        
        reserva.setEstado(EstadoReserva.CONFIRMADA);
        reservaRepository.save(reserva);
        
        Habitacion habitacion = reserva.getHabitacion();
        habitacion.setEstado(EstadoHabitacion.OCUPADA);
        habitacionRepository.save(habitacion);
        
        return pago;
    }
}