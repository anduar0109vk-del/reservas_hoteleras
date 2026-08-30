package com.reservashoteleras.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HabitacionDTO {
    private Integer id;
    private String numero;
    private Integer piso;
    private String tipoHabitacion;
    private Integer capacidad;
    private BigDecimal precioActual;
    private String estado;
    private Boolean destacada;
}