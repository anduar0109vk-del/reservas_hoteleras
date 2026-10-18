package com.reservashoteleras.controller;

import com.reservashoteleras.entity.Pago;  // ✅ IMPORTAR Pago
import com.reservashoteleras.entity.Usuario;
import com.reservashoteleras.service.PagoService;
import com.stripe.exception.StripeException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/pagos")
@CrossOrigin(origins = "*")
public class PagoController {
    private final PagoService pagoService;

    public PagoController(PagoService pagoService) {
        this.pagoService = pagoService;
    }
    
    @PostMapping("/crear-intent/{reservaId}")
    public ResponseEntity<Map<String, String>> crearPaymentIntent(
            @PathVariable Long reservaId, Authentication auth) throws StripeException {
        return ResponseEntity.ok(pagoService.crearPaymentIntent(reservaId, obtenerUsuario(auth)));
    }

    @PostMapping("/demo/{reservaId}")
    public ResponseEntity<Void> confirmarPagoDemostracion(
            @PathVariable Long reservaId, Authentication auth) {
        pagoService.confirmarPagoDemostracion(reservaId, obtenerUsuario(auth));
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/confirmar")
    public ResponseEntity<Void> confirmarPago(
            @RequestBody Map<String, String> request, Authentication auth) throws StripeException {
        String paymentIntentId = request.get("paymentIntentId");
        pagoService.confirmarPago(paymentIntentId, obtenerUsuario(auth));
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/efectivo")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE', 'RECEPCIONISTA')")
    public ResponseEntity<Pago> registrarPagoEfectivo(
            @RequestBody Map<String, Object> request, Authentication auth) {
        Long reservaId = Long.valueOf(request.get("reservaId").toString());
        BigDecimal monto = new BigDecimal(request.get("monto").toString());
        return ResponseEntity.ok(pagoService.registrarPagoEfectivo(reservaId, monto, obtenerUsuario(auth)));
    }

    private Usuario obtenerUsuario(Authentication auth) {
        if (auth.getPrincipal() instanceof Usuario usuario) {
            return usuario;
        }
        throw new IllegalStateException("La sesión autenticada no contiene un usuario válido");
    }
}