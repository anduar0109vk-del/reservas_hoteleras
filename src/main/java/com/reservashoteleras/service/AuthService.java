package com.reservashoteleras.service;

import com.reservashoteleras.dto.LoginRequest;
import com.reservashoteleras.dto.LoginResponse;
import com.reservashoteleras.dto.RegistroUsuarioRequest;
import com.reservashoteleras.entity.Cliente;
import com.reservashoteleras.entity.Rol;
import com.reservashoteleras.entity.Usuario;
import com.reservashoteleras.entity.enums.TipoDocumento;
import com.reservashoteleras.repository.ClienteRepository;
import com.reservashoteleras.repository.RolRepository;
import com.reservashoteleras.repository.UsuarioRepository;
import com.reservashoteleras.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final ClienteRepository clienteRepository;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
                )
        );

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!isBcryptHash(usuario.getPasswordHash())) {
            usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            usuarioRepository.save(usuario);
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

        return new LoginResponse(
                token,
                usuario.getEmail(),
                usuario.getNombres() + " " + usuario.getApellidos(),
                usuario.getRol().getNombre()
        );
    }

    private boolean isBcryptHash(String value) {
        return value != null && (value.startsWith("$2a$") || value.startsWith("$2b$")
                || value.startsWith("$2y$"));
    }

    @Transactional
    public Usuario registrarUsuario(RegistroUsuarioRequest request, String rolNombre) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        if (usuarioRepository.existsByNumeroDocumento(request.getNumeroDocumento())) {
            throw new RuntimeException("El número de documento ya está registrado");
        }
        
        Rol rol = rolRepository.findByNombre(rolNombre)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        
        Usuario usuario = new Usuario();
        usuario.setNombres(request.getNombres());
        usuario.setApellidos(request.getApellidos());
        usuario.setTipoDocumento(TipoDocumento.valueOf(request.getTipoDocumento()));
        usuario.setNumeroDocumento(request.getNumeroDocumento());
        usuario.setEmail(request.getEmail());
        usuario.setTelefono(request.getTelefono());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(rol);
        usuario.setActivo(true);
        usuario.setFechaRegistro(LocalDateTime.now());
        
        Usuario saved = usuarioRepository.save(usuario);
        if (rol.getNombre().equals("CLIENTE")) {
            Cliente cliente = new Cliente();
            cliente.setUsuario(saved);
            clienteRepository.save(cliente);
        }
        
        return saved;
    }
}