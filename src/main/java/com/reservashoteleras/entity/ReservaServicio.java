package com.reservashoteleras.entity;

import com.reservashoteleras.entity.enums.EstadoServicio;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reserva_servicios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservaServicio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "reserva_id", nullable = false)
    private Reserva reserva;
    
    @ManyToOne
    @JoinColumn(name = "servicio_id", nullable = false)
    private ServicioHabitacion servicio;
    
    private Integer cantidad = 1;
    
    @Column(name = "precio_unitario", nullable = false)
    private BigDecimal precioUnitario;
    
    private BigDecimal subtotal;
    
    @Enumerated(EnumType.STRING)
    private EstadoServicio estado = EstadoServicio.SOLICITADO;
    
    @Column(name = "fecha_solicitud")
    private LocalDateTime fechaSolicitud = LocalDateTime.now();
    
    @Column(name = "fecha_entrega")
    private LocalDateTime fechaEntrega;
}