package com.neuroscan.backend.dto;

public class PredictionResponse {
    private String prediction;
    private int confidence;
    private int speech_score;

    public PredictionResponse() {
    }

    public PredictionResponse(String prediction, int confidence, int speech_score) {
        this.prediction = prediction;
        this.confidence = confidence;
        this.speech_score = speech_score;
    }

    public String getPrediction() {
        return prediction;
    }

    public void setPrediction(String prediction) {
        this.prediction = prediction;
    }

    public int getConfidence() {
        return confidence;
    }

    public void setConfidence(int confidence) {
        this.confidence = confidence;
    }

    public int getSpeech_score() {
        return speech_score;
    }

    public void setSpeech_score(int speech_score) {
        this.speech_score = speech_score;
    }
}
