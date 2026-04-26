// src/components/engagement/BanniereObjectif.tsx
"use client";
import { useState, useEffect } from "react";
import { getProgressionObjectif, type ProgressionObjectif } from "@/lib/objectif";

export default function BanniereObjectif() {
  const [progression, setProgression] = useState<ProgressionObjectif | null>(null);

  useEffect(() => {
    setProgression(getProgressionObjectif());
  }, []);

  if (!progression) return null;

  const { actuel, cible, atteint, restant } = progression;
  const pourcentage = Math.min(100, Math.round((actuel / cible) * 100));

  const barreColor = atteint
    ? "var(--teal)"
    : pourcentage >= 50
    ? "var(--amber)"
    : "var(--coral)";

  const borderColor = atteint
    ? "rgba(61,214,191,0.2)"
    : pourcentage >= 50
    ? "rgba(245,200,64,0.2)"
    : "rgba(239,110,90,0.2)";

  const labelColor = atteint
    ? "var(--teal)"
    : pourcentage >= 50
    ? "var(--amber)"
    : "var(--coral-l)";

  const message = atteint
    ? "Objectif du jour atteint ! Bravo 🎉"
    : actuel === 0
    ? `Lance ton premier quiz du jour ! (objectif : ${cible} quiz réussi${cible > 1 ? "s" : ""})`
    : `Encore ${restant} quiz pour atteindre ton objectif !`;

  return (
    <div
      data-testid="banniere-objectif"
      style={{
        background: "var(--card)",
        border: `1px solid ${borderColor}`,
        borderRadius: "var(--r-md)",
        padding: "12px 16px",
        marginBottom: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: "var(--f-head)", fontWeight: 700, fontSize: "0.78rem", color: labelColor }}>
          🎯 Objectif du jour
        </span>
        <span style={{ fontFamily: "var(--f-head)", fontWeight: 800, fontSize: "0.78rem", color: "var(--text2)" }}>
          {actuel} / {cible} quiz réussi{cible > 1 ? "s" : ""}
        </span>
      </div>

      {/* Barre de progression */}
      <div style={{
        height: 3,
        background: "rgba(255,255,255,0.07)",
        borderRadius: 2,
        overflow: "hidden",
        marginBottom: 8,
      }}>
        <div style={{
          height: "100%",
          borderRadius: 2,
          width: `${pourcentage}%`,
          background: atteint
            ? "var(--teal)"
            : `linear-gradient(90deg, var(--indigo) 0%, ${barreColor} 100%)`,
          transition: "width .5s ease",
        }} />
      </div>

      <p style={{ fontFamily: "var(--f-body)", fontSize: "0.78rem", color: "var(--text3)" }}>
        {message}
      </p>
    </div>
  );
}
