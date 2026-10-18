package com.reservashoteleras.controller;

import com.reservashoteleras.entity.Cliente;
import com.reservashoteleras.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClienteController {
    private final ClienteRepository clienteRepository;

    @GetMapping("/usuario/{email}")
    public ResponseEntity<Cliente> getClienteByEmail(@PathVariable String email, Authentication authentication) {
        boolean esPersonal = authentication.getAuthorities().stream()
                .anyMatch(authority -> Set.of("ROLE_ADMIN", "ROLE_GERENTE", "ROLE_RECEPCIONISTA")
                        .contains(authority.getAuthority()));
        if (!esPersonal && !authentication.getName().equalsIgnoreCase(email)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Cliente cliente = clienteRepository.findByUsuarioEmail(email)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        return ResponseEntity.ok(cliente);
    }

    // ✅ Endpoint para ADMIN, GERENTE, RECEPCIONISTA - ver todos los clientes
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE', 'RECEPCIONISTA')")
    public ResponseEntity<List<Cliente>> getAllClientes() {
        return ResponseEntity.ok(clienteRepository.findAll());
    }

    // ✅ Endpoint para ADMIN, GERENTE, RECEPCIONISTA - ver cliente por ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE', 'RECEPCIONISTA')")
    public ResponseEntity<Cliente> getClienteById(@PathVariable Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        return ResponseEntity.ok(cliente);
    }
}