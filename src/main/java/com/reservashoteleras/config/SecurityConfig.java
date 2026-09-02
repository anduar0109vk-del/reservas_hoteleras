package com.reservashoteleras.config;

import com.reservashoteleras.security.CustomUserDetailsService;
import com.reservashoteleras.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/habitaciones/disponibles", 
                                "/api/habitaciones/mas-pedidas", "/api/habitaciones/destacadas",
                                "/api/servicios/disponibles", "/api/clientes/usuario/**").permitAll()
                .requestMatchers("/api/bot/**").permitAll()
                .requestMatchers("/api/clientes").hasAnyRole("ADMIN", "GERENTE", "RECEPCIONISTA")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/gerente/**").hasAnyRole("ADMIN", "GERENTE")
                .requestMatchers("/api/recepcion/**").hasAnyRole("ADMIN", "GERENTE", "RECEPCIONISTA")
                .requestMatchers("/api/cliente/**").hasAnyRole("ADMIN", "CLIENTE")
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder()); // ✅ Usa el encoder de texto plano
        return authProvider;
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        // ✅ SOLO PARA DESARROLLO - Coincide con tus contraseñas en texto plano
        return new PasswordEncoder() {
            @Override
            public String encode(CharSequence rawPassword) {
                return rawPassword.toString(); // Guarda tal cual
            }
            @Override
            public boolean matches(CharSequence rawPassword, String encodedPassword) {
                // Compara directamente
                boolean matches = rawPassword.toString().equals(encodedPassword);
                System.out.println("🔍 Comparando: '" + rawPassword + "' vs '" + encodedPassword + "' = " + matches);
                return matches;
            }
        };
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}