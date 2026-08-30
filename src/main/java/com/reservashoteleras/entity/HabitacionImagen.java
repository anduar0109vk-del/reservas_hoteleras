package com.reservashoteleras.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "habitacion_imagenes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HabitacionImagen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "habitacion_id", nullable = false)
    private Habitacion habitacion;
    
    @Column(name = "url_imagen", nullable = false)
    private String urlImagen;
    
    private Integer orden = 0;
}
