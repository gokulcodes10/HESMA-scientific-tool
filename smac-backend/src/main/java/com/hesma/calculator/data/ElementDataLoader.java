package com.hesma.calculator.data;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hesma.calculator.dto.ElementProperties;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class ElementDataLoader {

    private final Map<String, ElementProperties> elementDatabase = new HashMap<>();

    @PostConstruct
    public void init() {

        try {

            ObjectMapper mapper = new ObjectMapper();

            InputStream inputStream = getClass().getClassLoader().getResourceAsStream("elementData.json");

            if (inputStream == null) {
                throw new RuntimeException("elementData.json not found in resources folder");
            }

            List<ElementProperties> elements =
                    mapper.readValue(inputStream, new TypeReference<List<ElementProperties>>() {});

            for (ElementProperties element : elements) {

                if (element.getSymbol() == null) continue;

                String symbol = element.getSymbol().trim();

                elementDatabase.put(symbol, element);
                elementDatabase.put(symbol.toUpperCase(), element);
                elementDatabase.put(symbol.toLowerCase(), element);
            }

            log.info("Loaded {} elements into memory", elementDatabase.size());

        } catch (Exception e) {

            log.error("Error loading elementData.json", e);
            throw new RuntimeException("Failed to load element data", e);

        }
    }

    public ElementProperties getElement(String symbol) {

        if (symbol == null || symbol.isEmpty()) {
            return null;
        }

        ElementProperties element = elementDatabase.get(symbol);

        if (element != null) return element;

        return elementDatabase.get(symbol.trim());
    }

    public Map<String, ElementProperties> getAllElements() {
        return elementDatabase;
    }
}