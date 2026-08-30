package com.reservashoteleras.controller;

import com.reservashoteleras.dto.LoginRequest;
import com.reservashoteleras.dto.LoginResponse;
import com.reservashoteleras.dto.RegistroUsuarioRequest;
import com.reservashoteleras.entity.Usuario;
import com.reservashoteleras.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
    
    @PostMapping("/registro")
    public ResponseEntity<Usuario> registrar(@RequestBody RegistroUsuarioRequest request) {
        return ResponseEntity.ok(authService.registrarUsuario(request));
    }
}