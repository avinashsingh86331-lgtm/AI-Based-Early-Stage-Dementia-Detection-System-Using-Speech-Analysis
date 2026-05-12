package com.neuroscan.backend.service;

import com.neuroscan.backend.dto.PredictionResponse;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class PredictionService {

    private final Random random = new Random();

    public PredictionResponse analyzeSpeech(String text) {
        // Simulate ML processing delay
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Generate simulated AI metrics
        // In a real application, this would call a Python ML service or use a Java ML library
        int confidence = 85 + random.nextInt(12); // 85-96%
        int speechScore = 40 + random.nextInt(50); // 40-90

        String prediction;
        if (speechScore > 80) {
            prediction = "Low Risk";
        } else if (speechScore > 60) {
            prediction = "Moderate Risk";
        } else {
            prediction = "High Risk";
        }

        return new PredictionResponse(prediction, confidence, speechScore);
    }
}
