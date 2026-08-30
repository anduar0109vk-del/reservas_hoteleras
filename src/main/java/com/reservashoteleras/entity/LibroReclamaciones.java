package com.reservashoteleras.entity;

import com.reservashoteleras.entity.enums.EstadoReclamo;
import com.reservashoteleras.entity.enums.TipoDocumento;
import com.reservashoteleras.entity.enums.TipoReclamo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "libro_reclamaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LibroReclamaciones {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "numero_reclamo", unique = true, nullable = false, length = 20)
    private String numeroReclamo;
    
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;
    
    @Column(name = "nombres_reclamante", nullable = false, length = 150)
    private String nombresReclamante;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_documento", nullable = false)
    private TipoDocumento tipoDocumento = TipoDocumento.DNI;
    
    @Column(name = "numero_documento", nullable = false, length = 20)
    private String numeroDocumento;
    
    @Column(nullable = false, length = 150)
    private String email;
    
    @Column(length = 20)
    private String telefono;
    
    @Enumerated(EnumType.STRING)
    private TipoReclamo tipo;
    
    @ManyToOne
    @JoinColumn(name = "reserva_id")
    private Reserva reserva;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String detalle;
    
    @Column(name = "pedido_cliente", columnDefinition = "TEXT")
    private String pedidoCliente;
    
    @Enumerated(EnumType.STRING)
    private EstadoReclamo estado = EstadoReclamo.PENDIENTE;
    
    @Column(columnDefinition = "TEXT")
    private String respuesta;
    
    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro = LocalDateTime.now();
    
    @Column(name = "fecha_respuesta")
    private LocalDateTime fechaRespuesta;
    
    @ManyToOne
    @JoinColumn(name = "atendido_por")
    private Usuario atendidoPor;
}