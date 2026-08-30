package com.reservashoteleras.security;

import com.reservashoteleras.entity.Usuario;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Getter
public class UsuarioPrincipal implements UserDetails {
    private final Usuario usuario;
    
    public UsuarioPrincipal(Usuario usuario) {
        this.usuario = usuario;
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(
            new SimpleGrantedAuthority("ROLE_" + usuario.getRol().getNombre())
        );
    }
    
    @Override
    public String getPassword() {
        return usuario.getPasswordHash();
    }
    
    @Override
    public String getUsername() {
        return usuario.getEmail();
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return usuario.isActivo();
    }
    
    // Método para obtener el ID del usuario
    public Long getId() {
        return usuario.getId();
    }
}