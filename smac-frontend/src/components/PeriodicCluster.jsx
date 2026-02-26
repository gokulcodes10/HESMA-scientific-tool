import React from "react";
import ElementCard from "./ElementCard";
import elements from "../data/elements.json";

function PeriodicCluster({ selected, setSelected }) {

  const handleSelect = (element) => {
    if (selected.includes(element)) {
      setSelected(selected.filter(e => e !== element));
    } else {
      setSelected([...selected, element]);
    }
  };

  return (
    <div className="d-flex flex-wrap justify-content-center">
      {elements.map((el) => (
        <ElementCard
          key={el.atomicNumber}
          element={el}
          onSelect={handleSelect}
          isSelected={selected.includes(el)}
        />
      ))}
    </div>
  );
}

export default PeriodicCluster;