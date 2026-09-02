package com.reservashoteleras.entity;

import com.reservashoteleras.entity.enums.EstadoPago;
import com.reservashoteleras.entity.enums.MetodoPago;
import com.reservashoteleras.entity.enums.TipoComprobante;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "reserva_id", nullable = false)
    @JsonIgnore
    private Reserva reserva;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago", nullable = false)
    private MetodoPago metodoPago;
    
    @Column(nullable = false)
    private BigDecimal monto;
    
    @Enumerated(EnumType.STRING)
    private EstadoPago estado = EstadoPago.PENDIENTE;
    
    @Column(name = "stripe_payment_intent_id", length = 100)
    private String stripePaymentIntentId;
    
    @Column(name = "stripe_checkout_session_id", length = 100)
    private String stripeCheckoutSessionId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_comprobante")
    private TipoComprobante tipoComprobante;
    
    @Column(name = "numero_comprobante", length = 30)
    private String numeroComprobante;
    
    @Column(name = "ruta_pdf_comprobante", length = 255)
    private String rutaPdfComprobante;
    
    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();
}