package com.reservashoteleras.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "clientes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;
    
    @Column(length = 200)
    private String direccion;
    
    @Column(length = 60)
    private String pais;
    
    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;
    
    @ManyToOne
    @JoinColumn(name = "registrado_por")
    private Usuario registradoPor;
    
    @OneToMany(mappedBy = "cliente")
    @JsonIgnore
    private List<Reserva> reservas;

    // ✅ Métodos explícitos
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public void setRegistradoPor(Usuario registradoPor) {
        this.registradoPor = registradoPor;
    }
}