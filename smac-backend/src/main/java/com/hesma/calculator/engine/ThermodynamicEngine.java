package com.hesma.calculator.engine;

import com.hesma.calculator.data.ElementDataLoader;
import com.hesma.calculator.dto.CompositionItem;
import com.hesma.calculator.dto.ElementProperties;
import com.hesma.calculator.dto.HesmaResponse;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ThermodynamicEngine {

    private final ElementDataLoader loader;

    public ThermodynamicEngine(ElementDataLoader loader) {
        this.loader = loader;
    }

    public HesmaResponse compute(List<CompositionItem> items) {

        final double R = 8.314;  // J/(mol·K)

        // ── Accumulators ─────────────────────────────────────────────────────
        double avgRadius      = 0;  // mean metallic radius (Å) — for δ
        double avgMelting     = 0;  // weighted average melting point (K)
        double entropyTerm    = 0;  // Σ ci·ln(ci) — for Smix

        // Mechanical
        double young  = 0;
        double bulk   = 0;
        double shear  = 0;

        // Electronic
        double enAvg  = 0;   // weighted avg Pauling EN — for Δχ

        // VEC numerator / denominator (paper formula: ev/et)
        double sumEv  = 0;   // Σ fi·evi  (valence electrons)
        double sumZ   = 0;   // Σ fi·Zi   (atomic numbers)

        // MICID atomic features (simple weighted averages)
        double avgEN    = 0;   // en  — Pauling EN
        double avgAr    = 0;   // ar  — Clementi radius (Å)
        double avgIr    = 0;   // ir  — ionic radius (nm)
        double avgAmu   = 0;   // amu — atomic mass
        double avgWcr   = 0;   // wcr — Waber-Cromer
        double avgVen   = 0;   // ven — valence electron number
        double avgMr    = 0;   // mr  — metallic radius (nm)
        double avgCs    = 0;   // cs  — Pettifor scale
        double avgZ     = 0;   // Z   — effective atomic number

        // Density (harmonic mean: 1/ρ_alloy = Σ ci/ρi)
        double densityDenominator = 0;

        // ── FIRST PASS: weighted sums ─────────────────────────────────────────
        for (CompositionItem item : items) {

            ElementProperties e = loader.getElement(item.getSymbol());
            if (e == null)
                throw new RuntimeException("Element not found in database: " + item.getSymbol());

            double ci = item.getPercentage() / 100.0;

            // Radius for δ (uses metallic radius mr if available, else atomicRadius)
            avgRadius   += ci * e.getSafeRadius();
            avgMelting  += ci * e.getSafeMeltingPoint();

            // Mechanical
            young += ci * e.getSafeYoung();
            bulk  += ci * e.getSafeBulk();
            shear += ci * e.getSafeShear();

            // EN for Δχ
            enAvg += ci * e.getSafeEN();

            // VEC (paper: ev/et = Σfi·evi / Σfi·Zi)
            sumEv += ci * e.getSafeVEC();
            sumZ  += ci * e.getSafeAtomicNumber();

            // Entropy term
            if (ci > 0) entropyTerm += ci * Math.log(ci);

            // Density
            if (e.getSafeDensity() > 0)
                densityDenominator += ci / e.getSafeDensity();

            // ── MICID atomic feature averages ──
            avgEN  += ci * e.getSafeEN();
            avgAr  += ci * e.getSafeClementiRadius();
            avgIr  += ci * e.getSafeIonicRadius();
            avgAmu += ci * e.getSafeAtomicMass();
            avgWcr += ci * e.getSafeWcr();
            avgVen += ci * e.getSafeVEC();
            avgMr  += ci * e.getSafeMr();
            avgCs  += ci * e.getSafeCs();
            avgZ   += ci * e.getSafeAtomicNumber();
        }

        // ── ATOMIC SIZE MISMATCH δ (paper formula × 100) ─────────────────────
        // δ = 100 × √( Σ ci·(1 - ri/r̄)² )   where r̄ = avgRadius
        double delta = 0;
        for (CompositionItem item : items) {
            ElementProperties e = loader.getElement(item.getSymbol());
            double ci = item.getPercentage() / 100.0;
            double ri = e.getSafeRadius();
            delta += ci * Math.pow(1.0 - ri / avgRadius, 2);
        }
        delta = 100.0 * Math.sqrt(delta);

        // ── CONFIGURATIONAL ENTROPY ───────────────────────────────────────────
        // ΔSmix = -R · Σ ci·ln(ci)
        double entropyMix = -R * entropyTerm;

        // ── MIXING ENTHALPY (Miedema-inspired) ───────────────────────────────
        double enthalpyMix = computeMiedemaMixingEnthalpy(items);

        // ── OMEGA PARAMETER ───────────────────────────────────────────────────
        // Ω = Tm·ΔSmix / |ΔHmix|
        double omega = (Math.abs(enthalpyMix) > 1e-9)
                ? (avgMelting * entropyMix) / Math.abs(enthalpyMix)
                : 999.0;  // near-zero enthalpy → very stable, use large Ω

        // ── DENSITY (rule of mixtures, harmonic) ─────────────────────────────
        double density = densityDenominator > 0 ? 1.0 / densityDenominator : 0;

        // ── ELECTRONEGATIVITY DIFFERENCE Δχ ──────────────────────────────────
        // Δχ = √( Σ ci·(χi - χ̄)² )
        double deltaChi = 0;
        for (CompositionItem item : items) {
            ElementProperties e = loader.getElement(item.getSymbol());
            double ci   = item.getPercentage() / 100.0;
            double diff = e.getSafeEN() - enAvg;
            deltaChi += ci * diff * diff;
        }
        deltaChi = Math.sqrt(deltaChi);

        // ── VEC (valence electron concentration) ─────────────────────────────
        // Simple weighted average: VEC = Σ ci·evi
        double vec = sumEv;

        // ── e/a (electrons per atom) — paper formula ─────────────────────────
        // e/a = (Σ fi·evi) / (Σ fi·Zi)
        double ePerA = sumZ > 0 ? sumEv / sumZ : 0;

        // ── MECHANICAL DERIVED ────────────────────────────────────────────────
        double pughsRatio = bulk > 0 ? shear / bulk : 0;
        String ductility  = pughsRatio > 0.57 ? "Ductile" : "Brittle";

        // ── LAMBDA PARAMETER ──────────────────────────────────────────────────
        // λ = ΔSmix / δ²
        double lambdaParam = entropyMix / (delta * delta + 1e-6);

        // ── PHASE PREDICTION (Zhang & Ma VEC criterion) ───────────────────────
        String phase;
        if      (vec >= 8.0)  phase = "FCC";
        else if (vec < 6.87)  phase = "BCC";
        else                  phase = "FCC + BCC";

        // ── SOLID SOLUTION STABILITY (Ye et al. criterion) ───────────────────
        String stability;
        if (delta < 6.0 && omega > 1.1)
            stability = "Stable Solid Solution";
        else if (delta >= 6.0 && omega < 1.1)
            stability = "Intermetallic Likely";
        else if (delta < 6.0)
            stability = "Possible Solid Solution";
        else
            stability = "Mixed / Amorphous";

        // ── BUILD RESPONSE ────────────────────────────────────────────────────
        HesmaResponse response = new HesmaResponse();

        // Atomic features (MICID)
        response.setEn(avgEN);
        response.setAr(avgAr);
        response.setIr(avgIr);
        response.setAmu(avgAmu);
        response.setWcr(avgWcr);
        response.setVen(avgVen);
        response.setEffectiveZ(avgZ);
        response.setMr(avgMr);
        response.setCs(avgCs);

        // Thermodynamic
        response.setAtomicSizeMismatch(delta);
        response.setEntropyMix(entropyMix);
        response.setEnthalpyMix(enthalpyMix);
        response.setOmega(omega);
        response.setVec(vec);
        response.setEPerA(ePerA);

        // Mechanical
        response.setTheoreticalDensity(density);
        response.setYoungModulus(young);
        response.setBulkModulus(bulk);
        response.setShearModulus(shear);

        // Electronic
        response.setElectronegativityDiff(deltaChi);

        // Derived
        response.setPughsRatio(pughsRatio);
        response.setDuctility(ductility);
        response.setLambdaParam(lambdaParam);

        // Thermal
        response.setMeltingPoint(avgMelting);

        // Phase
        response.setPhase(phase);
        response.setStability(stability);

        return response;
    }

    /**
     * Miedema-inspired mixing enthalpy.
     *
     * Uses the standard pairwise formula:
     *   ΔHmix = Σ_{i<j} Ωij · ci · cj
     * where
     *   Ωij = -4 · ΔHmix_AB (regular solution parameter)
     *
     * Approximation used here (when full Miedema tables are unavailable):
     *   ΔHmix_AB ≈ K · (χA - χB)²
     * with K calibrated to -25 kJ/mol, which better matches
     * published values for common HEA pairs (TiNi, NiCr, etc.)
     * compared to the previous K = -10 constant.
     *
     * For a full implementation, replace with element-pair lookup table
     * using Takeuchi & Inoue binary enthalpy data.
     */
    private double computeMiedemaMixingEnthalpy(List<CompositionItem> items) {

        double enthalpy = 0;

        for (int i = 0; i < items.size(); i++) {

            ElementProperties e1 = loader.getElement(items.get(i).getSymbol());
            double ci = items.get(i).getPercentage() / 100.0;

            for (int j = i + 1; j < items.size(); j++) {

                ElementProperties e2 = loader.getElement(items.get(j).getSymbol());
                double cj = items.get(j).getPercentage() / 100.0;

                double enDiff = e1.getSafeEN() - e2.getSafeEN();

                // Improved calibration constant (was -10, now -25 kJ/mol)
                double omega_ij = -25.0 * enDiff * enDiff;

                enthalpy += omega_ij * ci * cj;
            }
        }

        return enthalpy;
    }
}