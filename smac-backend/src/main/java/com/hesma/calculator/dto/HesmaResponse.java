package com.hesma.calculator.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HesmaResponse {

    // ── Atomic features (MICID paper) ────────────────────
    private Double en;               // Pauling electronegativity (weighted avg)
    private Double ar;               // Clementi atomic radius (Å)
    private Double ir;               // Ionic radius (nm)
    private Double amu;              // Atomic mass (weighted avg)
    private Double wcr;              // Waber-Cromer pseudopotential radius
    private Double ven;              // Valence electron number (weighted avg)
    private Double effectiveZ;       // Effective atomic number Z (weighted avg)
    private Double mr;               // Metallic radius (nm, weighted avg)
    private Double cs;               // Pettifor chemical scale (weighted avg)

    // ── Thermodynamic ────────────────────────────────────
    private Double atomicSizeMismatch;   // δ — size difference (%)
    private Double entropyMix;           // ΔSmix  J/(mol·K)
    private Double enthalpyMix;          // ΔHmix  kJ/mol
    private Double omega;                // Ω — entropy/enthalpy stability ratio
    private Double vec;                  // VEC — valence electron concentration
    private Double ePerA;                // e/a — electrons per atom (ev/et ratio)

    // ── Mechanical ───────────────────────────────────────
    private Double theoreticalDensity;
    private Double youngModulus;
    private Double bulkModulus;
    private Double shearModulus;

    // ── Electronic ───────────────────────────────────────
    private Double electronegativityDiff;  // Δχ

    // ── Derived ──────────────────────────────────────────
    private Double pughsRatio;
    private String ductility;
    private Double lambdaParam;            // λ = Smix / δ²

    // ── Thermal ──────────────────────────────────────────
    private Double meltingPoint;           // MP — alloy melting point (K)

    // ── Phase prediction ─────────────────────────────────
    private String phase;
    private String stability;
}