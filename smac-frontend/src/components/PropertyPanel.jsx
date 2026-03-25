import React, { useState } from "react";
import * as XLSX from "xlsx";

function PropertyPanel(props) {
  const {
    activeElements = [],
    onChange,
    totalPercentage,
    isValidComposition,
    results = null,
    onSaveToWorkspace
  } = props;

  const [tab, setTab] = useState("mechanical");

  // ── Map every Spring Boot response key → display key ──────────────────────
  const r = results || {};
  const mapped = {
    // Atomic (MICID paper features)
    en:     r.en,
    ar:     r.ar,
    ir:     r.ir,
    amu:    r.amu,
    wcr:    r.wcr,
    ven:    r.ven,
    Z:      r.effectiveZ,
    mr:     r.mr,
    cs:     r.cs,

    // Thermodynamic
    Smix:   r.entropyMix,
    Hmix:   r.enthalpyMix,
    omega:  r.omega,
    delta:  r.atomicSizeMismatch,
    sigma:  r.lambdaParam,
    vec:    r.vec,
    ePerA:  r.ePerA,

    // Mechanical
    theoreticalDensity: r.theoreticalDensity,
    youngModulus:       r.youngModulus,
    bulkModulus:        r.bulkModulus,
    shearModulus:       r.shearModulus,
    pughsRatio:         r.pughsRatio,
    ductility:          r.ductility,

    // Thermal
    MP: r.meltingPoint,

    // Phase
    phase:           r.phase,
    stabilityStatus: r.stability,
  };

  const fmt = (val, decimals = 3) => {
    if (val === undefined || val === null || val === "" || isNaN(Number(val))) return "—";
    return Number(val).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // ── Excel export ──────────────────────────────────────────────────────────
  const exportToExcel = (exportType) => {
    const sections = {
      atomic: [
        { Feature: "Pauling EN (en)",              Value: mapped.en,   Unit: "—"  },
        { Feature: "Clementi Radius (ar)",          Value: mapped.ar,   Unit: "Å"  },
        { Feature: "Ionic Radius (ir)",             Value: mapped.ir,   Unit: "nm" },
        { Feature: "Atomic Mass (amu)",             Value: mapped.amu,  Unit: "amu"},
        { Feature: "Waber-Cromer Radius (wcr)",     Value: mapped.wcr,  Unit: "—"  },
        { Feature: "Valence Electron No. (ven)",    Value: mapped.ven,  Unit: "—"  },
        { Feature: "Effective Atomic No. (Z)",      Value: mapped.Z,    Unit: "—"  },
        { Feature: "Metallic Radius (mr)",          Value: mapped.mr,   Unit: "nm" },
        { Feature: "Pettifor Scale (cs)",           Value: mapped.cs,   Unit: "—"  },
      ],
      thermo: [
        { Feature: "Entropy of Mix ΔSmix",         Value: mapped.Smix,  Unit: "J/(mol·K)" },
        { Feature: "Enthalpy of Mix ΔHmix",        Value: mapped.Hmix,  Unit: "kJ/mol"    },
        { Feature: "Stability Ratio Ω",            Value: mapped.omega, Unit: "—"          },
        { Feature: "Size Difference δ",            Value: mapped.delta, Unit: "%"          },
        { Feature: "Lambda Parameter σ",           Value: mapped.sigma, Unit: "—"          },
        { Feature: "VEC",                          Value: mapped.vec,   Unit: "—"          },
        { Feature: "Electrons per Atom (e/a)",     Value: mapped.ePerA, Unit: "—"          },
      ],
      thermal: [
        { Feature: "Alloy Melting Point (MP)", Value: mapped.MP, Unit: "K" },
      ],
      mechanical: [
        { Feature: "Theoretical Density",  Value: mapped.theoreticalDensity, Unit: "g/cm³" },
        { Feature: "Young's Modulus (E)",  Value: mapped.youngModulus,        Unit: "GPa"   },
        { Feature: "Bulk Modulus (K)",     Value: mapped.bulkModulus,         Unit: "GPa"   },
        { Feature: "Shear Modulus (G)",    Value: mapped.shearModulus,        Unit: "GPa"   },
        { Feature: "Pugh's Ratio (G/B)",  Value: mapped.pughsRatio,          Unit: "—"     },
        { Feature: "Ductility",            Value: mapped.ductility,           Unit: "—"     },
      ],
    };

    const dataToExport = exportType === "all"
      ? Object.values(sections).flat()
      : sections[exportType] || [];

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "HESMA Alloy Data");
    XLSX.writeFile(wb, `HESMA_${exportType}_${Date.now()}.xlsx`);
  };

  return (
    <div className="property-panel scientific-dashboard">

      {/* ── COMPOSITION TABLE ──────────────────────────────────────────────── */}
      <div className="dashboard-section composition-dashboard">
        <div className="section-header">
          <h2>Alloy Composition &amp; Stoichiometry</h2>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div className={`status-badge ${isValidComposition ? "status-valid" : "status-error"}`}>
              {isValidComposition ? "SYSTEM BALANCED" : "IMBALANCED SYSTEM"}
            </div>
            {isValidComposition && (
              <button className="btn-save-workspace" onClick={onSaveToWorkspace}>
                + Save to Workspace
              </button>
            )}
          </div>
        </div>

        <table className="data-table stoichiometry-table">
          <thead>
            <tr>
              <th>Element</th>
              <th>Atomic Input (%)</th>
              <th>Atomic Mass (amu)</th>
              <th>Valence Electrons</th>
            </tr>
          </thead>
          <tbody>
            {activeElements.map((el) => (
              <tr key={el.symbol}>
                <td><span className="element-chip">{el.symbol}</span></td>
                <td className="input-cell">
                  <input
                    type="number"
                    className="sci-input"
                    value={el.percentage}
                    onChange={(e) => onChange(el.symbol, e.target.value)}
                  />
                </td>
                <td className="sci-num">{fmt(el.atomicMass)}</td>
                <td className="sci-num highlight-num">{fmt(el.valenceElectrons)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="system-totals">
          <div className="total-metric">
            <span className="metric-label">Total Atomic %:</span>
            <span className={`metric-value sci-num ${isValidComposition ? "text-green" : "text-red"}`}>
              {fmt(totalPercentage, 2)}%
            </span>
          </div>
        </div>
      </div>

      {/* ── ANALYSIS PANEL ─────────────────────────────────────────────────── */}
      {isValidComposition && results && (
        <div className="dashboard-section analysis-dashboard">
          <div className="section-header">
            <h2>Thermodynamic &amp; Phase Analysis</h2>
            <div className="export-btn-group" style={{ display: "flex", gap: "8px" }}>
              <button className="btn-export-pdf"   onClick={() => window.print()}>EXPORT PDF</button>
              <button className="btn-export-excel" onClick={() => exportToExcel("all")}>EXPORT EXCEL</button>
            </div>
          </div>

          {/* ── Critical metrics grid ── */}
          <div className="critical-metrics-grid">
            <div className="metric-card">
              <span className="card-label">PREDICTED PHASE</span>
              <span className="card-value phase-value" style={{ color: "#a855f7" }}>
                {mapped.phase || "—"}
              </span>
            </div>
            <div className="metric-card">
              <span className="card-label">VEC</span>
              <span className="card-value sci-num">{fmt(mapped.vec)}</span>
            </div>
            <div className="metric-card">
              <span className="card-label">PHASE STABILITY</span>
              <span className="card-value stability-value" style={{ color: "#f59e0b" }}>
                {mapped.stabilityStatus || "—"}
              </span>
            </div>
            <div className="metric-card">
              <span className="card-label">Ω (OMEGA)</span>
              <span className="card-value sci-num">{fmt(mapped.omega)}</span>
            </div>
            <div className="metric-card">
              <span className="card-label">δ SIZE DIFF (%)</span>
              <span className="card-value sci-num">{fmt(mapped.delta)}</span>
            </div>
            <div className="metric-card">
              <span className="card-label">DUCTILITY</span>
              <span className="card-value" style={{ color: mapped.ductility === "Ductile" ? "#10b981" : "#ef4444" }}>
                {mapped.ductility || "—"}
              </span>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="sci-tabs">
            {["mechanical", "thermo", "atomic", "thermal"].map((t) => (
              <button
                key={t}
                className={tab === t ? "active" : ""}
                onClick={() => setTab(t)}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {/* ── Tab content ── */}
          <div className="property-data-grid">

            {tab === "mechanical" && (
              <>
                <Property label="Theoretical Density"    value={mapped.theoreticalDensity} unit="g/cm³" />
                <Property label="Young's Modulus (E)"    value={mapped.youngModulus}        unit="GPa"   />
                <Property label="Bulk Modulus (K)"       value={mapped.bulkModulus}         unit="GPa"   />
                <Property label="Shear Modulus (G)"      value={mapped.shearModulus}        unit="GPa"   />
                <Property label="Pugh's Ratio (G/B)"     value={mapped.pughsRatio}          unit="—"     />
                <Property label="Ductility"              value={mapped.ductility}           isText       />
              </>
            )}

            {tab === "thermo" && (
              <>
                <Property label="Entropy of Mix ΔSmix"   value={mapped.Smix}  unit="J/(mol·K)" />
                <Property label="Enthalpy of Mix ΔHmix"  value={mapped.Hmix}  unit="kJ/mol"    />
                <Property label="Stability Ratio Ω"      value={mapped.omega} unit="—"         />
                <Property label="Size Difference δ"      value={mapped.delta} unit="%"         />
                <Property label="Lambda Parameter λ"     value={mapped.sigma} unit="—"         />
                <Property label="VEC"                    value={mapped.vec}   unit="—"         />
                <Property label="Electrons per Atom e/a" value={mapped.ePerA} unit="—"         />
              </>
            )}

            {tab === "atomic" && (
              <>
                <Property label="Pauling EN (en)"              value={mapped.en}  unit="—"  />
                <Property label="Clementi Radius (ar)"         value={mapped.ar}  unit="Å"  />
                <Property label="Ionic Radius (ir)"            value={mapped.ir}  unit="nm" />
                <Property label="Atomic Mass (amu)"            value={mapped.amu} unit="amu"/>
                <Property label="Waber-Cromer Radius (wcr)"   value={mapped.wcr} unit="—"  />
                <Property label="Valence Electron No. (ven)"  value={mapped.ven} unit="—"  />
                <Property label="Effective Atomic No. (Z)"    value={mapped.Z}   unit="—"  />
                <Property label="Metallic Radius (mr)"        value={mapped.mr}  unit="nm" />
                <Property label="Pettifor Scale (cs)"         value={mapped.cs}  unit="—"  />
              </>
            )}

            {tab === "thermal" && (
              <Property label="Alloy Melting Point (MP)" value={mapped.MP} unit="K" />
            )}

          </div>

          <div className="section-footer-actions">
            <button className="btn-export-sub" onClick={() => exportToExcel(tab)}>
              Export Current Section ({tab.toUpperCase()})
            </button>
          </div>
        </div>
      )}

      {/* ── Loading placeholder ── */}
      {isValidComposition && !results && (
        <div className="dashboard-section" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
          Waiting for Spring Boot calculation...
        </div>
      )}
    </div>
  );
}

function Property({ label, value, unit, isText = false }) {
  const display = () => {
    if (isText) return value || "—";
    if (value === undefined || value === null || value === "" || isNaN(Number(value))) return "—";
    return Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });
  };
  return (
    <div className="data-row">
      <span className="data-label">{label}</span>
      <div className="data-value-group">
        <span className="data-value sci-num">{display()}</span>
        {unit && <span className="data-unit">{unit}</span>}
      </div>
    </div>
  );
}

export default PropertyPanel;