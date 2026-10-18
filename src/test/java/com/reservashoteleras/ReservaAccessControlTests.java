package com.reservashoteleras;

import com.reservashoteleras.entity.Cliente;
import com.reservashoteleras.entity.Reserva;
import com.reservashoteleras.entity.Rol;
import com.reservashoteleras.entity.Usuario;
import com.reservashoteleras.repository.CheckInRepository;
import com.reservashoteleras.repository.ClienteRepository;
import com.reservashoteleras.repository.HabitacionRepository;
import com.reservashoteleras.repository.PagoRepository;
import com.reservashoteleras.repository.PromocionRepository;
import com.reservashoteleras.repository.ReservaRepository;
import com.reservashoteleras.repository.ReservaServicioRepository;
import com.reservashoteleras.repository.ServicioHabitacionRepository;
import com.reservashoteleras.repository.UsuarioRepository;
import com.reservashoteleras.service.ReservaService;
import com.reservashoteleras.service.ServicioHabitacionService;
import org.junit.jupiter.api.Test;
import org.springframework.security.access.AccessDeniedException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ReservaAccessControlTests {

    @Test
    void clientCannotReadAnotherCustomersReservation() {
        ReservaRepository reservaRepository = mock(ReservaRepository.class);
        ClienteRepository clienteRepository = mock(ClienteRepository.class);
        ReservaService reservaService = new ReservaService(
                reservaRepository,
                mock(HabitacionRepository.class),
                clienteRepository,
                mock(PromocionRepository.class),
                mock(UsuarioRepository.class),
                mock(ServicioHabitacionRepository.class),
                mock(ServicioHabitacionService.class),
                mock(ReservaServicioRepository.class),
                mock(PagoRepository.class),
                mock(CheckInRepository.class));

        Usuario usuario = new Usuario();
        usuario.setId(10L);
        Rol rol = new Rol();
        rol.setNombre("CLIENTE");
        usuario.setRol(rol);

        Cliente cliente = new Cliente();
        cliente.setId(2L);
        when(clienteRepository.findByUsuarioId(10L)).thenReturn(Optional.of(cliente));

        Cliente propietario = new Cliente();
        propietario.setId(1L);
        Reserva reserva = new Reserva();
        reserva.setCliente(propietario);
        when(reservaRepository.findById(5L)).thenReturn(Optional.of(reserva));

        assertThrows(AccessDeniedException.class, () -> reservaService.getReservaById(5L, usuario));
    }
}
