package com.neuroscan.backend.controller;

import com.neuroscan.backend.dto.PredictionRequest;
import com.neuroscan.backend.dto.PredictionResponse;
import com.neuroscan.backend.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allows React frontend to access the API
public class PredictionController {

    private final PredictionService predictionService;

    @Autowired
    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    // Supports GET request to match previous frontend simulation
    @GetMapping("/predict")
    public PredictionResponse getPrediction() {
        return predictionService.analyzeSpeech("");
    }

    // Supports POST request with transcript text for actual processing
    @PostMapping("/predict")
    public PredictionResponse processSpeech(@RequestBody PredictionRequest request) {
        return predictionService.analyzeSpeech(request.getText());
    }
}
