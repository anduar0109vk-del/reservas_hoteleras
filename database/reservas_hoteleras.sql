-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-09-2026 a las 00:21:53
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `reservas_hoteleras`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria`
--

CREATE TABLE `auditoria` (
  `id` bigint(20) NOT NULL,
  `usuario_id` bigint(20) DEFAULT NULL,
  `accion` varchar(100) NOT NULL,
  `entidad` varchar(60) DEFAULT NULL,
  `entidad_id` bigint(20) DEFAULT NULL,
  `detalle` varchar(255) DEFAULT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bot_conversaciones`
--

CREATE TABLE `bot_conversaciones` (
  `id` bigint(20) NOT NULL,
  `canal` enum('WEB','WHATSAPP') NOT NULL DEFAULT 'WEB',
  `cliente_id` bigint(20) DEFAULT NULL,
  `telefono_whatsapp` varchar(20) DEFAULT NULL,
  `mensaje_usuario` text NOT NULL,
  `respuesta_bot` text NOT NULL,
  `resuelto_por_faq` tinyint(1) NOT NULL DEFAULT 1,
  `fecha` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bot_faq`
--

CREATE TABLE `bot_faq` (
  `id` bigint(20) NOT NULL,
  `pregunta` varchar(255) NOT NULL,
  `palabras_clave` varchar(255) NOT NULL,
  `respuesta` text NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado_por` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `check_in`
--

CREATE TABLE `check_in` (
  `id` bigint(20) NOT NULL,
  `reserva_id` bigint(20) NOT NULL,
  `fecha_hora_checkin` datetime DEFAULT NULL,
  `fecha_hora_checkout` datetime DEFAULT NULL,
  `documento_verificado` tinyint(1) NOT NULL DEFAULT 0,
  `url_foto_documento` varchar(255) DEFAULT NULL,
  `firma_electronica_base64` longtext DEFAULT NULL,
  `ip_firma` varchar(45) DEFAULT NULL,
  `empleado_verifico_id` bigint(20) DEFAULT NULL,
  `observaciones` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `check_in`
--

INSERT INTO `check_in` (`id`, `reserva_id`, `fecha_hora_checkin`, `fecha_hora_checkout`, `documento_verificado`, `url_foto_documento`, `firma_electronica_base64`, `ip_firma`, `empleado_verifico_id`, `observaciones`) VALUES
(1, 7, '2026-09-01 19:49:40', '2026-09-01 19:49:40', 0, NULL, NULL, NULL, NULL, NULL),
(2, 8, '2026-09-01 19:53:40', '2026-09-01 19:53:40', 0, NULL, NULL, NULL, NULL, NULL),
(3, 9, '2026-09-01 20:03:25', NULL, 0, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` bigint(20) NOT NULL,
  `usuario_id` bigint(20) NOT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `pais` varchar(60) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `registrado_por` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `usuario_id`, `direccion`, `pais`, `fecha_nacimiento`, `registrado_por`) VALUES
(3, 17, 'Direccion de demostracion 123', 'Perú', NULL, NULL),
(4, 18, NULL, NULL, NULL, NULL),
(5, 14, 'Oficina Administración', 'Peru', NULL, NULL),
(6, 15, 'Oficina Gerencia', 'Peru', NULL, NULL),
(7, 16, 'Recepción', 'Peru', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE `empleados` (
  `id` bigint(20) NOT NULL,
  `usuario_id` bigint(20) NOT NULL,
  `cargo` varchar(60) DEFAULT NULL,
  `fecha_contratacion` date DEFAULT NULL,
  `sueldo` decimal(38,2) DEFAULT NULL,
  `registrado_por` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitaciones`
--

CREATE TABLE `habitaciones` (
  `id` int(11) NOT NULL,
  `numero` varchar(10) NOT NULL,
  `piso` int(11) DEFAULT NULL,
  `tipo_habitacion_id` int(11) NOT NULL,
  `estado` enum('DISPONIBLE','OCUPADA','MANTENIMIENTO','LIMPIEZA') NOT NULL DEFAULT 'DISPONIBLE',
  `precio_actual` decimal(38,2) NOT NULL,
  `veces_reservada` int(11) NOT NULL DEFAULT 0,
  `destacada` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `habitaciones`
--

INSERT INTO `habitaciones` (`id`, `numero`, `piso`, `tipo_habitacion_id`, `estado`, `precio_actual`, `veces_reservada`, `destacada`) VALUES
(1, '101', 1, 1, 'DISPONIBLE', 80.00, 3, 0),
(2, '102', 1, 2, 'OCUPADA', 120.00, 4, 1),
(3, '103', 1, 3, 'DISPONIBLE', 150.00, 1, 0),
(4, '201', 2, 2, 'DISPONIBLE', 120.00, 1, 0),
(5, '202', 2, 3, 'DISPONIBLE', 150.00, 0, 1),
(6, '203', 2, 4, 'DISPONIBLE', 250.00, 0, 1),
(7, '301', 3, 1, 'DISPONIBLE', 80.00, 0, 0),
(8, '302', 3, 2, 'DISPONIBLE', 120.00, 0, 0),
(9, '303', 3, 4, 'DISPONIBLE', 250.00, 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitacion_imagenes`
--

CREATE TABLE `habitacion_imagenes` (
  `id` bigint(20) NOT NULL,
  `habitacion_id` int(11) NOT NULL,
  `url_imagen` varchar(255) NOT NULL,
  `orden` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libro_reclamaciones`
--

CREATE TABLE `libro_reclamaciones` (
  `id` bigint(20) NOT NULL,
  `numero_reclamo` varchar(20) NOT NULL,
  `cliente_id` bigint(20) DEFAULT NULL,
  `nombres_reclamante` varchar(150) NOT NULL,
  `tipo_documento` enum('DNI','CE','PASAPORTE') NOT NULL,
  `numero_documento` varchar(20) NOT NULL,
  `email` varchar(150) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `tipo` enum('RECLAMO','QUEJA') NOT NULL,
  `reserva_id` bigint(20) DEFAULT NULL,
  `detalle` text NOT NULL,
  `pedido_cliente` text DEFAULT NULL,
  `estado` enum('PENDIENTE','EN_PROCESO','RESUELTO') NOT NULL DEFAULT 'PENDIENTE',
  `respuesta` text DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_respuesta` datetime DEFAULT NULL,
  `atendido_por` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `libro_reclamaciones`
--

INSERT INTO `libro_reclamaciones` (`id`, `numero_reclamo`, `cliente_id`, `nombres_reclamante`, `tipo_documento`, `numero_documento`, `email`, `telefono`, `tipo`, `reserva_id`, `detalle`, `pedido_cliente`, `estado`, `respuesta`, `fecha_registro`, `fecha_respuesta`, `atendido_por`) VALUES
(1, 'REC-1788312085921', 4, 'Cliente Demo', 'DNI', '70000006', 'admin.demo@casaandina.test', '', 'RECLAMO', NULL, 'Durante mi estadía, la habitación no fue atendida en el horario informado y encontré inconvenientes con la limpieza. Solicito revisar el caso y mejorar el servicio.', 'Solicito una respuesta formal y la coordinación de una solución para futuras reservas.', 'PENDIENTE', NULL, '2026-09-01 20:21:25', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id` bigint(20) NOT NULL,
  `reserva_id` bigint(20) NOT NULL,
  `metodo_pago` enum('YAPE','PLIN','TARJETA','EFECTIVO') NOT NULL,
  `monto` decimal(38,2) NOT NULL,
  `estado` enum('PENDIENTE','COMPLETADO','FALLIDO','REEMBOLSADO') NOT NULL DEFAULT 'PENDIENTE',
  `stripe_payment_intent_id` varchar(100) DEFAULT NULL,
  `stripe_checkout_session_id` varchar(100) DEFAULT NULL,
  `tipo_comprobante` enum('BOLETA','FACTURA') DEFAULT NULL,
  `numero_comprobante` varchar(30) DEFAULT NULL,
  `ruta_pdf_comprobante` varchar(255) DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`id`, `reserva_id`, `metodo_pago`, `monto`, `estado`, `stripe_payment_intent_id`, `stripe_checkout_session_id`, `tipo_comprobante`, `numero_comprobante`, `ruta_pdf_comprobante`, `fecha_pago`, `fecha_creacion`) VALUES
(1, 1, 'TARJETA', 80.00, 'COMPLETADO', 'pi_3U9tFFDWinFVhsbi1ZfwnpiB', NULL, NULL, NULL, NULL, '2026-08-29 15:52:57', '2026-08-29 14:50:09'),
(2, 2, 'TARJETA', 120.00, 'PENDIENTE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-29 14:50:21'),
(3, 3, 'TARJETA', 80.00, 'PENDIENTE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-29 15:05:36'),
(4, 4, 'TARJETA', 80.00, 'COMPLETADO', NULL, NULL, NULL, NULL, NULL, '2026-08-30 15:45:27', '2026-08-29 18:05:36'),
(5, 5, 'TARJETA', 360.00, 'COMPLETADO', NULL, NULL, NULL, NULL, NULL, '2026-08-30 15:45:07', '2026-08-29 18:06:29'),
(6, 6, 'TARJETA', 108.00, 'PENDIENTE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-30 15:32:01'),
(7, 7, 'TARJETA', 150.00, 'COMPLETADO', NULL, NULL, NULL, NULL, NULL, '2026-09-01 19:49:39', '2026-09-01 19:49:34'),
(8, 8, 'TARJETA', 120.00, 'COMPLETADO', NULL, NULL, NULL, NULL, NULL, '2026-09-01 19:53:40', '2026-09-01 19:53:40'),
(9, 9, 'TARJETA', 240.00, 'COMPLETADO', NULL, NULL, NULL, NULL, NULL, '2026-09-01 20:03:05', '2026-09-01 19:59:30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `promociones`
--

CREATE TABLE `promociones` (
  `id` bigint(20) NOT NULL,
  `codigo` varchar(30) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `tipo_descuento` enum('PORCENTAJE','MONTO_FIJO') NOT NULL,
  `valor` decimal(38,2) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado_por` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `promociones`
--

INSERT INTO `promociones` (`id`, `codigo`, `nombre`, `descripcion`, `tipo_descuento`, `valor`, `fecha_inicio`, `fecha_fin`, `activo`, `creado_por`) VALUES
(1, 'promo10', 'aniversario', '1 año del Hotel Andina', 'PORCENTAJE', 10.00, '2026-08-31', '2026-09-04', 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `id` bigint(20) NOT NULL,
  `codigo_reserva` varchar(20) NOT NULL,
  `cliente_id` bigint(20) NOT NULL,
  `habitacion_id` int(11) NOT NULL,
  `fecha_entrada` date NOT NULL,
  `fecha_salida` date NOT NULL,
  `numero_huespedes` int(11) NOT NULL DEFAULT 1,
  `estado` enum('PENDIENTE','CONFIRMADA','CANCELADA','FINALIZADA','NO_SHOW') NOT NULL DEFAULT 'PENDIENTE',
  `promocion_id` bigint(20) DEFAULT NULL,
  `subtotal_habitacion` decimal(38,2) NOT NULL,
  `subtotal_servicios` decimal(38,2) DEFAULT NULL,
  `descuento` decimal(38,2) DEFAULT NULL,
  `monto_total` decimal(38,2) NOT NULL,
  `creado_por` bigint(20) NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_cancelacion` datetime DEFAULT NULL,
  `motivo_cancelacion` varchar(255) DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `reservas`
--

INSERT INTO `reservas` (`id`, `codigo_reserva`, `cliente_id`, `habitacion_id`, `fecha_entrada`, `fecha_salida`, `numero_huespedes`, `estado`, `promocion_id`, `subtotal_habitacion`, `subtotal_servicios`, `descuento`, `monto_total`, `creado_por`, `fecha_creacion`, `fecha_cancelacion`, `motivo_cancelacion`) VALUES
(1, 'RES-20260829-8108', 4, 1, '2026-08-29', '2026-08-30', 1, 'FINALIZADA', NULL, 80.00, 0.00, 0.00, 80.00, 18, '2026-08-29 14:50:09', NULL, NULL),
(2, 'RES-20260829-7727', 4, 2, '2026-08-29', '2026-08-30', 1, 'CANCELADA', NULL, 120.00, 0.00, 0.00, 120.00, 18, '2026-08-29 14:50:21', '2026-08-29 16:08:49', 'Cancelado por recepcionista'),
(3, 'RES-20260829-5518', 6, 1, '2026-08-31', '2026-09-01', 1, 'CANCELADA', NULL, 80.00, 0.00, 0.00, 80.00, 18, '2026-08-29 15:05:36', '2026-08-29 16:09:11', 'Cancelado por recepcionista'),
(4, 'RES-20260829-5623', 7, 1, '2026-08-29', '2026-08-30', 1, 'FINALIZADA', NULL, 80.00, 0.00, 0.00, 80.00, 14, '2026-08-29 18:05:36', NULL, NULL),
(5, 'RES-20260829-4567', 3, 2, '2026-08-29', '2026-09-01', 1, 'FINALIZADA', NULL, 360.00, 0.00, 0.00, 360.00, 16, '2026-08-29 18:06:29', NULL, NULL),
(6, 'RES-20260830-6517', 4, 2, '2026-09-02', '2026-09-03', 1, 'CANCELADA', 1, 120.00, 0.00, 12.00, 108.00, 14, '2026-08-30 15:32:01', '2026-08-30 15:44:57', 'Cancelado por usuario'),
(7, 'RES-20260901-7027', 4, 3, '2026-09-05', '2026-09-06', 1, 'FINALIZADA', NULL, 150.00, 0.00, 0.00, 150.00, 14, '2026-09-01 19:49:34', NULL, NULL),
(8, 'RES-20260901-2774', 4, 4, '2026-09-10', '2026-09-11', 1, 'FINALIZADA', NULL, 120.00, 0.00, 0.00, 120.00, 14, '2026-09-01 19:53:40', NULL, NULL),
(9, 'RES-20260901-6039', 4, 2, '2026-09-02', '2026-09-04', 1, 'CONFIRMADA', NULL, 240.00, 30.00, 0.00, 270.00, 14, '2026-09-01 19:59:30', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva_servicios`
--

CREATE TABLE `reserva_servicios` (
  `id` bigint(20) NOT NULL,
  `reserva_id` bigint(20) NOT NULL,
  `servicio_id` bigint(20) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `precio_unitario` decimal(38,2) NOT NULL,
  `subtotal` decimal(38,2) DEFAULT NULL,
  `estado` enum('SOLICITADO','EN_PREPARACION','ENTREGADO','CANCELADO') NOT NULL DEFAULT 'SOLICITADO',
  `fecha_solicitud` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_entrega` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reserva_servicios`
--

INSERT INTO `reserva_servicios` (`id`, `reserva_id`, `servicio_id`, `cantidad`, `precio_unitario`, `subtotal`, `estado`, `fecha_solicitud`, `fecha_entrega`) VALUES
(1, 9, 1, 1, 5.00, 5.00, 'SOLICITADO', '2026-09-01 19:59:47', NULL),
(2, 9, 3, 1, 25.00, 25.00, 'SOLICITADO', '2026-09-01 20:02:53', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `descripcion` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre`, `descripcion`) VALUES
(1, 'ADMIN', 'Acceso total al sistema: empleados, clientes, habitaciones, reservas, reportes y configuración'),
(2, 'GERENTE', 'Gestión de habitaciones, reservas, promociones, reportes y supervisión de personal'),
(3, 'RECEPCIONISTA', 'Registro de clientes, gestión de reservas, check-in/check-out y servicios a la habitación'),
(4, 'CLIENTE', 'Consulta de habitaciones disponibles, creación y gestión de sus propias reservas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios_habitacion`
--

CREATE TABLE `servicios_habitacion` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `categoria` enum('COMIDA','BEBIDA','ENTRETENIMIENTO','OTRO') NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `precio` decimal(38,2) NOT NULL,
  `url_imagen` varchar(255) DEFAULT NULL,
  `disponible` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicios_habitacion`
--

INSERT INTO `servicios_habitacion` (`id`, `nombre`, `categoria`, `descripcion`, `precio`, `url_imagen`, `disponible`) VALUES
(1, 'Agua Mineral', 'BEBIDA', 'Botella de agua mineral 500ml', 5.00, NULL, 1),
(2, 'Cerveza', 'BEBIDA', 'Cerveza artesanal 330ml', 8.00, NULL, 1),
(3, 'Ceviche', 'COMIDA', 'Ceviche de pescado con limón', 25.00, NULL, 1),
(4, 'Lomo Saltado', 'COMIDA', 'Lomo saltado con arroz y papas', 30.00, NULL, 1),
(5, 'Pizza', 'COMIDA', 'Pizza margarita familiar', 35.00, NULL, 1),
(6, 'Netflix', 'ENTRETENIMIENTO', 'Acceso a Netflix Premium', 10.00, NULL, 1),
(7, 'HBO Max', 'ENTRETENIMIENTO', 'Acceso a HBO Max', 12.00, NULL, 1),
(8, 'Pollo ', 'COMIDA', 'Pollo Frito con arroz ', 20.00, '', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_habitacion`
--

CREATE TABLE `tipos_habitacion` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `capacidad` int(11) NOT NULL,
  `precio_base` decimal(38,2) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipos_habitacion`
--

INSERT INTO `tipos_habitacion` (`id`, `nombre`, `capacidad`, `precio_base`, `descripcion`) VALUES
(1, 'Simple', 1, 80.00, 'Habitación individual con cama sencilla'),
(2, 'Doble', 2, 120.00, 'Habitación con cama matrimonial o dos camas'),
(3, 'Matrimonial', 2, 150.00, 'Habitación con cama matrimonial amplia'),
(4, 'Suite', 4, 250.00, 'Suite con sala de estar y bañera'),
(5, 'Simple', 1, 80.00, 'Habitación individual con cama sencilla'),
(6, 'Doble', 2, 120.00, 'Habitación con cama matrimonial o dos camas'),
(7, 'Matrimonial', 2, 150.00, 'Habitación con cama matrimonial amplia'),
(8, 'Suite', 4, 250.00, 'Suite con sala de estar y bañera');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` bigint(20) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `tipo_documento` enum('DNI','CE','PASAPORTE') NOT NULL DEFAULT 'DNI',
  `numero_documento` varchar(20) NOT NULL,
  `email` varchar(150) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol_id` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `ultima_conexion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombres`, `apellidos`, `tipo_documento`, `numero_documento`, `email`, `telefono`, `password_hash`, `rol_id`, `activo`, `fecha_registro`, `ultima_conexion`) VALUES
(14, 'Admin', 'Sistema', 'DNI', '70000001', 'admin.demo@casaandina.test', '900000001', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, 1, '2026-08-29 12:58:08', NULL),
(15, 'Gerente', 'Hotel', 'DNI', '70000002', 'gerente.demo@casaandina.test', '900000002', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, 1, '2026-08-29 12:58:08', NULL),
(16, 'Recepcionista', 'Hotel', 'DNI', '70000003', 'recepcion.demo@casaandina.test', '900000003', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, 1, '2026-08-29 12:58:08', NULL),
(17, 'Cliente', 'Prueba', 'DNI', '70000004', 'cliente.demo@casaandina.test', '900000004', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4, 1, '2026-08-29 12:58:08', NULL),
(18, 'Cliente', 'Demo', 'DNI', '70000005', 'cliente2.demo@casaandina.test', '900000005', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4, 1, '2026-08-29 14:42:29', NULL);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_habitaciones_mas_pedidas`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vw_habitaciones_mas_pedidas` (
`id` int(11)
,`numero` varchar(10)
,`tipo` varchar(50)
,`precio_actual` decimal(38,2)
,`veces_reservada` int(11)
,`estado` enum('DISPONIBLE','OCUPADA','MANTENIMIENTO','LIMPIEZA')
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_ingresos_reservas`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vw_ingresos_reservas` (
`reserva_id` bigint(20)
,`codigo_reserva` varchar(20)
,`cliente_id` bigint(20)
,`nombres` varchar(100)
,`apellidos` varchar(100)
,`subtotal_habitacion` decimal(38,2)
,`subtotal_servicios` decimal(38,2)
,`descuento` decimal(38,2)
,`monto_total` decimal(38,2)
,`estado` enum('PENDIENTE','CONFIRMADA','CANCELADA','FINALIZADA','NO_SHOW')
,`fecha_creacion` datetime
);

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_habitaciones_mas_pedidas`
--
DROP TABLE IF EXISTS `vw_habitaciones_mas_pedidas`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_habitaciones_mas_pedidas`  AS SELECT `h`.`id` AS `id`, `h`.`numero` AS `numero`, `t`.`nombre` AS `tipo`, `h`.`precio_actual` AS `precio_actual`, `h`.`veces_reservada` AS `veces_reservada`, `h`.`estado` AS `estado` FROM (`habitaciones` `h` join `tipos_habitacion` `t` on(`t`.`id` = `h`.`tipo_habitacion_id`)) ORDER BY `h`.`veces_reservada` DESC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_ingresos_reservas`
--
DROP TABLE IF EXISTS `vw_ingresos_reservas`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_ingresos_reservas`  AS SELECT `r`.`id` AS `reserva_id`, `r`.`codigo_reserva` AS `codigo_reserva`, `c`.`id` AS `cliente_id`, `u`.`nombres` AS `nombres`, `u`.`apellidos` AS `apellidos`, `r`.`subtotal_habitacion` AS `subtotal_habitacion`, `r`.`subtotal_servicios` AS `subtotal_servicios`, `r`.`descuento` AS `descuento`, `r`.`monto_total` AS `monto_total`, `r`.`estado` AS `estado`, `r`.`fecha_creacion` AS `fecha_creacion` FROM ((`reservas` `r` join `clientes` `c` on(`c`.`id` = `r`.`cliente_id`)) join `usuarios` `u` on(`u`.`id` = `c`.`usuario_id`)) ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_audit_usuario` (`usuario_id`);

--
-- Indices de la tabla `bot_conversaciones`
--
ALTER TABLE `bot_conversaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_conv_cliente` (`cliente_id`);

--
-- Indices de la tabla `bot_faq`
--
ALTER TABLE `bot_faq`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_faq_creador` (`creado_por`);

--
-- Indices de la tabla `check_in`
--
ALTER TABLE `check_in`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reserva_id` (`reserva_id`),
  ADD KEY `fk_checkin_empleado` (`empleado_verifico_id`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario_id` (`usuario_id`),
  ADD KEY `fk_cliente_registrador` (`registrado_por`);

--
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario_id` (`usuario_id`),
  ADD KEY `fk_empleado_registrador` (`registrado_por`);

--
-- Indices de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero` (`numero`),
  ADD KEY `fk_habitacion_tipo` (`tipo_habitacion_id`);

--
-- Indices de la tabla `habitacion_imagenes`
--
ALTER TABLE `habitacion_imagenes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_imagen_habitacion` (`habitacion_id`);

--
-- Indices de la tabla `libro_reclamaciones`
--
ALTER TABLE `libro_reclamaciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_reclamo` (`numero_reclamo`),
  ADD KEY `fk_reclamo_cliente` (`cliente_id`),
  ADD KEY `fk_reclamo_reserva` (`reserva_id`),
  ADD KEY `fk_reclamo_atendido` (`atendido_por`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pago_reserva` (`reserva_id`),
  ADD KEY `idx_pago_estado` (`estado`);

--
-- Indices de la tabla `promociones`
--
ALTER TABLE `promociones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD KEY `fk_promo_creador` (`creado_por`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo_reserva` (`codigo_reserva`),
  ADD KEY `fk_reserva_cliente` (`cliente_id`),
  ADD KEY `fk_reserva_habitacion` (`habitacion_id`),
  ADD KEY `fk_reserva_promocion` (`promocion_id`),
  ADD KEY `fk_reserva_creador` (`creado_por`),
  ADD KEY `idx_reserva_fechas` (`fecha_entrada`,`fecha_salida`),
  ADD KEY `idx_reserva_estado` (`estado`);

--
-- Indices de la tabla `reserva_servicios`
--
ALTER TABLE `reserva_servicios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_rs_reserva` (`reserva_id`),
  ADD KEY `fk_rs_servicio` (`servicio_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `servicios_habitacion`
--
ALTER TABLE `servicios_habitacion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tipos_habitacion`
--
ALTER TABLE `tipos_habitacion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_documento` (`numero_documento`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_usuario_rol` (`rol_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `bot_conversaciones`
--
ALTER TABLE `bot_conversaciones`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `bot_faq`
--
ALTER TABLE `bot_faq`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `check_in`
--
ALTER TABLE `check_in`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `empleados`
--
ALTER TABLE `empleados`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `habitacion_imagenes`
--
ALTER TABLE `habitacion_imagenes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `libro_reclamaciones`
--
ALTER TABLE `libro_reclamaciones`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `promociones`
--
ALTER TABLE `promociones`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reserva_servicios`
--
ALTER TABLE `reserva_servicios`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `servicios_habitacion`
--
ALTER TABLE `servicios_habitacion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `tipos_habitacion`
--
ALTER TABLE `tipos_habitacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD CONSTRAINT `fk_audit_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `bot_conversaciones`
--
ALTER TABLE `bot_conversaciones`
  ADD CONSTRAINT `fk_conv_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`);

--
-- Filtros para la tabla `bot_faq`
--
ALTER TABLE `bot_faq`
  ADD CONSTRAINT `fk_faq_creador` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `check_in`
--
ALTER TABLE `check_in`
  ADD CONSTRAINT `fk_checkin_empleado` FOREIGN KEY (`empleado_verifico_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_checkin_reserva` FOREIGN KEY (`reserva_id`) REFERENCES `reservas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `fk_cliente_registrador` FOREIGN KEY (`registrado_por`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_cliente_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD CONSTRAINT `fk_empleado_registrador` FOREIGN KEY (`registrado_por`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_empleado_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD CONSTRAINT `fk_habitacion_tipo` FOREIGN KEY (`tipo_habitacion_id`) REFERENCES `tipos_habitacion` (`id`);

--
-- Filtros para la tabla `habitacion_imagenes`
--
ALTER TABLE `habitacion_imagenes`
  ADD CONSTRAINT `fk_imagen_habitacion` FOREIGN KEY (`habitacion_id`) REFERENCES `habitaciones` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `libro_reclamaciones`
--
ALTER TABLE `libro_reclamaciones`
  ADD CONSTRAINT `fk_reclamo_atendido` FOREIGN KEY (`atendido_por`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_reclamo_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  ADD CONSTRAINT `fk_reclamo_reserva` FOREIGN KEY (`reserva_id`) REFERENCES `reservas` (`id`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `fk_pago_reserva` FOREIGN KEY (`reserva_id`) REFERENCES `reservas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `promociones`
--
ALTER TABLE `promociones`
  ADD CONSTRAINT `fk_promo_creador` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `fk_reserva_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  ADD CONSTRAINT `fk_reserva_creador` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_reserva_habitacion` FOREIGN KEY (`habitacion_id`) REFERENCES `habitaciones` (`id`),
  ADD CONSTRAINT `fk_reserva_promocion` FOREIGN KEY (`promocion_id`) REFERENCES `promociones` (`id`);

--
-- Filtros para la tabla `reserva_servicios`
--
ALTER TABLE `reserva_servicios`
  ADD CONSTRAINT `fk_rs_reserva` FOREIGN KEY (`reserva_id`) REFERENCES `reservas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_rs_servicio` FOREIGN KEY (`servicio_id`) REFERENCES `servicios_habitacion` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
