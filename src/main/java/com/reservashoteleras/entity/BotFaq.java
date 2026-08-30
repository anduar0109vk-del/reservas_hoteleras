package com.reservashoteleras.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "bot_faq")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BotFaq {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 255)
    private String pregunta;
    
    @Column(name = "palabras_clave", nullable = false, length = 255)
    private String palabrasClave;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String respuesta;
    
    private Boolean activo = true;
    
    @ManyToOne
    @JoinColumn(name = "creado_por")
    private Usuario creadoPor;
}
