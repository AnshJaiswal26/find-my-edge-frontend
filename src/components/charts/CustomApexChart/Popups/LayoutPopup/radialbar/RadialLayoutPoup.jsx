import { useState } from "react";
import { Popup } from "@layout";
import { useChartStore } from "@stores";
import styles from "../LayoutPopup.module.css";

// --- Sub-sections ---
import GeneralSection from "./sections/GeneralSection";
import DataLabelSection from "./sections/DataLabelsSection";
import TrackSection from "./sections/TrackSection";
import BarSection from "./sections/RadialBarSection";
import LegendSection from "../common sections/LegendSection";

export default function RadialLayoutPopup({ chartId, updateChart }) {
  return (
    <>
      <GeneralSection chartId={chartId} updateChart={updateChart} />
      <TrackSection chartId={chartId} updateChart={updateChart} />
      <BarSection chartId={chartId} updateChart={updateChart} />
      <DataLabelSection chartId={chartId} updateChart={updateChart} />
      <LegendSection chartId={chartId} updateChart={updateChart} />
    </>
  );
}
