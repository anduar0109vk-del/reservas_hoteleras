package com.reservashoteleras.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;

@Service
public class ReporteService {
    
    public byte[] generarReportePDF(String titulo, String[][] datos, String[] columnas) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);
        
        Paragraph tituloDoc = new Paragraph(titulo)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(18);
        document.add(tituloDoc);
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Generado: " + LocalDateTime.now().toString()));
        document.add(new Paragraph(" "));
        
        Table table = new Table(UnitValue.createPercentArray(columnas.length)).useAllAvailableWidth();
        
        for (String columna : columnas) {
            table.addHeaderCell(new Cell().add(new Paragraph(columna)));
        }
        
        for (String[] fila : datos) {
            for (String celda : fila) {
                table.addCell(new Cell().add(new Paragraph(celda)));
            }
        }
        
        document.add(table);
        document.close();
        return out.toByteArray();
    }
    
    public byte[] generarReporteExcel(String[][] datos, String[] columnas) throws Exception {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("Reporte");
        
        XSSFRow headerRow = sheet.createRow(0);
        for (int i = 0; i < columnas.length; i++) {
            headerRow.createCell(i).setCellValue(columnas[i]);
        }
        
        for (int i = 0; i < datos.length; i++) {
            XSSFRow row = sheet.createRow(i + 1);
            for (int j = 0; j < datos[i].length; j++) {
                row.createCell(j).setCellValue(datos[i][j]);
            }
        }
        
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();
        return out.toByteArray();
    }
    
    public String generarCSV(String[][] datos, String[] columnas) {
        StringBuilder sb = new StringBuilder();
        sb.append(String.join(",", columnas)).append("\n");
        for (String[] fila : datos) {
            sb.append(String.join(",", fila)).append("\n");
        }
        return sb.toString();
    }
}