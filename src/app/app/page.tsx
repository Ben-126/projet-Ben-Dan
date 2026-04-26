"use client";

import { useState } from "react";
import Header from "@/components/navigation/Header";
import MatiereCard from "@/components/navigation/MatiereCard";
import { NIVEAUX, type Niveau } from "@/data/programmes";
import BanniereObjectif from "@/components/engagement/BanniereObjectif";
import { getParametres } from "@/lib/parametres";

export default function HomePage() {
  const [niveauActif, setNiveauActif] = useState<Niveau>(
    () => (typeof window !== "undefined" ? getParametres().niveauDefaut : "seconde")
  );

  const niveauInfo = NIVEAUX.find((n) => n.slug === niveauActif)!;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, maxWidth: 1100, margin: "0 auto", width: "100%", padding: "24px 24px 48px" }}>
        <BanniereObjectif />

        {/* En-tête */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{
            fontFamily: "var(--f-display)",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "var(--text)",
            marginBottom: 10,
          }}>
            Choisis ta <em style={{ fontStyle: "italic", color: "var(--indigo-l)" }}>matière</em>
          </h1>
          <p style={{
            fontFamily: "var(--f-body)",
            fontSize: "0.95rem",
            color: "var(--text2)",
            lineHeight: 1.6,
          }}>
            Révise avec l&apos;IA · Sélectionne ton niveau puis une matière pour commencer
          </p>
        </div>

        {/* Sélecteur de niveau */}
        <div
          role="tablist"
          aria-label="Niveau scolaire"
          style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32, flexWrap: "wrap" }}
        >
          {NIVEAUX.map((niveau) => {
            const actif = niveauActif === niveau.slug;
            return (
              <button
                key={niveau.slug}
                role="tab"
                aria-selected={actif}
                onClick={() => setNiveauActif(niveau.slug)}
                style={{
                  fontFamily: "var(--f-head)",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  padding: "8px 22px",
                  borderRadius: "var(--r-pill)",
                  border: actif ? "none" : "1px solid var(--border2)",
                  cursor: "pointer",
                  transition: "background .15s, color .15s, box-shadow .15s",
                  background: actif
                    ? "linear-gradient(135deg, #4D5EE8 0%, #3A4DD4 100%)"
                    : "transparent",
                  color: actif ? "#fff" : "var(--text2)",
                  boxShadow: actif ? "0 4px 14px rgba(77,94,232,0.3)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!actif) {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!actif) {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text2)";
                  }
                }}
              >
                {niveau.emoji} {niveau.label}
              </button>
            );
          })}
        </div>

        {/* Grille de matières */}
        <div
          data-testid="liste-matieres"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: 12,
          }}
        >
          {niveauInfo.matieres.map((matiere) => (
            <MatiereCard key={matiere.slug} matiere={matiere} niveau={niveauActif} />
          ))}
        </div>

        {/* Footer note */}
        <p style={{
          textAlign: "center",
          fontFamily: "var(--f-body)",
          fontSize: "0.75rem",
          color: "var(--text3)",
          marginTop: 40,
        }}>
          Contenus inspirés des{" "}
          <a
            href="https://www.education.gouv.fr/reussir-au-lycee/les-programmes-du-lycee-general-et-technologique-9812"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--indigo-l)", textDecoration: "underline" }}
          >
            programmes officiels du ministère de l&apos;Éducation nationale
          </a>
        </p>
      </main>
    </div>
  );
}
