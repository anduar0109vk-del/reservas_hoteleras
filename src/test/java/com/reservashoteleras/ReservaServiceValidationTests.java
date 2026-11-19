package com.reservashoteleras;

import com.reservashoteleras.dto.ReservaRequest;
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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
class ReservaServiceValidationTests {
    private static final String INVALID_DATES_MESSAGE =
            "Las fechas de entrada y salida son obligatorias y válidas";

    @Mock private ReservaRepository reservaRepository;
    @Mock private HabitacionRepository habitacionRepository;
    @Mock private ClienteRepository clienteRepository;
    @Mock private PromocionRepository promocionRepository;
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private ServicioHabitacionRepository servicioHabitacionRepository;
    @Mock private ReservaServicioRepository reservaServicioRepository;
    @Mock private PagoRepository pagoRepository;
    @Mock private CheckInRepository checkInRepository;
    @InjectMocks private ReservaService reservaService;

    @Test
    void crearReservaRechazaFechasAusentesAntesDeConsultarRepositorios() {
        ReservaRequest request = new ReservaRequest();
        request.setFechaSalida(LocalDate.of(2026, 11, 10));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> reservaService.crearReserva(request, 1L)
        );

        assertEquals(INVALID_DATES_MESSAGE, exception.getMessage());
        verifyNoRepositoryInteractions();
    }

    @Test
    void crearReservaRechazaFechaDeSalidaAnteriorOIgualALaEntrada() {
        ReservaRequest request = new ReservaRequest();
        request.setFechaEntrada(LocalDate.of(2026, 11, 10));
        request.setFechaSalida(LocalDate.of(2026, 11, 10));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> reservaService.crearReserva(request, 1L)
        );

        assertEquals(INVALID_DATES_MESSAGE, exception.getMessage());
        verifyNoRepositoryInteractions();
    }

    private void verifyNoRepositoryInteractions() {
        verifyNoInteractions(
                reservaRepository,
                habitacionRepository,
                clienteRepository,
                promocionRepository,
                usuarioRepository,
                servicioHabitacionRepository,
                reservaServicioRepository,
                pagoRepository,
                checkInRepository
        );
    }
}
