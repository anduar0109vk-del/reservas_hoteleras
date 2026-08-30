package com.reservashoteleras.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservaDTO {
    private Long id;
    private String codigoReserva;
    private ClienteDTO cliente;
    private HabitacionDTO habitacion;
    private LocalDate fechaEntrada;
    private LocalDate fechaSalida;
    private Integer numeroHuespedes;
    private String estado;
    private BigDecimal montoTotal;
    private LocalDateTime fechaCreacion;
}