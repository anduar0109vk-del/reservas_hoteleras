package com.reservashoteleras.controller;

import com.reservashoteleras.entity.Cliente;
import com.reservashoteleras.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClienteController {
    private final ClienteRepository clienteRepository;

    // ✅ Endpoint público para obtener cliente por email (CLIENTE)
    @GetMapping("/usuario/{email}")
    public ResponseEntity<Cliente> getClienteByEmail(@PathVariable String email) {
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