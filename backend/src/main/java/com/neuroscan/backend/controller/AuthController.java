package com.neuroscan.backend.controller;

import com.neuroscan.backend.dto.AuthResponse;
import com.neuroscan.backend.dto.LoginRequest;
import com.neuroscan.backend.dto.RegisterRequest;
import com.neuroscan.backend.entity.User;
import com.neuroscan.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5174") // Allow React frontend
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(new AuthResponse(false, "Email is already registered.", null));
        }

        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        // In a real production app, we would hash this password with BCrypt.
        // For this local medical demo, we store it directly as requested.
        newUser.setPassword(request.getPassword());
        
        User savedUser = userRepository.save(newUser);
        
        // Remove password before sending to frontend
        savedUser.setPassword(null);
        return ResponseEntity.ok(new AuthResponse(true, "Registration successful!", savedUser));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getPassword().equals(request.getPassword())) {
                // Remove password before sending to frontend
                user.setPassword(null);
                return ResponseEntity.ok(new AuthResponse(true, "Login successful!", user));
            } else {
                return ResponseEntity.status(401).body(new AuthResponse(false, "Invalid password.", null));
            }
        } else {
            return ResponseEntity.status(404).body(new AuthResponse(false, "User not found with this email.", null));
        }
    }
}
