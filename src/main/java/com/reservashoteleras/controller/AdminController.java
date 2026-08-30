package com.reservashoteleras.controller;

import com.reservashoteleras.dto.HabitacionRequest;
import com.reservashoteleras.entity.Cliente;
import com.reservashoteleras.entity.Habitacion;
import com.reservashoteleras.entity.Promocion;
import com.reservashoteleras.entity.Reserva;
import com.reservashoteleras.entity.ServicioHabitacion;
import com.reservashoteleras.entity.TipoHabitacion;
import com.reservashoteleras.entity.Usuario;
import com.reservashoteleras.entity.enums.EstadoHabitacion;
import com.reservashoteleras.repository.ClienteRepository;
import com.reservashoteleras.repository.HabitacionRepository;
import com.reservashoteleras.repository.PromocionRepository;
import com.reservashoteleras.repository.ReservaRepository;
import com.reservashoteleras.repository.ServicioHabitacionRepository;
import com.reservashoteleras.repository.TipoHabitacionRepository;
import com.reservashoteleras.repository.UsuarioRepository;
import com.reservashoteleras.service.HabitacionService;
import com.reservashoteleras.service.PromocionService;
import com.reservashoteleras.service.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final UsuarioRepository usuarioRepository;
    private final HabitacionRepository habitacionRepository;
    private final TipoHabitacionRepository tipoHabitacionRepository;
    private final HabitacionService habitacionService;
    private final PromocionRepository promocionRepository;
    private final PromocionService promocionService;
    private final ServicioHabitacionRepository servicioHabitacionRepository;
    private final ReservaRepository reservaRepository;
    private final ReporteService reporteService;
    private final ClienteRepository clienteRepository;  // ✅ AGREGAR ESTO

    // ========== USUARIOS ==========
    
    @GetMapping("/usuarios")
    public ResponseEntity<List<Usuario>> getUsuarios() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }
    
    @GetMapping("/usuarios/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado")));
    }
    
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        usuarioRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ========== CLIENTES ==========
    
    @GetMapping("/clientes")
    public ResponseEntity<List<Cliente>> getClientes() {
        return ResponseEntity.ok(clienteRepository.findAll());
    }
    
    @GetMapping("/clientes/{id}")
    public ResponseEntity<Cliente> getClienteById(@PathVariable Long id) {
        return ResponseEntity.ok(clienteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado")));
    }

    // ========== HABITACIONES ==========
    
    @GetMapping("/tipos-habitacion")
    public ResponseEntity<List<TipoHabitacion>> getTiposHabitacion() {
        return ResponseEntity.ok(tipoHabitacionRepository.findAll());
    }
    
    @PostMapping("/habitaciones")
    public ResponseEntity<Habitacion> crearHabitacion(@RequestBody HabitacionRequest request) {
        return ResponseEntity.ok(habitacionService.crearHabitacion(request));
    }
    
    @PatchMapping("/habitaciones/{id}/estado")
    public ResponseEntity<Void> cambiarEstadoHabitacion(@PathVariable Integer id, @RequestParam String estado) {
        habitacionService.cambiarEstadoHabitacion(id, EstadoHabitacion.valueOf(estado));
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/habitaciones/{id}")
    public ResponseEntity<Void> deleteHabitacion(@PathVariable Integer id) {
        habitacionRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ========== PROMOCIONES ==========
    
    @GetMapping("/promociones")
    public ResponseEntity<List<Promocion>> getPromociones() {
        return ResponseEntity.ok(promocionRepository.findAll());
    }
    
    @PostMapping("/promociones")
    public ResponseEntity<Promocion> crearPromocion(@RequestBody Promocion promocion) {
        return ResponseEntity.ok(promocionService.save(promocion));
    }
    
    @PatchMapping("/promociones/{id}/toggle")
    public ResponseEntity<Promocion> togglePromocion(@PathVariable Long id, @RequestBody boolean activo) {
        Promocion promocion = promocionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Promoción no encontrada"));
        promocion.setActivo(activo);
        return ResponseEntity.ok(promocionRepository.save(promocion));
    }
    
    @DeleteMapping("/promociones/{id}")
    public ResponseEntity<Void> deletePromocion(@PathVariable Long id) {
        promocionRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ========== SERVICIOS ==========
    
    @GetMapping("/servicios")
    public ResponseEntity<List<ServicioHabitacion>> getServicios() {
        return ResponseEntity.ok(servicioHabitacionRepository.findAll());
    }
    
    @PostMapping("/servicios")
    public ResponseEntity<ServicioHabitacion> crearServicio(@RequestBody ServicioHabitacion servicio) {
        return ResponseEntity.ok(servicioHabitacionRepository.save(servicio));
    }
    
    @PatchMapping("/servicios/{id}/toggle")
    public ResponseEntity<ServicioHabitacion> toggleServicio(@PathVariable Long id, @RequestBody boolean disponible) {
        ServicioHabitacion servicio = servicioHabitacionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
        servicio.setDisponible(disponible);
        return ResponseEntity.ok(servicioHabitacionRepository.save(servicio));
    }
    
    @DeleteMapping("/servicios/{id}")
    public ResponseEntity<Void> deleteServicio(@PathVariable Long id) {
        servicioHabitacionRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ========== RESERVAS ==========
    
    @GetMapping("/reservas")
    public ResponseEntity<List<Reserva>> getReservas() {
        return ResponseEntity.ok(reservaRepository.findAll());
    }

    // ========== REPORTES ==========
    
    @GetMapping("/reportes/pdf")
    public ResponseEntity<byte[]> generarReportePDF() throws Exception {
        List<Reserva> reservas = reservaRepository.findAll();
        String[][] datos = reservas.stream()
            .map(r -> new String[]{
                r.getCodigoReserva(),
                r.getCliente().getUsuario().getNombres() + " " + r.getCliente().getUsuario().getApellidos(),
                r.getHabitacion().getNumero(),
                r.getFechaEntrada().toString(),
                r.getFechaSalida().toString(),
                r.getMontoTotal().toString()
            })
            .toArray(String[][]::new);
        
        String[] columnas = {"Código", "Cliente", "Habitación", "Entrada", "Salida", "Total"};
        byte[] pdf = reporteService.generarReportePDF("Reporte de Reservas", datos, columnas);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "reporte-reservas.pdf");
        
        return ResponseEntity.ok().headers(headers).body(pdf);
    }
    
    @GetMapping("/reportes/excel")
    public ResponseEntity<byte[]> generarReporteExcel() throws Exception {
        List<Reserva> reservas = reservaRepository.findAll();
        String[][] datos = reservas.stream()
            .map(r -> new String[]{
                r.getCodigoReserva(),
                r.getCliente().getUsuario().getNombres() + " " + r.getCliente().getUsuario().getApellidos(),
                r.getHabitacion().getNumero(),
                r.getFechaEntrada().toString(),
                r.getFechaSalida().toString(),
                r.getMontoTotal().toString()
            })
            .toArray(String[][]::new);
        
        String[] columnas = {"Código", "Cliente", "Habitación", "Entrada", "Salida", "Total"};
        byte[] excel = reporteService.generarReporteExcel(datos, columnas);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "reporte-reservas.xlsx");
        
        return ResponseEntity.ok().headers(headers).body(excel);
    }
    
    @GetMapping("/reportes/csv")
    public ResponseEntity<String> generarReporteCSV() {
        List<Reserva> reservas = reservaRepository.findAll();
        String[][] datos = reservas.stream()
            .map(r -> new String[]{
                r.getCodigoReserva(),
                r.getCliente().getUsuario().getNombres() + " " + r.getCliente().getUsuario().getApellidos(),
                r.getHabitacion().getNumero(),
                r.getFechaEntrada().toString(),
                r.getFechaSalida().toString(),
                r.getMontoTotal().toString()
            })
            .toArray(String[][]::new);
        
        String[] columnas = {"Código", "Cliente", "Habitación", "Entrada", "Salida", "Total"};
        String csv = reporteService.generarCSV(datos, columnas);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "reporte-reservas.csv");
        
        return ResponseEntity.ok().headers(headers).body(csv);
    }
}