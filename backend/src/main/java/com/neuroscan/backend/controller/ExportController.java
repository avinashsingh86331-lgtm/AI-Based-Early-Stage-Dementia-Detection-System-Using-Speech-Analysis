package com.neuroscan.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.neuroscan.backend.service.PdfExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = "*")
public class ExportController {

    private final PdfExportService pdfExportService;
    private final ObjectMapper objectMapper;

    @Autowired
    public ExportController(PdfExportService pdfExportService) {
        this.pdfExportService = pdfExportService;
        this.objectMapper = new ObjectMapper();
    }

    @PostMapping("/pdf")
    public void exportPdf(@RequestParam("payload") String payload, HttpServletResponse response) throws IOException {
        JsonNode data = objectMapper.readTree(payload);
        String patientId = data.has("patientId") ? data.get("patientId").asText() : "Unknown";
        
        response.setContentType("application/pdf");
        String headerKey = HttpHeaders.CONTENT_DISPOSITION;
        String headerValue = "attachment; filename=NeuroScan_Report_" + patientId + ".pdf";
        response.setHeader(headerKey, headerValue);

        pdfExportService.generateReport(data, response.getOutputStream());
    }
    
    @PostMapping("/csv")
    public void exportCsv(@RequestParam("payload") String payload, HttpServletResponse response) throws IOException {
        JsonNode data = objectMapper.readTree(payload);
        
        response.setContentType("text/csv");
        String headerKey = HttpHeaders.CONTENT_DISPOSITION;
        String headerValue = "attachment; filename=NeuroScan_Patient_History_" + System.currentTimeMillis() + ".csv";
        response.setHeader(headerKey, headerValue);

        pdfExportService.generateCsv(data, response.getOutputStream());
    }
}
