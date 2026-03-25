package com.hesma.calculator.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AlloyRequest {

    @JsonProperty("composition")
    private List<CompositionItem> composition;

    public AlloyRequest() {
    }

    public AlloyRequest(List<CompositionItem> composition) {
        this.composition = composition;
    }

    public List<CompositionItem> getComposition() {
        return composition;
    }

    public void setComposition(List<CompositionItem> composition) {
        this.composition = composition;
    }
}