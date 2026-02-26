package com.smac.demo.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.smac.demo.model.Element;

@Service
public class AlloyService {

    private static final double R = 8.314;

    public Map<String, Double> calculateAlloy(List<Element> elements) {

        int n = elements.size();
        double ci = 1.0 / n;

        double avgRadius = elements.stream()
                .mapToDouble(Element::getAtomicRadius)
                .average()
                .orElse(0);

        double delta = 0;
        double deltaSmix = 0;
        double avgTm = 0;

        for (Element e : elements) {
            delta += ci * Math.pow(1 - e.getAtomicRadius()/avgRadius, 2);
            deltaSmix += ci * Math.log(ci);
            avgTm += ci * e.getMeltingPoint();
        }

        delta = Math.sqrt(delta);
        deltaSmix = -R * deltaSmix;

        Map<String, Double> result = new HashMap<>();
        result.put("delta", delta);
        result.put("deltaSmix", deltaSmix);
        result.put("Tm", avgTm);

        return result;
    }
}