package com.reservashoteleras.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.reservashoteleras.entity.enums.EstadoHabitacion;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "habitaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Habitacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(unique = true, nullable = false, length = 10)
    private String numero;
    
    private Integer piso;
    
    @ManyToOne
    @JoinColumn(name = "tipo_habitacion_id", nullable = false)
    private TipoHabitacion tipoHabitacion;
    
    @Enumerated(EnumType.STRING)
    private EstadoHabitacion estado = EstadoHabitacion.DISPONIBLE;
    
    @Column(name = "precio_actual", nullable = false)
    private BigDecimal precioActual;
    
    @Column(name = "veces_reservada")
    private Integer vecesReservada = 0;
    
    private Boolean destacada = false;
    
    @OneToMany(mappedBy = "habitacion")
    @JsonIgnore
    private List<Reserva> reservas;

    // ✅ Métodos explícitos
    public void setEstado(EstadoHabitacion estado) {
        this.estado = estado;
    }

    public void setTipoHabitacion(TipoHabitacion tipoHabitacion) {
        this.tipoHabitacion = tipoHabitacion;
    }

    public void setDestacada(boolean destacada) {
        this.destacada = destacada;
    }

    public void setVecesReservada(int vecesReservada) {
        this.vecesReservada = vecesReservada;
    }
}