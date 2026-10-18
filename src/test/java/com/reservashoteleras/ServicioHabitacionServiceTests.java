package com.reservashoteleras;

import com.reservashoteleras.entity.ServicioHabitacion;
import com.reservashoteleras.repository.ServicioHabitacionRepository;
import com.reservashoteleras.service.ServicioHabitacionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ServicioHabitacionServiceTests {
    private ServicioHabitacionRepository repository;
    private ServicioHabitacionService service;

    @BeforeEach
    void setUp() {
        repository = mock(ServicioHabitacionRepository.class);
        service = new ServicioHabitacionService(repository);
    }

    @Test
    void descontarStockReduceExistencias() {
        ServicioHabitacion producto = servicioConStock(5);
        when(repository.findByIdForUpdate(1L)).thenReturn(Optional.of(producto));
        when(repository.save(producto)).thenReturn(producto);

        ServicioHabitacion result = service.descontarStock(1L, 3);

        assertEquals(2, result.getStock());
        verify(repository).save(producto);
    }

    @Test
    void descontarStockNoPermiteVenderMasDeLoDisponible() {
        ServicioHabitacion producto = servicioConStock(2);
        when(repository.findByIdForUpdate(1L)).thenReturn(Optional.of(producto));

        assertThrows(IllegalStateException.class, () -> service.descontarStock(1L, 3));

        assertEquals(2, producto.getStock());
        verify(repository, never()).save(producto);
    }

    @Test
    void reponerStockDevuelveUnidadesCanceladas() {
        ServicioHabitacion producto = servicioConStock(2);
        when(repository.findByIdForUpdate(1L)).thenReturn(Optional.of(producto));
        when(repository.save(producto)).thenReturn(producto);

        ServicioHabitacion result = service.reponerStock(1L, 3);

        assertEquals(5, result.getStock());
        verify(repository).save(producto);
    }

    @Test
    void actualizarStockRechazaValoresNegativos() {
        ServicioHabitacion producto = servicioConStock(2);
        when(repository.findByIdForUpdate(1L)).thenReturn(Optional.of(producto));

        assertThrows(IllegalArgumentException.class, () -> service.actualizarStock(1L, -1));

        assertEquals(2, producto.getStock());
        verify(repository, never()).save(producto);
    }

    private ServicioHabitacion servicioConStock(int stock) {
        ServicioHabitacion servicio = new ServicioHabitacion();
        servicio.setId(1L);
        servicio.setDisponible(true);
        servicio.setStock(stock);
        return servicio;
    }
}
