import React from "react";

function SelectedCluster({ selected }) {
  return (
    <div className="mt-4 p-3 bg-dark text-white text-center">
      <h5>Selected Elements</h5>
      {selected.map((el) => (
        <span key={el.symbol} className="badge bg-warning text-dark m-1">
          {el.symbol}
        </span>
      ))}
    </div>
  );
}

export default SelectedCluster;