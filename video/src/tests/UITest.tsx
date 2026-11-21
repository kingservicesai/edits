import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { LightBG } from "../components/base";
import { PageVenta } from "../ui/PageVenta";
import { PageValidador } from "../ui/PageValidador";
import { PageComisiones, Invoice } from "../ui/PageComisiones";
import { PageRecepcion, PageTransfer, PageInventario } from "../ui/PagesGerente";
import { PageDashboard, PageReportes, Assistant } from "../ui/PagesDueno";

const pages = [
  () => <PageVenta ev={{ client: 0, type1: 0, row1: 0, type2: 0, row2: 0, highlightVendor: 0, highlightSuc: 0, stock: 0, qty: 0, totals: 0, confirm: 999 }} />,
  () => <PageValidador ev={{ order: 0, date: 0, bank: 0, amount: 0, press: 0, verifying: 0, success: 0, newRow: 0 }} />,
  () => <PageComisiones chartAt={0} newSale={0} />,
  () => <PageRecepcion ev={{ oc: 0, qty: 0, diff: 0, exception: 0, loc: 0, confirm: 0, done: 999, inv: 999 }} />,
  () => <PageTransfer ev={{ origin: 0, dest: 0, product: 0, qty: 0, validate: 0, hlOrigin: 999, hlDest: 999, press: 999, record: 0, moves: 0 }} />,
  () => <PageInventario at={0} update={0} moves={0} />,
  () => <PageDashboard at={0} mic={{ press: 0, listening: [0, 999] }}><Assistant ev={{ open: 0, q1: 0, q1End: 10, a1: 20, a1End: 40, q2: 40, q2End: 50, a2: 60, voiceQ1: "audio/vo/D_JOSE2.flac", voiceA1: "audio/vo/D_ASIST.flac", voiceQ2: "audio/vo/D_JOSE3.flac" }} /></PageDashboard>,
  () => <PageReportes tab="ventas" at={0} hl={0} />,
  () => <PageReportes tab="comisiones" at={0} />,
  () => <PageReportes tab="cxp" at={0} />,
  () => <PageReportes tab="inventario" at={0} />,
  () => <div style={{ padding: 100, background: "#eee", width: 1720, height: 1040 }}><Invoice /></div>,
];
export const UITest: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.floor(f / 100);
  const P = pages[Math.min(idx, pages.length - 1)];
  return (
    <AbsoluteFill>
      <LightBG />
      <div style={{ position: "absolute", left: 100, top: 20, transform: "scale(1)", transformOrigin: "0 0" }}>
        <div style={{ width: 1720, height: 1040, overflow: "hidden" }}><P /></div>
      </div>
    </AbsoluteFill>
  );
};
