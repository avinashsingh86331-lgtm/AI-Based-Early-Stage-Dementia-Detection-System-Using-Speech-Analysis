package com.neuroscan.backend.dto;

import java.util.List;

public class PredictionResponse {
    private String prediction;
    private int confidence;
    private int speech_score;
    
    // Advanced AI Analysis fields
    private String speechAnalysisSummary;
    private List<String> cognitiveIndicators;
    private String linguisticAnalysis;
    private String acousticAnalysis;
    private String recommendedNextStep;
    private String explainabilityReport;
    private String biasFairnessCheck;

    public PredictionResponse() {
    }

    public PredictionResponse(String prediction, int confidence, int speech_score, 
                              String speechAnalysisSummary, List<String> cognitiveIndicators, 
                              String linguisticAnalysis, String acousticAnalysis, 
                              String recommendedNextStep, String explainabilityReport, 
                              String biasFairnessCheck) {
        this.prediction = prediction;
        this.confidence = confidence;
        this.speech_score = speech_score;
        this.speechAnalysisSummary = speechAnalysisSummary;
        this.cognitiveIndicators = cognitiveIndicators;
        this.linguisticAnalysis = linguisticAnalysis;
        this.acousticAnalysis = acousticAnalysis;
        this.recommendedNextStep = recommendedNextStep;
        this.explainabilityReport = explainabilityReport;
        this.biasFairnessCheck = biasFairnessCheck;
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

    public String getSpeechAnalysisSummary() {
        return speechAnalysisSummary;
    }

    public void setSpeechAnalysisSummary(String speechAnalysisSummary) {
        this.speechAnalysisSummary = speechAnalysisSummary;
    }

    public List<String> getCognitiveIndicators() {
        return cognitiveIndicators;
    }

    public void setCognitiveIndicators(List<String> cognitiveIndicators) {
        this.cognitiveIndicators = cognitiveIndicators;
    }

    public String getLinguisticAnalysis() {
        return linguisticAnalysis;
    }

    public void setLinguisticAnalysis(String linguisticAnalysis) {
        this.linguisticAnalysis = linguisticAnalysis;
    }

    public String getAcousticAnalysis() {
        return acousticAnalysis;
    }

    public void setAcousticAnalysis(String acousticAnalysis) {
        this.acousticAnalysis = acousticAnalysis;
    }

    public String getRecommendedNextStep() {
        return recommendedNextStep;
    }

    public void setRecommendedNextStep(String recommendedNextStep) {
        this.recommendedNextStep = recommendedNextStep;
    }

    public String getExplainabilityReport() {
        return explainabilityReport;
    }

    public void setExplainabilityReport(String explainabilityReport) {
        this.explainabilityReport = explainabilityReport;
    }

    public String getBiasFairnessCheck() {
        return biasFairnessCheck;
    }

    public void setBiasFairnessCheck(String biasFairnessCheck) {
        this.biasFairnessCheck = biasFairnessCheck;
    }
}
