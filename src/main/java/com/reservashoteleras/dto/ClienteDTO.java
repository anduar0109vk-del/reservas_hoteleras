package com.reservashoteleras.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDTO {
    private Long id;
    private Long usuarioId;
    private String nombres;
    private String apellidos;
    private String email;
    private String telefono;
}