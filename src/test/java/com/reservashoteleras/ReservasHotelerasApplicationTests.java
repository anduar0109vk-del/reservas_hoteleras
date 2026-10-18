package com.reservashoteleras;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import com.reservashoteleras.service.HabitacionService;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ReservasHotelerasApplicationTests {
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private HabitacionService habitacionService;
	@Autowired
	private MockMvc mockMvc;
	@Autowired
	private Environment environment;

	@Test
	void contextLoads() {
	}

	@Test
	void demoPaymentsAreDisabledByDefault() {
		assertFalse(environment.getProperty("payments.demo-mode", Boolean.class, false));
	}

	@Test
	void passwordEncoderHashesNewPasswordsAndAcceptsLegacyPasswords() {
		String encodedPassword = passwordEncoder.encode("secure-password");

		assertFalse(encodedPassword.equals("secure-password"));
		assertTrue(passwordEncoder.matches("secure-password", encodedPassword));
		assertTrue(passwordEncoder.matches("legacy-password", "legacy-password"));
		assertFalse(passwordEncoder.matches("wrong-password", "legacy-password"));
	}

	@Test
	void roomAvailabilityRejectsInvalidDateRanges() {
		LocalDate checkIn = LocalDate.of(2026, 10, 1);

		assertThrows(IllegalArgumentException.class,
				() -> habitacionService.getDisponiblesEntreFechas(checkIn, checkIn));
	}

	@Test
	void protectedEndpointsReturnUnauthorizedWithoutAToken() throws Exception {
		mockMvc.perform(get("/api/reservas"))
				.andExpect(status().isUnauthorized());
	}
}
