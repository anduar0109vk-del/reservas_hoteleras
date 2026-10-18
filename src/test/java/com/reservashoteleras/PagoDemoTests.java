package com.reservashoteleras;

import com.reservashoteleras.entity.Cliente;
import com.reservashoteleras.entity.Pago;
import com.reservashoteleras.entity.Reserva;
import com.reservashoteleras.entity.Rol;
import com.reservashoteleras.entity.Usuario;
import com.reservashoteleras.entity.enums.EstadoPago;
import com.reservashoteleras.entity.enums.EstadoReserva;
import com.reservashoteleras.repository.ClienteRepository;
import com.reservashoteleras.repository.PagoRepository;
import com.reservashoteleras.repository.ReservaRepository;
import com.reservashoteleras.service.PagoService;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class PagoDemoTests {

    @Test
    void demoPaymentConfirmsOnlyTheOwnersPendingReservation() {
        PagoRepository pagoRepository = mock(PagoRepository.class);
        ReservaRepository reservaRepository = mock(ReservaRepository.class);
        ClienteRepository clienteRepository = mock(ClienteRepository.class);
        PagoService pagoService = new PagoService(pagoRepository, reservaRepository, clienteRepository);
        ReflectionTestUtils.setField(pagoService, "demoMode", true);

        Usuario usuario = new Usuario();
        usuario.setId(10L);
        Rol rol = new Rol();
        rol.setNombre("CLIENTE");
        usuario.setRol(rol);

        Cliente cliente = new Cliente();
        cliente.setId(2L);
        when(clienteRepository.findByUsuarioId(10L)).thenReturn(Optional.of(cliente));

        Reserva reserva = new Reserva();
        reserva.setId(5L);
        reserva.setCliente(cliente);
        reserva.setEstado(EstadoReserva.PENDIENTE);
        when(reservaRepository.findById(5L)).thenReturn(Optional.of(reserva));

        Pago pago = new Pago();
        pago.setEstado(EstadoPago.PENDIENTE);
        when(pagoRepository.findByReservaId(5L)).thenReturn(Optional.of(pago));

        pagoService.confirmarPagoDemostracion(5L, usuario);

        assertEquals(EstadoPago.COMPLETADO, pago.getEstado());
        assertEquals(EstadoReserva.CONFIRMADA, reserva.getEstado());
    }

    @Test
    void demoPaymentCannotBeUsedWhenDisabled() {
        PagoService pagoService = new PagoService(
                mock(PagoRepository.class),
                mock(ReservaRepository.class),
                mock(ClienteRepository.class));
        ReflectionTestUtils.setField(pagoService, "demoMode", false);

        assertThrows(IllegalStateException.class,
                () -> pagoService.confirmarPagoDemostracion(5L, new Usuario()));
    }
}
