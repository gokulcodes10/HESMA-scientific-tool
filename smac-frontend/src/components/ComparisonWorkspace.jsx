import React from "react";

export default function ComparisonWorkspace({ workspace, onClear }) {
  if (workspace.length === 0) return null;

  const formatValue = (val) => {
    if (val === undefined || val === null || isNaN(val)) return "—";
    return Number(val).toFixed(3);
  };

  return (
    <div className="dashboard-section workspace-section">
      <div className="section-header">
        <h2>High-Throughput Workspace ({workspace.length}/5)</h2>
        <button className="btn-clear" onClick={onClear}>Clear Workspace</button>
      </div>

      <div className="workspace-table-container">
        <table className="data-table workspace-table">
          <thead>
            <tr>
              <th>Alloy System</th>
              <th>Phase</th>
              <th>Stability</th>
              <th>VEC</th>
              <th>Density (g/cm³)</th>
              <th>Melting Pt (K)</th>
              <th>Modulus (GPa)</th>
              <th>ΔS_mix (J/mol·K)</th>
              <th>ΔH_mix (kJ/mol)</th>
            </tr>
          </thead>
          <tbody>
            {workspace.map((alloy) => (
              <tr key={alloy.id}>
                <td className="highlight-name">{alloy.name}</td>
                <td className={alloy.phase.includes("Mixed") ? "text-blue" : "phase-value"}>{alloy.phase}</td>
                <td className="stability-value">{alloy.stability}</td>
                <td className="sci-num">{formatValue(alloy.VEC)}</td>
                <td className="sci-num">{formatValue(alloy.density)}</td>
                <td className="sci-num">{formatValue(alloy.meltingPoint)}</td>
                <td className="sci-num">{formatValue(alloy.youngModulus)}</td>
                <td className="sci-num">{formatValue(alloy.entropy)}</td>
                <td className="sci-num">{formatValue(alloy.mixingEnthalpy)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}