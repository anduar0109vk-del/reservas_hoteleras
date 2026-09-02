package com.reservashoteleras.controller;

import com.reservashoteleras.entity.Reserva;
import com.reservashoteleras.entity.Usuario;
import com.reservashoteleras.repository.ReservaRepository;
import com.reservashoteleras.service.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
public class FacturaController {
    private final ReservaRepository reservaRepository;
    private final ReporteService reporteService;

    @PostMapping("/{id}/factura/pdf")
    public ResponseEntity<byte[]> generar(@PathVariable Long id, @RequestBody(required = false) Map<String, String> request,
                                          Authentication authentication) throws Exception {
        Reserva reserva = reservaRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada"));
        Usuario usuario = (Usuario) authentication.getPrincipal();
        boolean staff = usuario.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")
                || a.getAuthority().equals("ROLE_GERENTE") || a.getAuthority().equals("ROLE_RECEPCIONISTA"));
        if (!staff && (reserva.getCliente() == null || reserva.getCliente().getUsuario() == null
                || !usuario.getId().equals(reserva.getCliente().getUsuario().getId()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Map<String, String> data = request == null ? Map.of() : request;
        String tipo = "FACTURA".equals(data.get("tipo")) ? "FACTURA" : "BOLETA";
        if ("FACTURA".equals(tipo) && (data.getOrDefault("ruc", "").length() != 11 || !data.get("ruc").matches("\\d{11}"))) {
            return ResponseEntity.badRequest().build();
        }
        byte[] pdf = reporteService.generarFacturaPDF(reserva, tipo, data.get("ruc"), data.get("razonSocial"), data.get("direccion"));
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
                        .filename("comprobante-" + reserva.getCodigoReserva() + ".pdf").build().toString()).body(pdf);
    }
}
