package com.reservashoteleras.dto;

import lombok.Data;

@Data
public class ServicioRequest {
    private Long servicioId;
    private Integer cantidad;

    public Long getServicioId() { return servicioId; }
    public Integer getCantidad() { return cantidad; }

    public void setServicioId(Long servicioId) { this.servicioId = servicioId; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}