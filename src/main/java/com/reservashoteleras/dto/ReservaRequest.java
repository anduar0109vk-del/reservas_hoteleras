package com.reservashoteleras.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class ReservaRequest {
    private Long clienteId;
    private Integer habitacionId;
    private LocalDate fechaEntrada;
    private LocalDate fechaSalida;
    private Integer numeroHuespedes = 1;
    private String codigoPromocion;
    private List<ServicioRequest> servicios;
    private String metodoPago;

    // ✅ Métodos explícitos
    public Long getClienteId() { return clienteId; }
    public Integer getHabitacionId() { return habitacionId; }
    public LocalDate getFechaEntrada() { return fechaEntrada; }
    public LocalDate getFechaSalida() { return fechaSalida; }
    public Integer getNumeroHuespedes() { return numeroHuespedes; }
    public String getCodigoPromocion() { return codigoPromocion; }
    public List<ServicioRequest> getServicios() { return servicios; }
    public String getMetodoPago() { return metodoPago; }

    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }
    public void setHabitacionId(Integer habitacionId) { this.habitacionId = habitacionId; }
    public void setFechaEntrada(LocalDate fechaEntrada) { this.fechaEntrada = fechaEntrada; }
    public void setFechaSalida(LocalDate fechaSalida) { this.fechaSalida = fechaSalida; }
    public void setNumeroHuespedes(Integer numeroHuespedes) { this.numeroHuespedes = numeroHuespedes; }
    public void setCodigoPromocion(String codigoPromocion) { this.codigoPromocion = codigoPromocion; }
    public void setServicios(List<ServicioRequest> servicios) { this.servicios = servicios; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
}