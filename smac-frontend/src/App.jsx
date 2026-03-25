import { useState, useEffect } from "react"
import elements from "./data/elementData.json"
import AdvancedPeriodicTable from "./components/AdvancedPeriodicTable"
import PropertyPanel from "./components/PropertyPanel"
import ExportButtons from "./components/ExportButtons"
import ComparisonWorkspace from "./components/ComparisonWorkspace"
import { calculateAlloy } from "./services/api"

function App() {
  const [selected, setSelected] = useState({})
  const [theme, setTheme] = useState("light")
  const [workspace, setWorkspace] = useState([])
  const [backendData, setBackendData] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [apiError, setApiError] = useState(null)

  const handleSelect = (element) => {
    setSelected((prev) => {
      const updated = { ...prev }
      if (updated[element.symbol]) {
        delete updated[element.symbol]
      } else {
        updated[element.symbol] = { ...element, percentage: 0 }
      }
      return updated
    })
  }

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"))

  const handlePercentageChange = (symbol, value) => {
    setSelected((prev) => ({
      ...prev,
      [symbol]: { ...prev[symbol], percentage: Number(value) }
    }))
  }

  const activeElements = Object.values(selected)

  const totalPercentage = activeElements.reduce(
    (sum, el) => sum + (Number(el.percentage) || 0), 0
  )
  const isValidComposition = totalPercentage === 100

  const compositionWithWeight = activeElements.map((el) => {
    const atomicMass = el.atomicMass || 0
    const atomicPercent = Number(el.percentage) || 0
    const moleFraction = atomicPercent / 100
    return {
      element: el.symbol,
      atomicPercent,
      atomicMass,
      moleFraction,
      molarContribution: moleFraction * atomicMass
    }
  })

  const alloyMolarMass = compositionWithWeight.reduce((sum, el) => sum + el.molarContribution, 0)
  const compositionFinal = compositionWithWeight.map(el => ({
    ...el,
    weightPercent: alloyMolarMass ? (el.molarContribution / alloyMolarMass) * 100 : 0
  }))

  // =============================================
  // FIXED: API call using the api.js service
  // =============================================
  useEffect(() => {
    if (!isValidComposition) {
      setBackendData(null)
      return
    }

    const run = async () => {
      setIsCalculating(true)
      setApiError(null)
      try {
        const payload = activeElements.map(el => ({
          symbol: el.symbol,
          percentage: Number(el.percentage)
        }))
        const data = await calculateAlloy(payload)
        setBackendData(data)
      } catch (error) {
        console.error("Spring Boot API error:", error)
        setApiError("Calculation Engine Offline. Is Spring Boot running?")
        setBackendData(null)
      } finally {
        setIsCalculating(false)
      }
    }

    run()
  }, [selected, isValidComposition])

  const saveToWorkspace = () => {
    if (!isValidComposition || !backendData || workspace.length >= 100) return
    const alloyName = activeElements
      .map(el => `${el.symbol}${Number(el.percentage).toFixed(0)}`)
      .join("-")
    const newSavedAlloy = {
      id: Date.now(),
      name: alloyName,
      phase: backendData.phase,
      stability: backendData.stability,
      VEC: backendData.vec,
      density: backendData.theoreticalDensity,
      youngModulus: backendData.youngModulus,
      entropy: backendData.entropyMix,
      mixingEnthalpy: backendData.enthalpyMix
    }
    setWorkspace(prev => [...prev, newSavedAlloy])
  }

  const clearWorkspace = () => setWorkspace([])

  return (
    <div className={`app-container${theme === "dark" ? " theme-dark" : ""}`}>
      <header className="main-header">
        <div className="header-content">
          <h1 className="app-title">HESMA Advanced Feature Calculator</h1>
          <div className="theme-switch-container">
            <span className="theme-icon">{theme === "dark" ? "🌙" : "☀️"}</span>
            <label className="theme-switch">
              <input type="checkbox" checked={theme === "dark"} onChange={toggleTheme} />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </header>

      <main className="content-wrapper">
        <AdvancedPeriodicTable
          elements={elements}
          selected={selected}
          onSelect={handleSelect}
        />

        {isCalculating && (
          <div className="status-message loading">Crunching thermodynamics in Spring Boot...</div>
        )}
        {apiError && (
          <div className="status-message error">{apiError}</div>
        )}

        {/* ✅ FIXED: Pass backendData as `results` — matches what PropertyPanel destructures */}
        <PropertyPanel
          activeElements={activeElements}
          onChange={handlePercentageChange}
          totalPercentage={totalPercentage}
          isValidComposition={isValidComposition}
          compositionWithWeight={compositionFinal}
          alloyMolarMass={alloyMolarMass}
          results={backendData}
          onSaveToWorkspace={saveToWorkspace}
        />

        {isValidComposition && backendData && (
          <ExportButtons
            activeElements={activeElements}
            density={backendData.theoreticalDensity}
            meltingPoint={backendData.meltingPoint}
            youngModulus={backendData.youngModulus}
          />
        )}

        <ComparisonWorkspace
          workspace={workspace}
          onClear={clearWorkspace}
        />
      </main>
    </div>
  )
}

export default App