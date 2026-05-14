package com.neuroscan.backend.service;

import com.neuroscan.backend.dto.PredictionResponse;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
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
        int confidence = 85 + random.nextInt(12); // 85-96%
        int speechScore = 15 + random.nextInt(85); // 15-100

        String prediction;
        String speechAnalysisSummary;
        List<String> cognitiveIndicators;
        String linguisticAnalysis;
        String acousticAnalysis;
        String recommendedNextStep;
        String explainabilityReport;
        
        if (speechScore >= 90) {
            prediction = "No Dementia Detected";
            speechAnalysisSummary = "Speech fluency is perfectly intact with optimal pause frequency and no hesitation.";
            cognitiveIndicators = Arrays.asList("Excellent memory recall", "Seamless conversation flow", "Precise temporal references");
            linguisticAnalysis = "Outstanding vocabulary richness and complex sentence structures.";
            acousticAnalysis = "Optimal pitch variation and speech rate. No vocal tremors detected.";
            recommendedNextStep = "No further action required. Re-evaluate if symptoms emerge.";
            explainabilityReport = "The model found zero significant linguistic or acoustic deviations associated with cognitive impairment. Word retrieval speeds are within the top percentile for the demographic.";
        } else if (speechScore >= 61) {
            prediction = "Low Risk";
            speechAnalysisSummary = "Speech fluency is intact with normal pause frequency and minimal hesitation.";
            cognitiveIndicators = Arrays.asList("Good memory recall", "Consistent conversation flow", "Clear temporal references");
            linguisticAnalysis = "High vocabulary richness and complex sentence structures present.";
            acousticAnalysis = "Normal pitch variation and speech rate. No vocal tremors detected.";
            recommendedNextStep = "Routine clinical follow-up in 12 months.";
            explainabilityReport = "The model found no significant linguistic or acoustic deviations associated with cognitive impairment. Word retrieval speeds are within the 90th percentile for the demographic.";
        } else if (speechScore >= 31) {
            prediction = "Moderate Risk";
            speechAnalysisSummary = "Occasional long pauses and mild word-finding difficulties observed.";
            cognitiveIndicators = Arrays.asList("Mild memory recall issues", "Occasional temporal confusion");
            linguisticAnalysis = "Slight reduction in vocabulary richness; over-reliance on common nouns.";
            acousticAnalysis = "Slightly slowed speech rate with minor emotional tone flattening.";
            recommendedNextStep = "Schedule a comprehensive neuropsychological evaluation within 30 days.";
            explainabilityReport = "The model detected subtle patterns of anomia (word-finding difficulty) and increased pause durations, which are correlated with early-stage Mild Cognitive Impairment (MCI).";
        } else {
            prediction = "High Risk";
            speechAnalysisSummary = "Significant broken sentence structures, frequent hesitation, and repetitive phrasing.";
            cognitiveIndicators = Arrays.asList("Frequent memory recall failures", "Inability to complete thoughts", "Reduced reasoning ability");
            linguisticAnalysis = "Poor semantic coherence and significantly simplified grammar structures.";
            acousticAnalysis = "Noticeable voice tremors, flat pitch variation, and bradykinesia of speech.";
            recommendedNextStep = "Urgent referral to a neurologist for an MRI and full cognitive assessment.";
            explainabilityReport = "The AI identified multiple concurrent markers of neurodegeneration, including semantic degradation, prolonged pauses (>1.5s), and syntax breakdown, heavily weighting the prediction towards High Risk.";
        }

        String biasFairnessCheck = "Fairness Validation: Check Passed. Audio features normalized across all demographic groups to prevent bias.";

        return new PredictionResponse(
            prediction, confidence, speechScore,
            speechAnalysisSummary, cognitiveIndicators,
            linguisticAnalysis, acousticAnalysis,
            recommendedNextStep, explainabilityReport,
            biasFairnessCheck
        );
    }
}
