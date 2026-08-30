package com.reservashoteleras.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class HabitacionRequest {
    private String numero;
    private Integer piso;
    private Integer tipoHabitacionId;
    private BigDecimal precioActual;
    private Boolean destacada = false;

    // ✅ Métodos explícitos
    public String getNumero() { return numero; }
    public Integer getPiso() { return piso; }
    public Integer getTipoHabitacionId() { return tipoHabitacionId; }
    public BigDecimal getPrecioActual() { return precioActual; }
    public Boolean getDestacada() { return destacada; }

    public void setNumero(String numero) { this.numero = numero; }
    public void setPiso(Integer piso) { this.piso = piso; }
    public void setTipoHabitacionId(Integer tipoHabitacionId) { this.tipoHabitacionId = tipoHabitacionId; }
    public void setPrecioActual(BigDecimal precioActual) { this.precioActual = precioActual; }
    public void setDestacada(Boolean destacada) { this.destacada = destacada; }
}