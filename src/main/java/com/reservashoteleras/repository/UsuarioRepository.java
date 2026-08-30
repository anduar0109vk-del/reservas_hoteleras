package com.reservashoteleras.repository;

import com.reservashoteleras.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByNumeroDocumento(String numeroDocumento);
    boolean existsByEmail(String email);
    boolean existsByNumeroDocumento(String numeroDocumento);  // ✅ AGREGAR ESTE MÉTODO
}