package com.reservashoteleras.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "tipos_habitacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TipoHabitacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, length = 50)
    private String nombre;
    
    private Integer capacidad;
    
    @Column(name = "precio_base", nullable = false)
    private BigDecimal precioBase;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
}
