package com.hesma.calculator.controller;
import com.hesma.calculator.dto.AlloyRequest;
import com.hesma.calculator.dto.HesmaResponse;
import com.hesma.calculator.service.HesmaService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/hesma")
@CrossOrigin(origins = "*")
public class HesmaController {

    private final HesmaService hesmaService;

    public HesmaController(HesmaService hesmaService) {
        this.hesmaService = hesmaService;
    }

    @PostMapping("/calculate")
    public HesmaResponse calculate(@RequestBody AlloyRequest request) {

        if (request == null || request.getComposition() == null) {
            throw new RuntimeException("Invalid request payload");
        }

        return hesmaService.calculateAlloy(request);
    }
}