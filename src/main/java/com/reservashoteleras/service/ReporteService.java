package com.reservashoteleras.service;

import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.reservashoteleras.entity.Reserva;
import com.reservashoteleras.entity.ReservaServicio;
import com.reservashoteleras.repository.ReservaServicioRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReporteService {
    private static final DeviceRgb BRAND = new DeviceRgb(31, 78, 121);
    private static final DeviceRgb ZEBRA = new DeviceRgb(241, 245, 249);
    private static final BigDecimal IGV_RATE = new BigDecimal("0.18");
    private final ReservaServicioRepository reservaServicioRepository;

    public byte[] generarReportePDF(String titulo, String[][] datos, String[] columnas) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(new PdfDocument(new PdfWriter(out)));
        addLogo(document);
        document.add(new Paragraph(titulo).setTextAlignment(TextAlignment.CENTER).setFontSize(18).setBold().setFontColor(BRAND));
        document.add(new Paragraph("Generado: " + LocalDateTime.now()).setFontSize(9).setFontColor(ColorConstants.GRAY));
        Table table = new Table(UnitValue.createPercentArray(columnas.length)).useAllAvailableWidth();
        for (String columna : columnas) table.addHeaderCell(new Cell().add(new Paragraph(columna).setBold().setFontColor(ColorConstants.WHITE)).setBackgroundColor(BRAND));
        for (int i = 0; i < datos.length; i++) for (String celda : datos[i]) table.addCell(new Cell().add(new Paragraph(celda == null ? "" : celda)).setBackgroundColor(i % 2 == 0 ? ColorConstants.WHITE : ZEBRA));
        document.add(table); document.close(); return out.toByteArray();
    }

    public byte[] generarFacturaPDF(Reserva reserva, String tipo, String ruc, String razonSocial, String direccion) throws Exception {
        String cliente = reserva.getCliente() != null && reserva.getCliente().getUsuario() != null ? reserva.getCliente().getUsuario().getNombres() + " " + reserva.getCliente().getUsuario().getApellidos() : "Cliente";
        BigDecimal alojamiento = value(reserva.getSubtotalHabitacion());
        BigDecimal servicios = reservaServicioRepository.findByReservaIdAndEstadoNot(reserva.getId(),
                        com.reservashoteleras.entity.enums.EstadoServicio.CANCELADO).stream()
                .map(item -> value(item.getSubtotal()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal descuento = value(reserva.getDescuento());
        BigDecimal importeNeto = alojamiento.add(servicios).subtract(descuento);
        BigDecimal igv = importeNeto.multiply(IGV_RATE).setScale(2, java.math.RoundingMode.HALF_UP);
        BigDecimal total = importeNeto.add(igv);
        ByteArrayOutputStream out = new ByteArrayOutputStream(); Document document = new Document(new PdfDocument(new PdfWriter(out)));
        addLogo(document); document.add(new Paragraph(tipo + " ELECTRONICA").setFontSize(16).setBold().setFontColor(BRAND));
        document.add(new Paragraph("Reserva: " + safe(reserva.getCodigoReserva()) + "    Fecha: " + LocalDateTime.now().toLocalDate()));
        document.add(new Paragraph("Cliente: " + safe(cliente)));
        if ("FACTURA".equals(tipo)) document.add(new Paragraph("RUC: " + safe(ruc) + "    Razon social: " + safe(razonSocial) + "\nDireccion: " + safe(direccion)));
        Table table = new Table(UnitValue.createPercentArray(new float[]{2, 4, 1, 2, 2})).useAllAvailableWidth();
        for (String h : new String[]{"Concepto", "Descripcion", "Cant.", "P. unitario", "Importe"}) table.addHeaderCell(new Cell().add(new Paragraph(h).setBold().setFontColor(ColorConstants.WHITE)).setBackgroundColor(BRAND));
        addInvoiceRow(table, 0, "Alojamiento", "Habitacion " + reserva.getHabitacion().getNumero(), "1", alojamiento, alojamiento);
        for (ReservaServicio item : reservaServicioRepository.findByReservaIdAndEstadoNot(reserva.getId(),
                com.reservashoteleras.entity.enums.EstadoServicio.CANCELADO)) {
            BigDecimal unit = value(item.getPrecioUnitario());
            BigDecimal subtotal = value(item.getSubtotal());
            addInvoiceRow(table, 1, "Servicio", safe(item.getServicio() == null ? null : item.getServicio().getNombre()),
                    String.valueOf(item.getCantidad() == null ? 1 : item.getCantidad()), unit, subtotal);
        }
        if (descuento.signum() > 0) addInvoiceRow(table, 0, "Descuento", "Promocion aplicada", "1", descuento.negate(), descuento.negate());
        document.add(table);
        Table totals = new Table(UnitValue.createPercentArray(new float[]{7, 2})).useAllAvailableWidth();
        totals.addCell(new Cell().add(new Paragraph("Importe neto (sin IGV)").setBold()));
        totals.addCell(new Cell().add(new Paragraph(money(importeNeto)).setTextAlignment(TextAlignment.RIGHT)));
        totals.addCell(new Cell().add(new Paragraph("IGV (18%)").setBold()));
        totals.addCell(new Cell().add(new Paragraph(money(igv)).setTextAlignment(TextAlignment.RIGHT)));
        totals.addCell(new Cell().add(new Paragraph("TOTAL A PAGAR").setBold().setFontColor(BRAND)));
        totals.addCell(new Cell().add(new Paragraph(money(total)).setTextAlignment(TextAlignment.RIGHT).setBold().setFontColor(BRAND)));
        document.add(totals);
        document.add(new Paragraph("Documento generado por el sistema de reservas.").setFontSize(9).setFontColor(ColorConstants.GRAY)); document.close(); return out.toByteArray();
    }

    private void addInvoiceRow(Table table, int row, String concept, String description, String quantity,
                               BigDecimal unit, BigDecimal subtotal) {
        Color background = row % 2 == 0 ? ColorConstants.WHITE : ZEBRA;
        for (String value : new String[]{concept, description, quantity, money(unit), money(subtotal)}) {
            table.addCell(new Cell().add(new Paragraph(value)).setBackgroundColor(background));
        }
    }

    private void addLogo(Document document) throws java.io.IOException {
        ClassPathResource resource = new ClassPathResource("casa-andina-logo.png");
        if (resource.exists()) document.add(new Image(ImageDataFactory.create(resource.getInputStream().readAllBytes())).scaleToFit(170, 60));
        else document.add(new Paragraph("CASA ANDINA").setFontSize(20).setBold().setFontColor(BRAND));
    }
    private String money(BigDecimal value) { return "S/ " + (value == null ? "0.00" : value.setScale(2, java.math.RoundingMode.HALF_UP)); }
    private BigDecimal value(BigDecimal value) { return value == null ? BigDecimal.ZERO : value; }
    private String safe(String value) { return value == null ? "" : value; }

    public byte[] generarReporteExcel(String[][] datos, String[] columnas) throws Exception {
        XSSFWorkbook workbook = new XSSFWorkbook(); XSSFSheet sheet = workbook.createSheet("Reporte");
        XSSFCellStyle header = workbook.createCellStyle(); header.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex()); header.setFillPattern(FillPatternType.SOLID_FOREGROUND); header.setFont(font(workbook, true, IndexedColors.WHITE.getIndex())); borders(header);
        XSSFCellStyle even = workbook.createCellStyle(); even.setFillForegroundColor(IndexedColors.WHITE.getIndex()); even.setFillPattern(FillPatternType.SOLID_FOREGROUND); borders(even);
        XSSFCellStyle odd = workbook.createCellStyle(); odd.setFillForegroundColor(IndexedColors.PALE_BLUE.getIndex()); odd.setFillPattern(FillPatternType.SOLID_FOREGROUND); borders(odd);
        XSSFRow row = sheet.createRow(0); row.setHeightInPoints(24);
        for (int i = 0; i < columnas.length; i++) { row.createCell(i).setCellValue(columnas[i]); row.getCell(i).setCellStyle(header); }
        sheet.createFreezePane(0, 1); sheet.setAutoFilter(new org.apache.poi.ss.util.CellRangeAddress(0, Math.max(0, datos.length), 0, columnas.length - 1));
        for (int i = 0; i < datos.length; i++) { row = sheet.createRow(i + 1); for (int j = 0; j < datos[i].length; j++) { row.createCell(j).setCellValue(datos[i][j] == null ? "" : datos[i][j]); row.getCell(j).setCellStyle(i % 2 == 0 ? even : odd); } }
        for (int i = 0; i < columnas.length; i++) { sheet.autoSizeColumn(i); sheet.setColumnWidth(i, Math.min(255 * 256, Math.max(14 * 256, sheet.getColumnWidth(i) + 2 * 256))); }
        ByteArrayOutputStream out = new ByteArrayOutputStream(); workbook.write(out); workbook.close(); return out.toByteArray();
    }
    private Font font(XSSFWorkbook workbook, boolean bold, short color) { Font f = workbook.createFont(); f.setBold(bold); f.setColor(color); return f; }
    private void borders(XSSFCellStyle style) { style.setBorderTop(BorderStyle.THIN); style.setBorderBottom(BorderStyle.THIN); style.setBorderLeft(BorderStyle.THIN); style.setBorderRight(BorderStyle.THIN); style.setTopBorderColor(IndexedColors.GREY_40_PERCENT.getIndex()); style.setBottomBorderColor(IndexedColors.GREY_40_PERCENT.getIndex()); style.setAlignment(HorizontalAlignment.LEFT); }

    public String generarCSV(String[][] datos, String[] columnas) { StringBuilder sb = new StringBuilder("\uFEFF"); sb.append(Arrays.stream(columnas).map(this::csv).collect(Collectors.joining(","))).append("\n"); for (String[] fila : datos) sb.append(Arrays.stream(fila).map(this::csv).collect(Collectors.joining(","))).append("\n"); return sb.toString(); }
    private String csv(String value) { String safe = value == null ? "" : value; return "\"" + safe.replace("\"", "\"\"") + "\""; }
}
