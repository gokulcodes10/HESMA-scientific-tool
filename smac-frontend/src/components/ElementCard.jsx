// components/ElementCard.jsx
export default function ElementCard({ element, isSelected, onClick }) {
  return (
    <div
      className={`element-card ${isSelected ? "selected" : ""}`}
      onClick={onClick}
      style={{
        // Brilliant use of dynamic grid positioning!
        gridColumn: element.group, 
        gridRow: element.period
      }}
    >
      <div className="atomic-number">{element.atomicNumber}</div>
      <div className="symbol">{element.symbol}</div>
      <div className="element-name">{element.name}</div>
    </div>
  );
}