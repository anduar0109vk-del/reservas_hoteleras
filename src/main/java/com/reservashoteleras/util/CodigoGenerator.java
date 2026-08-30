package com.reservashoteleras.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

public class CodigoGenerator {
    
    public static String generarCodigoReserva() {
        String fecha = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String random = String.valueOf((int) (Math.random() * 9000) + 1000);
        return "RES-" + fecha + "-" + random;
    }
    
    public static String generarNumeroReclamo() {
        String fecha = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String random = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return "REC-" + fecha + "-" + random;
    }
}