package com.smac.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smac.demo.service.AlloyService;

@RestController
@RequestMapping("/api/alloy")
public class AlloyController {

    @Autowired
    private AlloyService alloyService;

    @PostMapping("/calculate")
    public Map<String, Double> calculate(@RequestBody List<com.smac.demo.model.Element> elements) {
        return alloyService.calculateAlloy(elements);
    }

    @GetMapping("/test")
    public String test() {
        return "Backend is working!";
    }
}