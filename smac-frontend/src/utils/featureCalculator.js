// src/utils/featureCalculator.js

export function calculateFeatures(selected, elements) {

  const selectedEntries = Object.entries(selected)
    .filter(([_, val]) => Number(val) > 0)

  const total = selectedEntries.reduce((sum, [_, val]) => {
    return sum + Number(val)
  }, 0)

  if (total === 0) {
    return null
  }

  const normalized = selectedEntries.map(([symbol, value]) => {
    const element = elements.find(e => e.symbol === symbol)
    return {
      ...element,
      fraction: Number(value) / total
    }
  })

  // Average Radius
  const avgRadius = normalized.reduce((sum, el) => {
    return sum + el.atomicRadius * el.fraction
  }, 0)

  // Delta
  const delta = Math.sqrt(
    normalized.reduce((sum, el) => {
      return sum + el.fraction *
        Math.pow(1 - el.atomicRadius / avgRadius, 2)
    }, 0)
  )

  // Entropy
  const entropy = -normalized.reduce((sum, el) => {
    return sum + el.fraction * Math.log(el.fraction)
  }, 0)

  // Avg Melting Point
  const avgMeltingPoint = normalized.reduce((sum, el) => {
    return sum + el.meltingPoint * el.fraction
  }, 0)

  // VEC
  const vec = normalized.reduce((sum, el) => {
    return sum + el.valenceElectrons * el.fraction
  }, 0)

  return {
    avgRadius: avgRadius.toFixed(2),
    delta: delta.toFixed(4),
    entropy: entropy.toFixed(4),
    avgMeltingPoint: avgMeltingPoint.toFixed(2),
    vec: vec.toFixed(2)
  }
}