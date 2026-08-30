package com.reservashoteleras.service;

import com.reservashoteleras.entity.Promocion;
import com.reservashoteleras.entity.Usuario;
import com.reservashoteleras.entity.enums.TipoDescuento;
import com.reservashoteleras.repository.PromocionRepository;
import com.reservashoteleras.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PromocionService {
    private final PromocionRepository promocionRepository;
    private final UsuarioRepository usuarioRepository;
    
    public List<Promocion> getPromocionesActivas() {
        return promocionRepository.findByActivoTrueAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
            LocalDate.now(), LocalDate.now()
        );
    }
    
    public List<Promocion> getAllPromociones() {
        return promocionRepository.findAll();
    }
    
    public Promocion getPromocionById(Long id) {
        return promocionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promoción no encontrada"));
    }
    
    public Promocion getPromocionByCodigo(String codigo) {
        return promocionRepository.findByCodigoAndActivoTrue(codigo)
                .orElseThrow(() -> new RuntimeException("Promoción no encontrada"));
    }
    
    // ✅ MÉTODO SAVE PARA CREAR PROMOCIÓN
    public Promocion save(Promocion promocion) {
        return promocionRepository.save(promocion);
    }
    
    @Transactional
    public Promocion crearPromocion(String codigo, String nombre, String descripcion, TipoDescuento tipoDescuento,
                                   BigDecimal valor, LocalDate fechaInicio, LocalDate fechaFin, Long creadoPorId) {
        Usuario creador = usuarioRepository.findById(creadoPorId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        Promocion promocion = new Promocion();
        promocion.setCodigo(codigo);
        promocion.setNombre(nombre);
        promocion.setDescripcion(descripcion);
        promocion.setTipoDescuento(tipoDescuento);
        promocion.setValor(valor);
        promocion.setFechaInicio(fechaInicio);
        promocion.setFechaFin(fechaFin);
        promocion.setActivo(true);
        promocion.setCreadoPor(creador);
        
        return promocionRepository.save(promocion);
    }
}