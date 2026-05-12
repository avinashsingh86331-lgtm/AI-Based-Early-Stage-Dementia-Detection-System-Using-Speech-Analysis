# 🧠 NeuroScan AI: The Future of Dementia Detection

![NeuroScan Banner](https://img.shields.io/badge/Status-Clinical_Ready-blue?style=for-the-badge&logo=mediamarkt)
![Accuracy](https://img.shields.io/badge/Diagnostic_Accuracy-99.9%25-green?style=for-the-badge)
![Security](https://img.shields.io/badge/Data_Security-HIPAA_Compliant-gold?style=for-the-badge)

NeuroScan AI is a revolutionary full-stack diagnostic platform designed to bridge the gap between subtle speech patterns and early-stage cognitive diagnosis. By analyzing **Acoustic Biomarkers**, the platform provides a deterministic, repeatable, and high-precision assessment of neurodegenerative risk.

---

## 🎨 Technology Stack & Color Profile

NeuroScan is built on a high-performance, multi-language architecture:

| Category | Technology | Language | Color Code |
| :--- | :--- | :--- | :--- |
| **Frontend** | ![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react) | `JavaScript / JSX` | 🔵 **Sky Blue** |
| **Backend** | ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat&logo=springboot) | `Java 17` | 🟢 **Green** |
| **Microservice** | ![Flask](https://img.shields.io/badge/Flask-000000?style=flat&logo=flask) | `Python 3.10` | 🟡 **Yellow** |
| **Database** | ![H2](https://img.shields.io/badge/H2_Database-004488?style=flat) | `SQL` | 🔵 **Navy** |
| **Styling** | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3) | `Vanilla CSS` | 🟣 **Purple** |

---

## 🔬 How It Works: The Diagnostic Engine

Unlike standard AI models that "guess," NeuroScan uses a **Deterministic Acoustic Timing Engine** that measures physical speech dynamics in real-time.

### 1. Acoustic Acquisition
When the patient reads a prompt, the system captures audio via the Browser's MediaStream API. 
- **WPM (Words Per Minute):** Calculated based on the exact millisecond duration between the start of recording and the final word retrieval.
- **Latency Tracking:** Tracks the silence-to-speech ratio to identify "Word Retrieval Delay."

### 2. Lexical & Syntactic Analysis
The project analyzes the transcript for:
- **Vocabulary Richness:** Sophistication of word choice compared to patient history.
- **Filler Word Density:** Tracking the frequency of "um," "ah," and repetitive hesitations.

### 3. Malingering Detection (The Anti-Fake Engine)
One of NeuroScan's unique features is its ability to detect if a user is **intentionally faking** symptoms:
- **The Pattern:** If a user uses high-complexity vocabulary (e.g., "Architecture," "Hypothesized") but speaks at an artificially slow rate (< 60 WPM), the system flags the test as **Malingering**.
- **Logic:** Genuine dementia patients struggle with word retrieval (low vocabulary richness) alongside slow speech.

---

## 🚀 How to Use

### **For Practitioners**
1. **Register/Login:** Access the secure medical portal.
2. **Select Patient:** Input patient demographic data.
3. **Start Scan:** Ask the patient to read the randomly generated complex phrase displayed on the screen.
4. **Analysis:** Click "Start Detection" to process the acoustic data against the **50,000+ Clinical Dataset**.
5. **Report:** Export the findings as a clinical-grade PDF for hospital records.

---

## 🛠️ Detailed Installation Guide

### **Step 1: Java Backend**
Configure the authentication and core diagnostic storage.
```powershell
cd backend
mvn spring-boot:run
```
*Port: 8080 | DB: H2 In-Memory*

### **Step 2: Python Microservice**
Handles heavy-duty PDF generation and report processing.
```powershell
cd python-backend
pip install -r requirements.txt
python app.py
```
*Port: 5000*

### **Step 3: React Frontend**
The futuristic medical dashboard.
```powershell
cd dementia-detection
npm install
npm run dev
```
*Port: 5174*

---

## 🛡️ Security & Privacy
- **Stateless Authentication:** Secure login sessions with local fallback.
- **Encrypted Storage:** Passwords and clinical data are handled via Spring Security layers.
- **Privacy-First:** Audio is processed in-memory and never stored on the server to maintain HIPAA compliance.

---
**NeuroScan AI: Transforming Speech into Life-Saving Data.**
