package com.reservashoteleras.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "empleados")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Empleado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;
    
    @Column(length = 60)
    private String cargo;
    
    @Column(name = "fecha_contratacion")
    private LocalDate fechaContratacion;
    
    private BigDecimal sueldo;
    
    @ManyToOne
    @JoinColumn(name = "registrado_por")
    private Usuario registradoPor;
}
