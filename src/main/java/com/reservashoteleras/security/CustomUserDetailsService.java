package com.reservashoteleras.security;

import com.reservashoteleras.entity.Usuario;
import com.reservashoteleras.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UsuarioRepository usuarioRepository;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("🔍 Buscando usuario por email: " + email);
        
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.err.println("❌ Usuario no encontrado: " + email);
                    return new UsernameNotFoundException("Usuario no encontrado: " + email);
                });
        
        System.out.println("✅ Usuario encontrado: " + usuario.getEmail());
        System.out.println("🔑 Password en BD: " + usuario.getPasswordHash());
        System.out.println("👤 Rol: " + usuario.getRol().getNombre());
        
        return usuario;
    }
}