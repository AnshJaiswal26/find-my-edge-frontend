import React, { useState, useEffect, useRef } from "react";
import { Settings, X } from "lucide-react";

export const ChartLayoutCustomizer = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [chartConfig, setChartConfig] = useState({
    // Chart dimensions
    height: 350,
    width: "100%",

    // Colors
    primaryColor: "#008FFB",
    secondaryColor: "#00E396",
    backgroundColor: "#ffffff",
    foreColor: "#373d3f",

    // Grid
    showGrid: true,
    gridColor: "#e0e0e0",
    gridOpacity: 0.3,

    // Toolbar
    showToolbar: true,
    toolbarPosition: "top",

    // Legend
    showLegend: true,
    legendPosition: "bottom",
    legendAlign: "center",

    // Data labels
    showDataLabels: false,

    // Stroke
    strokeWidth: 2,
    strokeCurve: "smooth",

    // Animations
    enableAnimations: true,
    animationSpeed: 800,

    // Spacing
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 10,
  });

  const sampleData = {
    series: [
      {
        name: "Sales",
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
      {
        name: "Revenue",
        data: [20, 30, 35, 40, 45, 55, 60, 75],
      },
    ],
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
  };

  const getChartOptions = () => ({
    chart: {
      type: "line",
      height: chartConfig.height,
      width: chartConfig.width,
      toolbar: {
        show: chartConfig.showToolbar,
        offsetY: chartConfig.toolbarPosition === "top" ? 0 : -30,
      },
      animations: {
        enabled: chartConfig.enableAnimations,
        speed: chartConfig.animationSpeed,
      },
      background: chartConfig.backgroundColor,
      foreColor: chartConfig.foreColor,
    },
    colors: [chartConfig.primaryColor, chartConfig.secondaryColor],
    stroke: {
      width: chartConfig.strokeWidth,
      curve: chartConfig.strokeCurve,
    },
    dataLabels: {
      enabled: chartConfig.showDataLabels,
    },
    grid: {
      show: chartConfig.showGrid,
      borderColor: chartConfig.gridColor,
      strokeDashArray: 3,
      opacity: chartConfig.gridOpacity,
      padding: {
        top: chartConfig.paddingTop,
        right: chartConfig.paddingRight,
        bottom: chartConfig.paddingBottom,
        left: chartConfig.paddingLeft,
      },
    },
    legend: {
      show: chartConfig.showLegend,
      position: chartConfig.legendPosition,
      horizontalAlign: chartConfig.legendAlign,
    },
    xaxis: {
      categories: sampleData.categories,
    },
    yaxis: {
      title: {
        text: "Values",
      },
    },
    series: sampleData.series,
  });

  useEffect(() => {
    // Load ApexCharts script
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/apexcharts";
    script.async = true;
    script.onload = () => {
      initChart();
    };
    document.body.appendChild(script);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (window.ApexCharts && chartRef.current) {
      updateChart();
    }
  }, [chartConfig]);

  const initChart = () => {
    if (chartRef.current && window.ApexCharts) {
      const options = getChartOptions();
      chartInstance.current = new window.ApexCharts(chartRef.current, options);
      chartInstance.current.render();
    }
  };

  const updateChart = () => {
    if (chartInstance.current) {
      const options = getChartOptions();
      chartInstance.current.updateOptions(options);
    }
  };

  const updateConfig = (key, value) => {
    setChartConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              ApexCharts Dashboard
            </h1>
            <button
              onClick={() => setIsPopupOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Settings size={20} />
              Customize Layout
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div ref={chartRef} style={{ width: "100%" }}></div>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                Chart Layout Settings
              </h2>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dimensions Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                    Dimensions
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height: {chartConfig.height}px
                    </label>
                    <input
                      type="range"
                      min="200"
                      max="600"
                      value={chartConfig.height}
                      onChange={(e) =>
                        updateConfig("height", parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Colors Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                    Colors
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      value={chartConfig.primaryColor}
                      onChange={(e) =>
                        updateConfig("primaryColor", e.target.value)
                      }
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Color
                    </label>
                    <input
                      type="color"
                      value={chartConfig.secondaryColor}
                      onChange={(e) =>
                        updateConfig("secondaryColor", e.target.value)
                      }
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={chartConfig.backgroundColor}
                      onChange={(e) =>
                        updateConfig("backgroundColor", e.target.value)
                      }
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={chartConfig.foreColor}
                      onChange={(e) =>
                        updateConfig("foreColor", e.target.value)
                      }
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                </div>

                {/* Grid Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                    Grid
                  </h3>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={chartConfig.showGrid}
                      onChange={(e) =>
                        updateConfig("showGrid", e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Show Grid
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grid Color
                    </label>
                    <input
                      type="color"
                      value={chartConfig.gridColor}
                      onChange={(e) =>
                        updateConfig("gridColor", e.target.value)
                      }
                      className="w-full h-10 rounded cursor-pointer"
                      disabled={!chartConfig.showGrid}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grid Opacity: {chartConfig.gridOpacity}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={chartConfig.gridOpacity}
                      onChange={(e) =>
                        updateConfig("gridOpacity", parseFloat(e.target.value))
                      }
                      className="w-full"
                      disabled={!chartConfig.showGrid}
                    />
                  </div>
                </div>

                {/* Toolbar Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                    Toolbar
                  </h3>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={chartConfig.showToolbar}
                      onChange={(e) =>
                        updateConfig("showToolbar", e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Show Toolbar
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Toolbar Position
                    </label>
                    <select
                      value={chartConfig.toolbarPosition}
                      onChange={(e) =>
                        updateConfig("toolbarPosition", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      disabled={!chartConfig.showToolbar}
                    >
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </div>
                </div>

                {/* Legend Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                    Legend
                  </h3>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={chartConfig.showLegend}
                      onChange={(e) =>
                        updateConfig("showLegend", e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Show Legend
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Legend Position
                    </label>
                    <select
                      value={chartConfig.legendPosition}
                      onChange={(e) =>
                        updateConfig("legendPosition", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      disabled={!chartConfig.showLegend}
                    >
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Legend Alignment
                    </label>
                    <select
                      value={chartConfig.legendAlign}
                      onChange={(e) =>
                        updateConfig("legendAlign", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      disabled={!chartConfig.showLegend}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>

                {/* Stroke Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                    Stroke
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stroke Width: {chartConfig.strokeWidth}px
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={chartConfig.strokeWidth}
                      onChange={(e) =>
                        updateConfig("strokeWidth", parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stroke Curve
                    </label>
                    <select
                      value={chartConfig.strokeCurve}
                      onChange={(e) =>
                        updateConfig("strokeCurve", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="smooth">Smooth</option>
                      <option value="straight">Straight</option>
                      <option value="stepline">Stepline</option>
                    </select>
                  </div>
                </div>

                {/* Data Labels Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                    Data Labels
                  </h3>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={chartConfig.showDataLabels}
                      onChange={(e) =>
                        updateConfig("showDataLabels", e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Show Data Labels
                    </label>
                  </div>
                </div>

                {/* Animations Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                    Animations
                  </h3>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={chartConfig.enableAnimations}
                      onChange={(e) =>
                        updateConfig("enableAnimations", e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Enable Animations
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Animation Speed: {chartConfig.animationSpeed}ms
                    </label>
                    <input
                      type="range"
                      min="200"
                      max="2000"
                      step="100"
                      value={chartConfig.animationSpeed}
                      onChange={(e) =>
                        updateConfig("animationSpeed", parseInt(e.target.value))
                      }
                      className="w-full"
                      disabled={!chartConfig.enableAnimations}
                    />
                  </div>
                </div>

                {/* Padding Section */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                    Padding
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Top: {chartConfig.paddingTop}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={chartConfig.paddingTop}
                        onChange={(e) =>
                          updateConfig("paddingTop", parseInt(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Right: {chartConfig.paddingRight}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={chartConfig.paddingRight}
                        onChange={(e) =>
                          updateConfig("paddingRight", parseInt(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bottom: {chartConfig.paddingBottom}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={chartConfig.paddingBottom}
                        onChange={(e) =>
                          updateConfig(
                            "paddingBottom",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Left: {chartConfig.paddingLeft}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={chartConfig.paddingLeft}
                        onChange={(e) =>
                          updateConfig("paddingLeft", parseInt(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsPopupOpen(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsPopupOpen(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartLayoutCustomizer;
