import React from "react";

function ElementCard({ element, onSelect, isSelected }) {
  return (
    <div
      className={`card text-center p-2 m-2 shadow-sm 
        ${isSelected ? "border border-danger border-3" : ""}`}
      style={{ width: "70px", cursor: "pointer" }}
      onClick={() => onSelect(element)}
    >
      <h6>{element.symbol}</h6>
      <small>{element.atomicNumber}</small>
    </div>
  );
}

export default ElementCard;