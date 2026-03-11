import { Download } from "lucide-react";
import { ToolbarButton } from "./ToolbarButton";

export function DownloadButton({ chartId }) {
  const handleDownload = (e) => {
    const chartEl = document.getElementById("apexcharts" + chartId);
    if (!chartEl) return;

    const toolbar = chartEl.querySelector(".apexcharts-toolbar");
    const menuIcon = toolbar?.querySelector(".apexcharts-menu-icon");
    const menu = toolbar?.querySelector(".apexcharts-menu");

    if (!toolbar || !menuIcon || !menu) return;

    const buttonRect = e.currentTarget.getBoundingClientRect();
    const chartRect = chartEl.getBoundingClientRect();

    menuIcon.click();

    const top = buttonRect.top - chartRect.top + 6;

    menu.style.marginRight = "-10px";
    menu.style.top = top - 73 + "px";
  };

  return (
    <ToolbarButton icon={Download} title="Download" onClick={handleDownload} />
  );
}
