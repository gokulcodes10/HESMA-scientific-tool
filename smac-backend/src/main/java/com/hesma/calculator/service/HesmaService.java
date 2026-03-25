package com.hesma.calculator.service;

import com.hesma.calculator.dto.AlloyRequest;
import com.hesma.calculator.dto.HesmaResponse;
import com.hesma.calculator.engine.ThermodynamicEngine;
import org.springframework.stereotype.Service;

@Service
public class HesmaService {

    private final ThermodynamicEngine engine;

    public HesmaService(ThermodynamicEngine engine) {
        this.engine = engine;
    }

    public HesmaResponse calculateAlloy(AlloyRequest request) {

        if (request == null || request.getComposition() == null || request.getComposition().isEmpty()) {
            throw new RuntimeException("Invalid alloy composition input");
        }

        return engine.compute(request.getComposition());
    }
}