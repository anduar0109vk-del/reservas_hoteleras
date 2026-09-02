package com.reservashoteleras.dto;

import com.reservashoteleras.entity.LibroReclamaciones;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class ReclamoResponse {
    private Long id;
    private String numeroReclamo;
    private Long clienteId;
    private Long reservaId;
    private String nombresReclamante;
    private String tipoDocumento;
    private String numeroDocumento;
    private String email;
    private String telefono;
    private String tipo;
    private String detalle;
    private String pedidoCliente;
    private String estado;
    private String respuesta;
    private LocalDateTime fechaRegistro;
    private LocalDateTime fechaRespuesta;
    private String atendidoPor;

    public static ReclamoResponse from(LibroReclamaciones r) {
        return ReclamoResponse.builder()
            .id(r.getId()).numeroReclamo(r.getNumeroReclamo())
            .clienteId(r.getCliente() == null ? null : r.getCliente().getId())
            .reservaId(r.getReserva() == null ? null : r.getReserva().getId())
            .nombresReclamante(r.getNombresReclamante())
            .tipoDocumento(r.getTipoDocumento() == null ? null : r.getTipoDocumento().name())
            .numeroDocumento(r.getNumeroDocumento()).email(r.getEmail()).telefono(r.getTelefono())
            .tipo(r.getTipo() == null ? null : r.getTipo().name()).detalle(r.getDetalle())
            .pedidoCliente(r.getPedidoCliente())
            .estado(r.getEstado() == null ? null : r.getEstado().name())
            .respuesta(r.getRespuesta()).fechaRegistro(r.getFechaRegistro())
            .fechaRespuesta(r.getFechaRespuesta())
            .atendidoPor(r.getAtendidoPor() == null ? null : r.getAtendidoPor().getNombres())
            .build();
    }
}
