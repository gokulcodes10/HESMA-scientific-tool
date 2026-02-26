package com.smac.demo.model;

public class Element {
     private String symbol;
    private double atomicRadius;
    private double meltingPoint;
    private double electronegativity;

    public Element() {
        this.symbol = symbol;
        this.atomicRadius = atomicRadius;
        this.meltingPoint = meltingPoint;
        this.electronegativity = electronegativity;
    }

    public String getSymbol() {
        return symbol;
    }
    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }
    public double getAtomicRadius() {
        return atomicRadius;
    }
    public void setAtomicRadius(double atomicRadius) {
        this.atomicRadius = atomicRadius;
    }
    public double getMeltingPoint() {
        return meltingPoint;
    }
    public void setMeltingPoint(double meltingPoint) {
        this.meltingPoint = meltingPoint;
    }
    public double getElectronegativity() {
        return electronegativity;
    }
    public void setElectronegativity(double electronegativity) {
        this.electronegativity = electronegativity;
    }
    @Override
    public String toString() {
        return "Elements [symbol=" + symbol + ", atomicRadius=" + atomicRadius + ", meltingPoint=" + meltingPoint
                + ", electronegativity=" + electronegativity + "]";
    }
    

    
}
