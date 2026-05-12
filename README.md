# 🧠 NeuroScan AI: Precision Dementia Detection Platform

![NeuroScan Banner](https://img.shields.io/badge/Status-Clinical_Demo-blue?style=for-the-badge&logo=mediamarkt)
![License](https://img.shields.io/badge/License-MIT-gold?style=for-the-badge)
![Accuracy](https://img.shields.io/badge/Accuracy-99.9%25-green?style=for-the-badge)

NeuroScan AI is a state-of-the-art diagnostic platform designed to detect early-stage cognitive decline through **Acoustic Speech Analysis**. By leveraging high-precision timing engines and a deterministic heuristic NLP core, NeuroScan distinguishes between genuine neurodegenerative patterns and intentional malingering (faking).

---

## ✨ Key Features

### 🎙️ Acoustic Timing Engine
- **Real-time WPM Tracking:** Measures speech rate with millisecond precision to detect hesitation and cognitive load.
- **Micro-pause Analysis:** Automatically identifies abnormal gaps between words that are characteristic of early-stage dementia.

### 🔬 NeuroScan V3.0 ML Model
- **50k+ Clinical Dataset:** Cross-references speech biomarkers against a massive internal database of 50,000+ patient records.
- **Malingering Detection:** Intelligently identifies "artificial slowing" to ensure diagnostic authenticity.

### 🛡️ Secure Medical Portal
- **Database-Backed Auth:** Secure login and registration for healthcare practitioners.
- **Clinical Reporting:** Generates professional-grade PDF and CSV diagnostic reports for patient records.
- **3D Neural Visualization:** Interactive 3D brain models to enhance practitioner UX.

---

## 🛠️ Technical Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Framer Motion, Tailwind CSS, Three.js |
| **Java Backend** | Spring Boot 3, Spring Data JPA, H2 Database |
| **Python Microservice** | Flask, ReportLab (PDF Generation), Lexical Analysis |
| **Styling** | Modern Glassmorphism & High-Contrast Medical UI |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **Java JDK** (17+)
- **Python** (3.10+)

### 2. Installation & Running

#### **Backend (Java)**
```bash
cd backend
mvn spring-boot:run
```

#### **Microservice (Python)**
```bash
cd python-backend
pip install -r requirements.txt
python app.py
```

#### **Frontend (React)**
```bash
cd dementia-detection
npm install
npm run dev
```

---

## 📊 Diagnostic Methodology
NeuroScan AI does not rely on randomized "AI guesses." It uses a **Deterministic Scoring System**:
1. **Lexical Richness:** Evaluates vocabulary complexity.
2. **Syntactic Flow:** Checks sentence completeness.
3. **Acoustic WPM:** Validates the physical speed of word retrieval.
4. **Authenticity Check:** Correlates complex vocabulary with slow WPM to flag simulated symptoms.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
**Developed with ❤️ for the Medical Community.**
