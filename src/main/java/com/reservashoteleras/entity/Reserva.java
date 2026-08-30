package com.reservashoteleras.entity;

import com.reservashoteleras.entity.enums.EstadoReserva;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reservas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "codigo_reserva", unique = true, nullable = false, length = 20)
    private String codigoReserva;
    
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;
    
    @ManyToOne
    @JoinColumn(name = "habitacion_id", nullable = false)
    private Habitacion habitacion;
    
    @Column(name = "fecha_entrada", nullable = false)
    private LocalDate fechaEntrada;
    
    @Column(name = "fecha_salida", nullable = false)
    private LocalDate fechaSalida;
    
    @Column(name = "numero_huespedes")
    private Integer numeroHuespedes = 1;
    
    @Enumerated(EnumType.STRING)
    private EstadoReserva estado = EstadoReserva.PENDIENTE;
    
    @ManyToOne
    @JoinColumn(name = "promocion_id")
    private Promocion promocion;
    
    @Column(name = "subtotal_habitacion", nullable = false)
    private BigDecimal subtotalHabitacion;
    
    @Column(name = "subtotal_servicios")
    private BigDecimal subtotalServicios = BigDecimal.ZERO;
    
    private BigDecimal descuento = BigDecimal.ZERO;
    
    @Column(name = "monto_total", nullable = false)
    private BigDecimal montoTotal;
    
    @ManyToOne
    @JoinColumn(name = "creado_por", nullable = false)
    private Usuario creadoPor;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    
    @Column(name = "fecha_cancelacion")
    private LocalDateTime fechaCancelacion;
    
    @Column(name = "motivo_cancelacion")
    private String motivoCancelacion;
    
    @OneToMany(mappedBy = "reserva", cascade = CascadeType.ALL)
    private List<ReservaServicio> servicios = new ArrayList<>();
    
    @OneToOne(mappedBy = "reserva", cascade = CascadeType.ALL)
    private Pago pago;
    
    @OneToOne(mappedBy = "reserva", cascade = CascadeType.ALL)
    private CheckIn checkIn;

    // ✅ Métodos explícitos para evitar errores
    public void setEstado(EstadoReserva estado) {
        this.estado = estado;
    }

    public void setFechaCancelacion(LocalDateTime fechaCancelacion) {
        this.fechaCancelacion = fechaCancelacion;
    }

    public void setMotivoCancelacion(String motivoCancelacion) {
        this.motivoCancelacion = motivoCancelacion;
    }
}