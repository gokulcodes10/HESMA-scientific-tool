package com.hesma.calculator.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ElementProperties {

    @JsonProperty("symbol")
    private String symbol;

    @JsonProperty("name")
    private String name;

    @JsonProperty("atomicNumber")
    private Double atomicNumber;

    @JsonProperty("atomicMass")
    private Double atomicMass;

    @JsonProperty("density")
    private Double density;

    @JsonProperty("molarVolume")
    private Double molarVolume;

    // ── Mechanical ──────────────────────────────────────
    @JsonProperty("youngModulus")
    private Double youngModulus;

    @JsonProperty("rigidityModulus")
    private Double rigidityModulus;

    @JsonProperty("bulkModulus")
    private Double bulkModulus;

    @JsonProperty("shearModulus")
    private Double shearModulus;

    @JsonProperty("poissonRatio")
    private Double poissonRatio;

    // ── Thermal ──────────────────────────────────────────
    @JsonProperty("meltingPoint")
    private Double meltingPoint;

    @JsonProperty("boilingPoint")
    private Double boilingPoint;

    // ── Radii ─────────────────────────────────────────────
    @JsonProperty("atomicRadius")
    private Double atomicRadius;

    @JsonProperty("clementiRadius")           // NEW — Clementi atomic radii (Å)
    private Double clementiRadius;

    @JsonProperty("ionicRadius")              // NEW — Shannon ionic radius (nm)
    private Double ionicRadius;

    @JsonProperty("covalentRadius")
    private Double covalentRadius;

    @JsonProperty("vdwRadius")
    private Double vdwRadius;

    @JsonProperty("pseudoRadius")
    private Double pseudoRadius;

    @JsonProperty("shannonRadius")
    private Double shannonRadius;

    // ── Electronegativity ─────────────────────────────────
    @JsonProperty("paulingEN")
    private Double paulingEN;

    @JsonProperty("martynovEN")
    private Double martynovEN;

    @JsonProperty("allredEN")
    private Double allredEN;

    // ── Electronic ────────────────────────────────────────
    @JsonProperty("valenceElectrons")
    private Double valenceElectrons;

    // ── MICID Feature Set ─────────────────────────────────
    @JsonProperty("wcr")                      // Waber-Cromer pseudopotential radius
    private Double wcr;

    @JsonProperty("mr")                       // Metallic radius (nm)
    private Double mr;

    @JsonProperty("cs")                       // Pettifor chemical scale
    private Double cs;

    // ── Lattice ───────────────────────────────────────────
    @JsonProperty("a")
    private Double a;

    @JsonProperty("b")
    private Double b;

    @JsonProperty("c")
    private Double c;

    @JsonProperty("alpha")
    private Double alpha;

    @JsonProperty("beta")
    private Double beta;

    @JsonProperty("gamma")
    private Double gamma;

    // ═══════════════════════════════════════════════════════
    // SAFE GETTERS  — never throw NullPointerException
    // ═══════════════════════════════════════════════════════

    /** Metallic / atomic radius used for δ and size-difference features (Å) */
    public double getSafeRadius() {
        if (atomicRadius   != null) return atomicRadius;
        if (clementiRadius != null) return clementiRadius;
        if (pseudoRadius   != null) return pseudoRadius;
        if (vdwRadius      != null) return vdwRadius;
        if (covalentRadius != null) return covalentRadius;
        return 1.5;
    }

    /** Clementi atomic radius (Å) — used for 'ar' feature */
    public double getSafeClementiRadius() {
        if (clementiRadius != null) return clementiRadius;
        if (atomicRadius   != null) return atomicRadius;
        return 1.5;
    }

    /** Shannon ionic radius (nm) — used for 'ir' feature */
    public double getSafeIonicRadius() {
        if (ionicRadius    != null) return ionicRadius;
        if (shannonRadius  != null) return shannonRadius;
        return 0.07;   // typical transition metal fallback
    }

    /** Metallic radius (nm) — used for 'mr' feature */
    public double getSafeMr() {
        return mr != null ? mr : (getSafeRadius() * 0.1); // fallback: convert Å → nm
    }

    /** Waber-Cromer pseudopotential radius */
    public double getSafeWcr() {
        return wcr != null ? wcr : 0.5;
    }

    /** Pettifor chemical scale */
    public double getSafeCs() {
        return cs != null ? cs : 1.0;
    }

    /** Valence electrons per atom (ev) — for VEC numerator */
    public double getSafeVEC() {
        return valenceElectrons != null ? valenceElectrons : 0;
    }

    /** Atomic number Z — for VEC denominator (et) */
    public double getSafeAtomicNumber() {
        return atomicNumber != null ? atomicNumber : 1;
    }

    /** Atomic mass */
    public double getSafeAtomicMass() {
        return atomicMass != null ? atomicMass : 1;
    }

    /** Best available Pauling EN */
    public double getSafeEN() {
        if (paulingEN   != null) return paulingEN;
        if (martynovEN  != null) return martynovEN;
        if (allredEN    != null) return allredEN;
        return 1.5;
    }

    public double getSafeMeltingPoint() {
        return meltingPoint != null ? meltingPoint : 1000;
    }

    public double getSafeDensity() {
        return density != null ? density : 0;
    }

    public double getSafeYoung() {
        return youngModulus != null ? youngModulus : 0;
    }

    public double getSafeBulk() {
        return bulkModulus != null ? bulkModulus : 0;
    }

    public double getSafeShear() {
        if (shearModulus    != null) return shearModulus;
        if (rigidityModulus != null) return rigidityModulus;
        return 0;
    }
}