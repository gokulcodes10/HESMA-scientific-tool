import ElementCard from "./ElementCard"

export default function AdvancedPeriodicTable({
  elements,
  selected,
  onSelect
}) {
  return (
    <div className="periodic-grid">
      {elements.map((el) => (
        <ElementCard
          key={el.atomicNumber}
          element={el}
          isSelected={!!selected[el.symbol]}
          onClick={() => onSelect(el)}
        />
      ))}
    </div>
  )
}