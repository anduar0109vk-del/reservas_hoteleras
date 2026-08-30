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
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder; // ⚠️ Guardamos pero NO lo usamos para encode
    private final ClienteRepository clienteRepository;

    public LoginResponse login(LoginRequest request) {
        System.out.println("🔐 ======================================");
        System.out.println("🔐 Intentando login para: " + request.getEmail());
        System.out.println("🔐 Contraseña recibida: " + request.getPassword());
        
        try {
            // ✅ Autenticar con Spring Security
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail(), 
                    request.getPassword()
                )
            );
            
            System.out.println("✅ Autenticación exitosa para: " + request.getEmail());
            
            // Obtener usuario de la BD
            Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            // Generar token JWT
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            String token = jwtUtil.generateToken(userDetails);
            
            System.out.println("✅ Token generado exitosamente");
            
            return new LoginResponse(
                token,
                usuario.getEmail(),
                usuario.getNombres() + " " + usuario.getApellidos(),
                usuario.getRol().getNombre()
            );
            
        } catch (BadCredentialsException e) {
            System.err.println("❌ Credenciales inválidas para: " + request.getEmail());
            throw new RuntimeException("Credenciales incorrectas. Verifica tu email y contraseña.");
        } catch (Exception e) {
            System.err.println("❌ Error en login: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al iniciar sesión: " + e.getMessage());
        }
    }
    
    @Transactional
    public Usuario registrarUsuario(RegistroUsuarioRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        if (usuarioRepository.existsByNumeroDocumento(request.getNumeroDocumento())) {
            throw new RuntimeException("El número de documento ya está registrado");
        }
        
        Rol rol = rolRepository.findByNombre(request.getRol())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        
        Usuario usuario = new Usuario();
        usuario.setNombres(request.getNombres());
        usuario.setApellidos(request.getApellidos());
        usuario.setTipoDocumento(TipoDocumento.valueOf(request.getTipoDocumento()));
        usuario.setNumeroDocumento(request.getNumeroDocumento());
        usuario.setEmail(request.getEmail());
        usuario.setTelefono(request.getTelefono());
        // ⚠️ GUARDA LA CONTRASEÑA EN TEXTO PLANO (coincide con tu BD)
        usuario.setPasswordHash(request.getPassword()); 
        usuario.setRol(rol);
        usuario.setActivo(true);
        usuario.setFechaRegistro(LocalDateTime.now());
        
        Usuario saved = usuarioRepository.save(usuario);
        System.out.println("✅ Usuario registrado: " + saved.getEmail());
        
        if (rol.getNombre().equals("CLIENTE")) {
            Cliente cliente = new Cliente();
            cliente.setUsuario(saved);
            clienteRepository.save(cliente);
            System.out.println("✅ Cliente creado para: " + saved.getEmail());
        }
        
        return saved;
    }
}