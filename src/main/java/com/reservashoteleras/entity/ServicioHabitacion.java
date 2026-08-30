package com.reservashoteleras.entity;

import com.reservashoteleras.entity.enums.CategoriaServicio;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "servicios_habitacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServicioHabitacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String nombre;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoriaServicio categoria = CategoriaServicio.COMIDA;
    
    @Column(length = 255)
    private String descripcion;
    
    @Column(nullable = false)
    private BigDecimal precio;
    
    @Column(name = "url_imagen", length = 255)
    private String urlImagen;
    
    private Boolean disponible = true;

    // ✅ Métodos explícitos
    public void setDisponible(boolean disponible) {
        this.disponible = disponible;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setCategoria(CategoriaServicio categoria) {
        this.categoria = categoria;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public void setUrlImagen(String urlImagen) {
        this.urlImagen = urlImagen;
    }
}