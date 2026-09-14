import React from "react";

export function PageSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "40px 20px",
        color: "#94a3b8",
        gap: "16px"
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "3px solid #1e293b",
          borderTopColor: "var(--nyc-yellow, #ffe500)",
          animation: "spin 0.8s linear infinite"
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
        <span
          style={{
            fontFamily: "monospace",
            fontWeight: 800,
            fontSize: "13px",
            letterSpacing: "0.08em",
            color: "var(--nyc-yellow, #ffe500)"
          }}
        >
          LOADING NYC ARENA MODULE...
        </span>
        <span style={{ fontSize: "12px", color: "#64748b" }}>
          Initializing sandboxed runtimes & state
        </span>
      </div>
    </div>
  );
}
