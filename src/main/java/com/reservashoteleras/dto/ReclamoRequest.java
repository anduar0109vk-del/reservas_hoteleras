package com.reservashoteleras.dto;

import com.reservashoteleras.entity.enums.TipoDocumento;
import com.reservashoteleras.entity.enums.TipoReclamo;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReclamoRequest {
    private Long clienteId;
    private Long reservaId;
    @NotBlank @Size(max = 150)
    private String nombresReclamante;
    @NotNull
    private TipoDocumento tipoDocumento;
    @NotBlank @Size(max = 20)
    private String numeroDocumento;
    @NotBlank @Email @Size(max = 150)
    private String email;
    @Size(max = 20)
    private String telefono;
    @NotNull
    private TipoReclamo tipo;
    @NotBlank
    private String detalle;
    private String pedidoCliente;
}
