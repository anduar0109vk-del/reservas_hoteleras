package com.reservashoteleras.controller;

import com.reservashoteleras.dto.*;
import com.reservashoteleras.entity.Usuario;
import com.reservashoteleras.service.ReclamoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/reclamos") @RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReclamoController {
    private final ReclamoService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','GERENTE','RECEPCIONISTA')")
    public List<ReclamoResponse> listarTodos(Authentication auth) {
        return service.listar((Usuario) auth.getPrincipal());
    }

    @GetMapping("/mis-reclamos")
    @PreAuthorize("hasAnyRole('CLIENTE','ADMIN','GERENTE','RECEPCIONISTA')")
    public List<ReclamoResponse> listar(Authentication auth) {
        return service.listar((Usuario) auth.getPrincipal());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENTE','ADMIN','GERENTE','RECEPCIONISTA')")
    public ResponseEntity<ReclamoResponse> crear(@Valid @RequestBody ReclamoRequest request, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(request, (Usuario) auth.getPrincipal()));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMIN','GERENTE','RECEPCIONISTA')")
    public ReclamoResponse actualizar(@PathVariable Long id, @Valid @RequestBody ReclamoEstadoRequest request, Authentication auth) {
        return service.actualizar(id, request, (Usuario) auth.getPrincipal());
    }
}
