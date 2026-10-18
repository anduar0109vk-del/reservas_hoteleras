package com.reservashoteleras.service;

import com.reservashoteleras.entity.Pago;
import com.reservashoteleras.entity.Reserva;
import com.reservashoteleras.entity.Usuario;
import com.reservashoteleras.entity.enums.EstadoPago;
import com.reservashoteleras.entity.enums.EstadoReserva;
import com.reservashoteleras.entity.enums.MetodoPago;
import com.reservashoteleras.repository.ClienteRepository;
import com.reservashoteleras.repository.PagoRepository;
import com.reservashoteleras.repository.ReservaRepository;
import org.springframework.security.access.AccessDeniedException;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class PagoService {
    private final PagoRepository pagoRepository;
    private final ReservaRepository reservaRepository;
    private final ClienteRepository clienteRepository;

    public PagoService(PagoRepository pagoRepository, ReservaRepository reservaRepository,
                       ClienteRepository clienteRepository) {
        this.pagoRepository = pagoRepository;
        this.reservaRepository = reservaRepository;
        this.clienteRepository = clienteRepository;
    }

    @Value("${payments.demo-mode:false}")
    private boolean demoMode;

    @Transactional
    public Map<String, String> crearPaymentIntent(Long reservaId, Usuario usuario) throws StripeException {
        if (demoMode) {
            throw new IllegalStateException("Stripe está desactivado en el modo de demostración");
        }
        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        validarAccesoReserva(reserva, usuario);
        if (reserva.getEstado() != EstadoReserva.PENDIENTE) {
            throw new RuntimeException("La reserva no está pendiente de pago");
        }
        
        BigDecimal monto = reserva.getMontoTotal();
        
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(monto.movePointRight(2).setScale(0, java.math.RoundingMode.HALF_UP).longValueExact())
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
    public void confirmarPago(String paymentIntentId, Usuario usuario) throws StripeException {
        if (demoMode) {
            throw new IllegalStateException("Stripe está desactivado en el modo de demostración");
        }
        Pago pago = pagoRepository.findByStripePaymentIntentId(paymentIntentId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
        Reserva reserva = pago.getReserva();
        validarAccesoReserva(reserva, usuario);
        if (reserva.getEstado() != EstadoReserva.PENDIENTE) {
            throw new RuntimeException("La reserva no está pendiente de pago");
        }

        PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);
        long montoEsperado = reserva.getMontoTotal()
                .movePointRight(2).setScale(0, java.math.RoundingMode.HALF_UP).longValueExact();
        if (!"succeeded".equals(intent.getStatus())
                || !Long.valueOf(montoEsperado).equals(intent.getAmount())
                || intent.getMetadata() == null
                || !reserva.getId().toString().equals(intent.getMetadata().get("reserva_id"))) {
            throw new RuntimeException("Stripe no confirma el pago completo de esta reserva");
        }

        pago.setEstado(EstadoPago.COMPLETADO);
        pago.setFechaPago(LocalDateTime.now());
        pagoRepository.save(pago);
        
        reserva.setEstado(EstadoReserva.CONFIRMADA);
        reservaRepository.save(reserva);
    }

    @Transactional
    public void confirmarPagoDemostracion(Long reservaId, Usuario usuario) {
        if (!demoMode) {
            throw new IllegalStateException("Los pagos de demostración están desactivados");
        }

        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        validarAccesoReserva(reserva, usuario);
        if (reserva.getEstado() != EstadoReserva.PENDIENTE) {
            throw new RuntimeException("La reserva no está pendiente de pago");
        }

        Pago pago = pagoRepository.findByReservaId(reservaId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
        if (pago.getEstado() != EstadoPago.PENDIENTE) {
            throw new RuntimeException("El pago ya fue procesado");
        }

        pago.setMetodoPago(MetodoPago.TARJETA);
        pago.setEstado(EstadoPago.COMPLETADO);
        pago.setFechaPago(LocalDateTime.now());
        pagoRepository.save(pago);

        reserva.setEstado(EstadoReserva.CONFIRMADA);
        reservaRepository.save(reserva);
    }

    @Transactional
    public Pago registrarPagoEfectivo(Long reservaId, BigDecimal monto, Usuario usuario) {
        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        validarAccesoReserva(reserva, usuario);
        
        if (reserva.getEstado() != EstadoReserva.PENDIENTE) {
            throw new RuntimeException("La reserva no está en estado pendiente");
        }
        if (monto == null || monto.compareTo(reserva.getMontoTotal()) != 0) {
            throw new RuntimeException("El monto del pago debe coincidir con el total de la reserva");
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
        
        return pago;
    }

    private void validarAccesoReserva(Reserva reserva, Usuario usuario) {
        if ("CLIENTE".equals(usuario.getRol().getNombre())) {
            boolean esPropietario = clienteRepository.findByUsuarioId(usuario.getId())
                    .map(cliente -> cliente.getId().equals(reserva.getCliente().getId()))
                    .orElse(false);
            if (!esPropietario) {
                throw new AccessDeniedException("No tienes permiso para realizar pagos de esta reserva");
            }
        }
    }
}