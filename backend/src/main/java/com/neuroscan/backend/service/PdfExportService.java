package com.neuroscan.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.IOException;
import java.io.OutputStream;

@Service
public class PdfExportService {

    public void generateReport(JsonNode data, OutputStream outputStream) throws IOException {
        try {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, outputStream);

            document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, Color.BLACK);
        Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.DARK_GRAY);
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new Color(30, 58, 138));
        Font tableHeadFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);
        Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);

        // Header
        Paragraph title = new Paragraph("NeuroScan AI", titleFont);
        document.add(title);
        
        Paragraph subtitle = new Paragraph("Advanced Cognitive Speech Analysis Report", subtitleFont);
        subtitle.setSpacingAfter(20);
        document.add(subtitle);

        String patientId = data.has("patientId") ? data.get("patientId").asText() : "N/A";
        document.add(new Paragraph("Report ID: " + patientId, textFont));
        if (data.has("timestamp")) {
            document.add(new Paragraph("Date: " + data.get("timestamp").asText(), textFont));
        }
        document.add(new Paragraph(" "));

        // Summary Table
        document.add(new Paragraph("1. Diagnostic Summary", headerFont));
        document.add(new Paragraph(" "));
        
        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{2f, 1.5f, 2f});

        addTableHeader(table, new String[]{"Parameter", "Result", "Reference"}, tableHeadFont);

        boolean isFaking = data.has("isFaking") && data.get("isFaking").asBoolean();
        
        table.addCell(new Phrase("AI Diagnosis", textFont));
        table.addCell(new Phrase(data.has("result") ? data.get("result").asText() : "N/A", textFont));
        table.addCell(new Phrase(isFaking ? "N/A" : "Low Risk (Healthy)", textFont));

        table.addCell(new Phrase("Speech Score", textFont));
        table.addCell(new Phrase(data.has("speechScore") ? data.get("speechScore").asText() + "/100" : "N/A", textFont));
        table.addCell(new Phrase("75-100 (Normal)", textFont));

        if (data.has("authenticityScore")) {
            table.addCell(new Phrase("Authenticity Score", textFont));
            table.addCell(new Phrase(data.get("authenticityScore").asText() + "%", textFont));
            table.addCell(new Phrase("> 80% (Genuine)", textFont));
        }

        document.add(table);
        document.add(new Paragraph(" "));

        // Biomarkers Table
        document.add(new Paragraph("2. Detailed Vocal Biomarkers", headerFont));
        document.add(new Paragraph(" "));
        
        if (data.has("biomarkers")) {
            JsonNode b = data.get("biomarkers");
            PdfPTable bioTable = new PdfPTable(3);
            bioTable.setWidthPercentage(100);
            bioTable.setWidths(new float[]{2f, 1.5f, 2f});
            
            addTableHeader(bioTable, new String[]{"Biomarker", "Measured", "Normal Range"}, tableHeadFont);
            
            addBioRow(bioTable, "Pause Frequency", b, "pauseFrequency", "/min", "2.0 - 4.0/min", textFont);
            addBioRow(bioTable, "Avg Pause Duration", b, "avgPauseDuration", "s", "< 0.5s", textFont);
            addBioRow(bioTable, "Speech Rate", b, "speechRate", " wpm", "130-170 wpm", textFont);
            addBioRow(bioTable, "Vocabulary Richness", b, "vocabularyRichness", "%", "> 70%", textFont);
            addBioRow(bioTable, "Sentence Completeness", b, "sentenceCompleteness", "%", "> 80%", textFont);
            addBioRow(bioTable, "Pitch Variability", b, "pitchVariability", " Hz", "25-50 Hz", textFont);
            addBioRow(bioTable, "Word Recall Accuracy", b, "wordRecall", "%", "> 75%", textFont);
            addBioRow(bioTable, "Overall Fluency", b, "fluencyScore", "%", "> 70%", textFont);
            
            document.add(bioTable);
        }

        document.add(new Paragraph(" "));
        document.add(new Paragraph("3. Authenticity & Malingering Analysis", headerFont));
        document.add(new Paragraph(" "));
        
        if (isFaking) {
            Font redFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, Color.RED);
            document.add(new Paragraph("⚠️ WARNING: SIGNIFICANT SYMPTOM INCONSISTENCY DETECTED", redFont));
            document.add(new Paragraph("The patient presents with artificial speech alteration (e.g., intentionally lowered pitch/rate) while retaining high vocabulary and grammar formulation. This profile contradicts genuine neurocognitive decline patterns. Diagnosis is INCONCLUSIVE.", textFont));
        } else {
            Font greenFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, new Color(0, 128, 0));
            document.add(new Paragraph("✓ VALID TEST: NO MALINGERING DETECTED", greenFont));
            document.add(new Paragraph("Speech patterns show natural consistency across conscious and subconscious linguistic markers.", textFont));
        }

        document.add(new Paragraph(" "));
            document.add(new Paragraph("DISCLAIMER: This report is generated by an AI screening tool and does not constitute a formal medical diagnosis.", FontFactory.getFont(FontFactory.HELVETICA, 8, Color.GRAY)));

            document.close();
        } catch (DocumentException e) {
            throw new IOException("Failed to generate PDF document", e);
        }
    }

    private void addTableHeader(PdfPTable table, String[] headers, Font font) {
        for (String header : headers) {
            PdfPCell cell = new PdfPCell();
            cell.setBackgroundColor(new Color(30, 58, 138));
            cell.setPadding(6);
            cell.setPhrase(new Phrase(header, font));
            table.addCell(cell);
        }
    }
    
    private void addBioRow(PdfPTable table, String label, JsonNode b, String key, String suffix, String normal, Font font) {
        table.addCell(new Phrase(label, font));
        table.addCell(new Phrase(b.has(key) ? b.get(key).asText() + suffix : "N/A", font));
        table.addCell(new Phrase(normal, font));
    }

    public void generateCsv(JsonNode data, OutputStream outputStream) throws IOException {
        StringBuilder csv = new StringBuilder();
        csv.append("Patient ID,Patient Name,Date,Time,Risk Level,Speech Score,AI Confidence\n");
        
        if (data.isArray()) {
            for (JsonNode row : data) {
                csv.append(row.has("patientId") ? row.get("patientId").asText() : "").append(",");
                csv.append(row.has("patient") ? row.get("patient").asText() : "").append(",");
                csv.append(row.has("date") ? row.get("date").asText() : "").append(",");
                csv.append(row.has("time") ? row.get("time").asText() : "").append(",");
                csv.append(row.has("risk") ? row.get("risk").asText() : "").append(",");
                csv.append(row.has("score") ? row.get("score").asText() : "").append(",");
                csv.append(row.has("confidence") ? row.get("confidence").asText() + "%" : "").append("\n");
            }
        }
        
        outputStream.write(csv.toString().getBytes());
        outputStream.flush();
    }
}
