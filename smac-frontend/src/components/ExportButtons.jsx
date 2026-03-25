import jsPDF from "jspdf"
import * as XLSX from "xlsx"

export default function ExportButtons({
  activeElements,
  density,
  meltingPoint,
  youngModulus
}) {
  
  // ==========================================
  // 1. PDF EXPORT LOGIC
  // ==========================================
  const exportPDF = () => {
    const doc = new jsPDF()
    
    doc.setFontSize(18)
    doc.text("HESMA Alloy Scientific Report", 20, 20)

    doc.setFontSize(12)
    let y = 35
    doc.setFont("helvetica", "bold")
    doc.text("Stoichiometric Composition:", 20, y)
    doc.setFont("helvetica", "normal")
    y += 10

    activeElements.forEach((el) => {
      doc.text(
        `- ${el.name} (${el.symbol}): ${Number(el.percentage).toFixed(2)}%`,
        25,
        y
      )
      y += 10
    })

    y += 10
    doc.setFont("helvetica", "bold")
    doc.text("Predicted Macro-Properties:", 20, y)
    doc.setFont("helvetica", "normal")
    y += 10

    doc.text(`Theoretical Density: ${density ? density.toFixed(3) : "—"} g/cm³`, 25, y)
    doc.text(`Melting Temperature: ${meltingPoint ? meltingPoint.toFixed(3) : "—"} K`, 25, y + 10)
    doc.text(`Young's Modulus: ${youngModulus ? youngModulus.toFixed(3) : "—"} GPa`, 25, y + 20)

    doc.save("HESMA_Scientific_Report.pdf")
  }

  // ==========================================
  // 2. EXCEL EXPORT LOGIC
  // ==========================================
  const exportExcel = () => {
    // 1. Format the composition data for rows
    const compositionData = activeElements.map(el => ({
      "Element": el.name,
      "Symbol": el.symbol,
      "Atomic %": Number(el.percentage).toFixed(2)
    }));

    // 2. Format the properties data for rows
    const propertiesData = [
      { Property: "Theoretical Density", Value: density ? density.toFixed(3) : "—", Unit: "g/cm³" },
      { Property: "Melting Temperature", Value: meltingPoint ? meltingPoint.toFixed(3) : "—", Unit: "K" },
      { Property: "Young's Modulus", Value: youngModulus ? youngModulus.toFixed(3) : "—", Unit: "GPa" }
    ];

    // 3. Create worksheets
    const wsComposition = XLSX.utils.json_to_sheet(compositionData);
    const wsProperties = XLSX.utils.json_to_sheet(propertiesData);

    // 4. Create a new workbook and append the sheets
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsComposition, "Composition");
    XLSX.utils.book_append_sheet(wb, wsProperties, "Properties");

    // 5. Trigger the download
    XLSX.writeFile(wb, "HESMA_Data_Export.xlsx");
  }

  if (activeElements.length === 0) return null

  return (
    <div className="export-buttons" style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
      
      
     

    </div>
  )
}