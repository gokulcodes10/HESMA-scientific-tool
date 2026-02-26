import React, { useState } from "react";
import PeriodicCluster from "./components/PeriodicCluster";
import SelectedCluster from "./components/SelectedCluster";
import { calculateAlloy } from "./services/api";

function App() {

  const [selected, setSelected] = useState([]);
  const [results, setResults] = useState(null);

  const handleCalculate = async () => {
    if (selected.length === 0) {
      alert("Select at least one element!");
      return;
    }

    try {
      const data = await calculateAlloy(selected);
      setResults(data);
    } catch (error) {
      alert("Error calculating alloy");
    }
  };

  return (
    <div className="container text-center">
      <h2 className="my-4">Alloy Designer</h2>

      <PeriodicCluster selected={selected} setSelected={setSelected} />

      <SelectedCluster selected={selected} />

      <button
        className="btn btn-primary mt-3"
        onClick={handleCalculate}
      >
        Calculate Alloy
      </button>

      {results && (
        <div className="mt-4 p-3 border rounded shadow">
          <h4>Alloy Results</h4>
          <p><strong>Delta:</strong> {results.delta}</p>
          <p><strong>Delta S mix:</strong> {results.deltaSmix}</p>
          <p><strong>Average Tm:</strong> {results.Tm}</p>
        </div>
      )}

    </div>
  );
}

export default App;