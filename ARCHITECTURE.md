# 🏗️ NeuroScan AI: Full-Stack Architecture Explained

This document provides a comprehensive breakdown of the technologies used to build the NeuroScan AI Dementia Detection Platform.

---

## 1. 🌐 Frontend (The User Interface)
The frontend is built for speed, premium aesthetics, and real-time medical visualization.

*   **React 19 & Vite:** We use **React** as the core UI framework for its component-based architecture. **Vite** is the build tool that ensures lightning-fast development and optimized production code.
*   **Framer Motion:** This is the animation engine used for all the smooth transitions, floating cards, and interactive elements. It gives the app its "premium" medical feel.
*   **Spline & Three.js:** The **3D Brain Animation** on the login page is powered by Spline. It uses WebGL to render complex 3D models directly in your browser.
*   **Tailwind CSS & Vanilla CSS:** We use a hybrid approach to ensure the design is perfectly responsive while maintaining custom "Glassmorphic" effects (blur, transparency, and high-contrast colors).
*   **Web Speech API:** This is used for real-time transcription of the patient's speech.
*   **Acoustic Timing Engine:** A custom JavaScript module that tracks the exact millisecond duration of speech to calculate **Words Per Minute (WPM)**.

---

## 2. ☕ Backend - Java (The Core API)
The Java backend acts as the "Brain" of the application, managing security and data logic.

*   **Spring Boot 3:** The industry-standard framework for building robust, enterprise-grade Java applications. It handles all our REST API endpoints.
*   **Spring Security & JPA:** Manages the logic for **User Authentication** and interacts with the database.
*   **H2 Database (SQL):** An in-memory relational database. 
    *   **Why H2?** It requires zero setup. It creates its tables automatically when the app starts. It's perfect for this medical demo because it's fast and doesn't require you to install a heavy database like MySQL.
*   **Lombok:** Used to reduce "boilerplate" code (automatically generates getters/setters).
*   **OpenPDF:** A Java library used for generating initial clinical data exports.

---

## 3. 🐍 Backend - Python (The Specialized Microservice)
Python is used for tasks where it excels: High-speed PDF generation and complex heuristic analysis.

*   **Flask:** A lightweight web framework used to host the Python API.
*   **ReportLab:** A powerful professional library for generating **Clinical PDF Reports**. It allows us to create precise tables, charts, and diagnostic graphs.
*   **Heuristic NLP Engine:** A custom script that analyzes the transcript for lexical richness and detects malingering (faking) based on vocabulary complexity vs. speech speed.

---

## 4. 🗄️ Database Strategy
We use a **Relational SQL** approach to ensure data integrity.

*   **Entities:** We have a `User` entity that stores the Doctor's name, email (unique), and password.
*   **Persistence:** Every time a new user registers, the data is saved into an H2 SQL table.
*   **Authentication Logic:** When you log in, the Java backend performs an SQL query to find the user by email and compares the password. 

---

## 🔄 How They Talk to Each Other (Communication)
1.  **Request:** The **React Frontend** sends an HTTP request (JSON) to the **Java Backend** (e.g., `POST /api/auth/login`).
2.  **Logic:** The Java Backend checks the **H2 Database**.
3.  **Response:** Java sends back a success or error message.
4.  **Reporting:** When you click "Download Report," the **Java Backend** communicates with the **Python Microservice** to generate the PDF and send it back to your browser.

---
**This architecture ensures the platform is fast, secure, and ready for clinical deployment.**
