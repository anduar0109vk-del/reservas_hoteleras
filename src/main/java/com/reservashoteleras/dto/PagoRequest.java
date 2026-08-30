package com.reservashoteleras.dto;

import lombok.Data;

@Data
public class PagoRequest {
    private Long reservaId;
    private String metodoPago;
    private String tipoComprobante;
}