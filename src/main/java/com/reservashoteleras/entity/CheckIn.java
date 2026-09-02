package com.reservashoteleras.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "check_in")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckIn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "reserva_id", nullable = false, unique = true)
    @JsonIgnore
    private Reserva reserva;
    
    @Column(name = "fecha_hora_checkin")
    private LocalDateTime fechaHoraCheckin;
    
    @Column(name = "fecha_hora_checkout")
    private LocalDateTime fechaHoraCheckout;
    
    @Column(name = "documento_verificado")
    private Boolean documentoVerificado = false;
    
    @Column(name = "url_foto_documento", length = 255)
    private String urlFotoDocumento;
    
    @Column(name = "firma_electronica_base64", columnDefinition = "LONGTEXT")
    private String firmaElectronicaBase64;
    
    @Column(name = "ip_firma", length = 45)
    private String ipFirma;
    
    @ManyToOne
    @JoinColumn(name = "empleado_verifico_id")
    private Usuario empleadoVerifico;
    
    @Column(length = 255)
    private String observaciones;
}
