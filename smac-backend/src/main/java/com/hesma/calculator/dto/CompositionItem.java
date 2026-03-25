package com.hesma.calculator.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CompositionItem {

    @JsonProperty("symbol")
    private String symbol;

    @JsonProperty("percentage")
    private double percentage;

    public CompositionItem() {
    }

    public CompositionItem(String symbol, double percentage) {
        this.symbol = symbol;
        this.percentage = percentage;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol != null ? symbol.trim() : null;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}