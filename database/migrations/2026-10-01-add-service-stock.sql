-- Ejecutar una vez sobre una base de datos ya creada.
-- El inventario anterior no se conoce: las filas existentes quedan en cero para
-- evitar vender unidades inexistentes. Registra el stock real antes de ofrecerlas.
ALTER TABLE `servicios_habitacion`
  ADD COLUMN `stock` int(11) NOT NULL DEFAULT 0;

-- Agrega ejemplos nuevos sin duplicar servicios con el mismo nombre.
INSERT INTO `servicios_habitacion`
  (`nombre`, `categoria`, `descripcion`, `precio`, `url_imagen`, `disponible`, `stock`)
SELECT catalogo.`nombre`, catalogo.`categoria`, catalogo.`descripcion`,
       catalogo.`precio`, NULL, 1, catalogo.`stock`
FROM (
  SELECT 'Desayuno buffet' AS `nombre`, 'COMIDA' AS `categoria`,
         'Desayuno buffet para un huésped' AS `descripcion`, 35.00 AS `precio`, 30 AS `stock`
  UNION ALL SELECT 'Ají de gallina', 'COMIDA', 'Ají de gallina con arroz y papa', 28.00, 15
  UNION ALL SELECT 'Arroz chaufa', 'COMIDA', 'Arroz chaufa de pollo preparado al momento', 26.00, 15
  UNION ALL SELECT 'Ensalada andina', 'COMIDA', 'Quinua, vegetales frescos y queso', 22.00, 12
  UNION ALL SELECT 'Sándwich club', 'COMIDA', 'Sándwich club con papas doradas', 24.00, 12
  UNION ALL SELECT 'Alquiler de bicicleta', 'ENTRETENIMIENTO', 'Bicicleta por hora para recorrer la ciudad', 30.00, 4
  UNION ALL SELECT 'Juegos de mesa', 'ENTRETENIMIENTO', 'Préstamo de juegos de mesa durante la estadía', 12.00, 8
  UNION ALL SELECT 'Tour centro histórico', 'ENTRETENIMIENTO', 'Paseo guiado por el centro histórico', 60.00, 10
  UNION ALL SELECT 'Karaoke privado', 'ENTRETENIMIENTO', 'Sala de karaoke privada por una hora', 50.00, 2
  UNION ALL SELECT 'Película premium', 'ENTRETENIMIENTO', 'Acceso a una película premium en la habitación', 15.00, 30
  UNION ALL SELECT 'Sesión de videojuegos', 'ENTRETENIMIENTO', 'Préstamo de consola y videojuegos por hora', 25.00, 3
  UNION ALL SELECT 'Clase de cocina peruana', 'ENTRETENIMIENTO', 'Clase grupal de cocina para huéspedes', 75.00, 8
) AS catalogo
WHERE NOT EXISTS (
  SELECT 1
  FROM `servicios_habitacion` existente
  WHERE existente.`nombre` = catalogo.`nombre`
);
