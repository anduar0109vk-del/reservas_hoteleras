package com.reservashoteleras.dto;

import com.reservashoteleras.entity.enums.EstadoReclamo;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReclamoEstadoRequest {
    @NotNull
    private EstadoReclamo estado;
    @Size(max = 5000)
    private String respuesta;
}
