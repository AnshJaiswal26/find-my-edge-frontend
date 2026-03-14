import { chartApi } from "@features/dashboard/api/chart.api";

/* -------- VALIDATION -------- */

const validateChartRequest = (chart) => {
  if (!chart?.chartType) {
    throw new Error("Chart type is required");
  }

  if (!chart?.seriesById || !Object.keys(chart.seriesById).length) {
    throw new Error("Chart must contain at least one series");
  }
};

/* ---------------- SERVICE ---------------- */

export const chartService = {
  /* -------- CREATE -------- */
  async create(page, chart) {
    validateChartRequest(chart);

    return chartApi.create(page, chart);
  },

  /* -------- GET ALL -------- */
  async getAll(page) {
    const res = await chartApi.getAll(page);
    return res || {};
  },

  /* -------- GET BY ID -------- */
  async getById(page, chartId) {
    if (!chartId) throw new Error("Chart id is required");

    return chartApi.getById(page, chartId);
  },

  /* -------- UPDATE -------- */
  async update(page, chartId, updates) {
    if (!chartId) throw new Error("Chart id is required");

    return chartApi.update(page, chartId, updates);
  },

  /* -------- DELETE -------- */
  async delete(page, chartId) {
    if (!chartId) throw new Error("Chart id is required");

    return chartApi.delete(page, chartId);
  },

  /* -------- UPDATE LAYOUT -------- */
  async updateLayout(page, chartId, layout) {
    if (!chartId) throw new Error("Chart id is required");

    return chartApi.updateLayout(page, chartId, layout);
  },

  /* -------- UPDATE SERIES -------- */
  async updateSeries(page, chartId, series) {
    if (!chartId) throw new Error("Chart id is required");

    return chartApi.updateSeries(page, chartId, series);
  },
};
