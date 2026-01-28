import { useState } from "react";
import { Input, Select } from "@ui";
import { Popup } from "@layout";
import { createChart } from "@charts/apex/model/factory";
import { useDashboardStore } from "@features/dashboard/store";
import { useChartStore } from "@charts/apex/store/useChartStore";
import BarChartForm from "./BarChartForm";

const CHART_TYPES = [
  { id: "bar", label: "Bar Chart" },
  { id: "line", label: "Line Chart" },
  { id: "donut", label: "Donut Chart" },
  { id: "radialBar", label: "Radial Bar" },
  { id: "polarArea", label: "Polar Area" },
  { id: "radar", label: "Radar" },
];

export default function AddChartForm({ options, isAddClicked }) {
  const closePopup = useDashboardStore((s) => s.closePopup);
  const addToDashboard = useDashboardStore((s) => s.order);
  const chartStore = useChartStore.getState();

  const [form, setForm] = useState({
    type: "bar",
    title: "",
    xKey: "",
    yKey: "",
  });

  return (
    <div className="space-y-4">
      <BarChartForm options={options} isAddClicked={isAddClicked} />
    </div>
  );
}
