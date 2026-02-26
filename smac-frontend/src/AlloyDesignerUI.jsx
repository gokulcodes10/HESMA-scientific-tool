import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";

const elements = ["Fe", "Ni", "Cr", "Al", "Cu", "Ti", "Co", "Mn"];

export default function AlloyDesignerUI() {
  const [selectedElements, setSelectedElements] = useState([]);
  const [result, setResult] = useState(null);

  const toggleElement = (element) => {
    if (selectedElements.includes(element)) {
      setSelectedElements(selectedElements.filter((e) => e !== element));
    } else {
      setSelectedElements([...selectedElements, element]);
    }
  };

  const handleCalculate = async () => {
    if (selectedElements.length === 0) return;

    try {
      const response = await fetch(
        "http://localhost:8081/api/alloy/calculate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ elements: selectedElements }),
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error calculating alloy:", error);
    }
  };

  const chartData = result
    ? [
        { x: 1, y: result.delta },
        { x: 2, y: result.deltaHmix },
        { x: 3, y: result.deltaSmix },
        { x: 4, y: result.tm },
        { x: 5, y: result.avgRadius },
        { x: 6, y: result.kai },
      ]
    : [];

  return (
  <div
    style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(circle at center, #1b2735 0%, #090a0f 100%)",
      overflow: "hidden",
      color: "white"
    }}
  >
    <h1 style={{ marginBottom: "40px" }}>Alloy Designer</h1>

    <div
      style={{
        position: "relative",
        width: "500px",
        height: "500px"
      }}
    >
      {elements.map((el, index) => {
        const angle = (index / elements.length) * 2 * Math.PI;
        const radius = 180;

        const x = 250 + radius * Math.cos(angle) - 35;
        const y = 250 + radius * Math.sin(angle) - 35;

        const isSelected = selectedElements.includes(el);

        return (
          <motion.div
            key={el}
            onClick={() => toggleElement(el)}
            whileHover={{ scale: 1.2 }}
            animate={{
              boxShadow: isSelected
                ? "0 0 25px #00f2ff"
                : "0 0 8px rgba(255,255,255,0.3)"
            }}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isSelected
                ? "rgba(0,242,255,0.8)"
                : "rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {el}
          </motion.div>
        );
      })}
    </div>

    <button
      onClick={handleCalculate}
      style={{
        marginTop: "40px",
        padding: "10px 30px",
        borderRadius: "8px",
        border: "none",
        background: "#00f2ff",
        color: "black",
        fontWeight: "bold",
        cursor: "pointer",
        zIndex: 10,
        position: "relative"
      }}
    >
      Calculate Alloy
    </button>

    {result && (
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          borderRadius: "15px",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(15px)",
          width: "500px"
        }}
      >
        <p>Δ: {result.delta}</p>
        <p>ΔHmix: {result.deltaHmix}</p>
        <p>ΔSmix: {result.deltaSmix}</p>
        <p>Tm: {result.tm}</p>
        <p>Average Radius: {result.avgRadius}</p>
        <p>Kai: {result.kai}</p>
      </div>
    )}
  </div>
);
}