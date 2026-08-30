package com.reservashoteleras.controller;

import com.reservashoteleras.entity.Pago;  // ✅ IMPORTAR Pago
import com.reservashoteleras.service.PagoService;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PagoController {
    private final PagoService pagoService;
    
    @PostMapping("/crear-intent/{reservaId}")
    public ResponseEntity<Map<String, String>> crearPaymentIntent(@PathVariable Long reservaId) throws StripeException {
        return ResponseEntity.ok(pagoService.crearPaymentIntent(reservaId));
    }
    
    @PostMapping("/confirmar")
    public ResponseEntity<Void> confirmarPago(@RequestBody Map<String, String> request) {
        String paymentIntentId = request.get("paymentIntentId");
        pagoService.confirmarPago(paymentIntentId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/efectivo")
    public ResponseEntity<Pago> registrarPagoEfectivo(@RequestBody Map<String, Object> request) {
        Long reservaId = Long.valueOf(request.get("reservaId").toString());
        BigDecimal monto = new BigDecimal(request.get("monto").toString());
        return ResponseEntity.ok(pagoService.registrarPagoEfectivo(reservaId, monto));
    }
}