from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
import io
import uuid
import csv
import os

app = Flask(__name__)
CORS(app)

# In-memory cache for the two-step download process
# Format: { 'uuid': { 'type': 'pdf|csv', 'data': bytes, 'filename': '...' } }
file_cache = {}

@app.route('/api/generate/pdf', methods=['POST'])
def generate_pdf():
    data = request.json
    patient_id = data.get('patientId', 'Unknown')
    
    # Create an in-memory buffer
    buffer = io.BytesIO()
    
    # Set up the document
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        rightMargin=30, leftMargin=30,
        topMargin=30, bottomMargin=18
    )
    
    elements = []
    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle(
        'MainTitle', parent=styles['Heading1'],
        fontSize=24, spaceAfter=20, textColor=colors.HexColor('#1E3A8A'),
        fontName='Helvetica-Bold'
    )
    subtitle_style = ParagraphStyle(
        'Subtitle', parent=styles['Normal'],
        fontSize=12, spaceAfter=20, textColor=colors.HexColor('#475569')
    )
    header_style = ParagraphStyle(
        'SectionHeader', parent=styles['Heading2'],
        fontSize=14, spaceBefore=20, spaceAfter=10, textColor=colors.HexColor('#1E3A8A'),
        fontName='Helvetica-Bold'
    )
    warning_style = ParagraphStyle(
        'Warning', parent=styles['Normal'],
        fontSize=11, spaceBefore=10, spaceAfter=10, textColor=colors.HexColor('#B91C1C'),
        fontName='Helvetica-Bold'
    )
    
    # Title
    elements.append(Paragraph("NeuroScan AI", title_style))
    elements.append(Paragraph("Advanced Cognitive Speech Analysis Report", subtitle_style))
    elements.append(Paragraph(f"<b>Report ID:</b> {patient_id}    |    <b>Date:</b> {data.get('timestamp', 'N/A')}", styles['Normal']))
    
    # 1. Summary Section
    elements.append(Paragraph("1. Primary Diagnostic Results", header_style))
    
    is_faking = data.get('isFaking', False)
    result_text = "N/A" if is_faking else data.get('result', 'N/A')
    risk_color = "INCONCLUSIVE" if is_faking else ("LOW (GREEN)" if data.get('speechScore', 0) >= 75 else "HIGH (RED)")
    
    summary_data = [
        ['Diagnostic Parameter', 'Measured Result', 'Clinical Reference Range'],
        ['AI Cognitive Diagnosis', result_text, 'Low Risk (Healthy)'],
        ['AI Confidence Level', f"{data.get('confidence', 'N/A')}%", '> 85%'],
        ['Overall Speech Score', f"{data.get('speechScore', 'N/A')} / 100", '75 - 100'],
        ['Risk Classification', risk_color, 'LOW (GREEN)'],
        ['Authenticity Index', f"{data.get('authenticityScore', 'N/A')}%", '> 80% (Genuine)'],
    ]
    
    t_summary = Table(summary_data, colWidths=[200, 150, 150])
    t_summary.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1E3A8A')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F8FAFC')),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#CBD5E1'))
    ]))
    elements.append(t_summary)
    
    # 2. Biomarkers
    elements.append(Paragraph("2. Detailed Vocal Biomarkers", header_style))
    b = data.get('biomarkers', {})
    
    bio_data = [
        ['Biomarker Metric', 'Patient Value', 'Healthy Range'],
        ['Pause Frequency', f"{b.get('pauseFrequency', 'N/A')} / min", '2.0 - 4.0 / min'],
        ['Average Pause Duration', f"{b.get('avgPauseDuration', 'N/A')} s", '< 0.5 s'],
        ['Speech Rate', f"{b.get('speechRate', 'N/A')} wpm", '130 - 170 wpm'],
        ['Vocabulary Richness', f"{b.get('vocabularyRichness', 'N/A')} %", '> 70%'],
        ['Sentence Completeness', f"{b.get('sentenceCompleteness', 'N/A')} %", '> 80%'],
        ['Pitch Variability', f"{b.get('pitchVariability', 'N/A')} Hz", '25 - 50 Hz'],
        ['Word Recall Accuracy', f"{b.get('wordRecall', 'N/A')} %", '> 75%'],
        ['Overall Fluency Score', f"{b.get('fluencyScore', 'N/A')} %", '> 70%']
    ]
    
    t_bio = Table(bio_data, colWidths=[200, 150, 150])
    t_bio.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#73C7E3')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F8FAFC')),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#CBD5E1'))
    ]))
    elements.append(t_bio)
    
    # Details of Biomarkers
    elements.append(Spacer(1, 15))
    elements.append(Paragraph("Biomarker Clinical Significance", header_style))
    bio_details = [
        "<b>Pause Frequency & Duration:</b> Elevated pauses (> 4.0/min or > 0.5s) are strong indicators of anomia (word-finding difficulty) and slowed cognitive processing speed commonly seen in early neurodegeneration.",
        "<b>Speech Rate:</b> Bradykinesia of speech (speaking significantly slower than 130 wpm) correlates with motor-speech decline and executive dysfunction.",
        "<b>Vocabulary Richness & Sentence Completeness:</b> These metrics assess semantic memory intactness. A richness score below 70% suggests the patient is relying on simpler, highly familiar vocabulary, which is a classic hallmark of cognitive decline.",
        "<b>Word Recall Accuracy:</b> A direct measure of short-term semantic retrieval capabilities. Scores below 75% are highly sensitive to mild cognitive impairment (MCI)."
    ]
    for detail in bio_details:
        elements.append(Paragraph(f"• {detail}", styles['Normal']))
        elements.append(Spacer(1, 5))

    # --- PAGE 2 ---
    elements.append(PageBreak())
    
    elements.append(Paragraph("NeuroScan AI - Clinical Interpretation", subtitle_style))
    
    # 3. Authenticity
    elements.append(Paragraph("3. Authenticity & Anti-Malingering Analysis", header_style))
    
    auth_intro = "NeuroScan utilizes an advanced Anti-Malingering Detection algorithm to ensure test validity. Patients attempting to feign or exaggerate cognitive decline typically alter conscious parameters (such as intentionally speaking slowly or pausing frequently) but fail to replicate subconscious linguistic deficits (such as vocabulary impoverishment or syntax simplification)."
    elements.append(Paragraph(auth_intro, styles['Normal']))
    elements.append(Spacer(1, 10))
    
    if is_faking:
        elements.append(Paragraph("⚠️ WARNING: SIGNIFICANT SYMPTOM INCONSISTENCY DETECTED", warning_style))
        fake_text = f"The model calculated an Authenticity Score of <b>{data.get('authenticityScore', 'N/A')}%</b>. The patient presents with artificial speech alteration (e.g., intentionally lowered pitch/rate) while retaining high vocabulary and complex grammar formulation. This profile strongly contradicts genuine neurocognitive decline patterns. The AI has flagged this session as potentially malingered."
        elements.append(Paragraph(fake_text, styles['Normal']))
    else:
        good_style = ParagraphStyle('Good', parent=styles['Normal'], textColor=colors.HexColor('#15803D'), fontName='Helvetica-Bold')
        elements.append(Paragraph("✓ VALID TEST: NO MALINGERING DETECTED", good_style))
        elements.append(Paragraph(f"Authenticity Score: <b>{data.get('authenticityScore', 'N/A')}%</b>. The patient's speech patterns demonstrate natural consistency across both conscious acoustic control and subconscious linguistic formulation.", styles['Normal']))
    
    # 4. Final Clinical Interpretation
    elements.append(Paragraph("4. Final Clinical Interpretation & Recommendations", header_style))
    
    interp_style = ParagraphStyle('Interp', parent=styles['Normal'], fontSize=11, leading=16)
    speech_score = data.get('speechScore', 0)
    
    if is_faking:
        interp = "<b>Diagnosis: INCONCLUSIVE.</b> Due to the detection of severe symptom inconsistency and potential malingering, the standard AI risk classification cannot be reliably applied. The patient's underlying cognitive state remains masked by intentional or psychogenic voice alteration.<br/><br/><b>Recommendation:</b> Administer standardized written neuropsychological tests (e.g., MMSE, MoCA) in a controlled clinical environment to bypass verbal manipulation."
    elif speech_score >= 75:
        interp = f"The patient's speech patterns fall within normal cognitive ranges across all measured biomarkers. The AI model indicates a <b>LOW risk</b> of early-stage dementia with {data.get('confidence', 'N/A')}% confidence. Vocabulary richness ({b.get('vocabularyRichness', 'N/A')}%) and word recall ({b.get('wordRecall', 'N/A')}%) are well-preserved, indicating intact semantic memory.<br/><br/><b>Recommendation:</b> No immediate clinical intervention is recommended. Routine follow-up screening in 12 months is advised."
    elif speech_score >= 50:
        interp = f"The speech analysis reveals <b>MODERATE cognitive irregularities</b>. Elevated pause frequency ({b.get('pauseFrequency', 'N/A')}/min) and reduced vocabulary richness ({b.get('vocabularyRichness', 'N/A')}%) suggest early-stage word-finding difficulties (anomia) and slightly delayed cognitive processing.<br/><br/><b>Recommendation:</b> A comprehensive neurological evaluation is strongly recommended within 30 days to rule out mild cognitive impairment (MCI). Baseline bloodwork and a clinical interview with family members are advised."
    else:
        interp = f"The analysis indicates <b>SIGNIFICANT cognitive impairment markers</b>. High pause frequency ({b.get('pauseFrequency', 'N/A')}/min), prolonged pause durations ({b.get('avgPauseDuration', 'N/A')}s), and severely reduced word recall ({b.get('wordRecall', 'N/A')}%) are highly consistent with moderate-to-severe neurocognitive decline.<br/><br/><b>Recommendation:</b> Immediate referral to a neurologist and comprehensive cognitive testing is URGENTLY recommended. An MRI scan should be considered to rule out structural anomalies."
    
    elements.append(Paragraph(interp, interp_style))

    # Disclaimer
    elements.append(Spacer(1, 40))
    disclaimer_style = ParagraphStyle('Disclaimer', parent=styles['Normal'], fontSize=8, textColor=colors.gray, alignment=1)
    elements.append(Paragraph("____________________________________________________________________", disclaimer_style))
    elements.append(Spacer(1, 5))
    elements.append(Paragraph("DISCLAIMER: This report is generated by an AI screening tool and does not constitute a formal medical diagnosis. All findings should be reviewed by a licensed healthcare professional.", disclaimer_style))
    
    # Build the PDF
    doc.build(elements)
    
    # Cache the file and return a download token
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    file_id = str(uuid.uuid4())
    filename = f"NeuroScan_Report_{patient_id.replace(' ', '_')}.pdf"
    
    file_cache[file_id] = {
        'type': 'application/pdf',
        'data': pdf_bytes,
        'filename': filename
    }
    
    return jsonify({
        'status': 'success',
        # appending filename to URL guarantees browser saves it correctly
        'download_url': f"http://localhost:5000/api/download/{file_id}/{filename}"
    })


@app.route('/api/generate/csv', methods=['POST'])
def generate_csv():
    history = request.json
    
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["Patient ID", "Patient Name", "Date", "Time", "Risk Level", "Speech Score", "AI Confidence"])
    
    for h in history:
        writer.writerow([
            h.get('patientId', ''), h.get('patient', ''), h.get('date', ''), 
            h.get('time', ''), h.get('risk', ''), h.get('score', ''), 
            str(h.get('confidence', '')) + "%"
        ])
    
    csv_bytes = buffer.getvalue().encode('utf-8')
    buffer.close()
    
    file_id = str(uuid.uuid4())
    import datetime
    date_str = datetime.datetime.now().strftime("%Y-%m-%d")
    filename = f"NeuroScan_Patient_History_{date_str}.csv"
    
    file_cache[file_id] = {
        'type': 'text/csv',
        'data': csv_bytes,
        'filename': filename
    }
    
    return jsonify({
        'status': 'success',
        'download_url': f"http://localhost:5000/api/download/{file_id}/{filename}"
    })


@app.route('/api/download/<file_id>/<filename>', methods=['GET'])
def download_file(file_id, filename):
    if file_id not in file_cache:
        return "File not found or expired.", 404
        
    file_info = file_cache[file_id]
    
    # Create an in-memory buffer to send the file
    buffer = io.BytesIO(file_info['data'])
    
    return send_file(
        buffer,
        mimetype=file_info['type'],
        as_attachment=True,
        download_name=file_info['filename']
    )

if __name__ == '__main__':
    print("NeuroScan Python Backend Started on port 5000")
    app.run(port=5000, debug=True)
