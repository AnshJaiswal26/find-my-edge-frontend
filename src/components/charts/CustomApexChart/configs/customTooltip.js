export const customTooltip = (callback) => {
  return ({ series, dataPointIndex, seriesIndex, w }) => {
    const seriesValues = series.map((s) => s[dataPointIndex]);

    const tooltipData = callback(seriesValues, dataPointIndex, seriesIndex, w);

    const htmlStringArray = tooltipData?.dataArray?.map(
      ({ label = "", value = "", color = "", indicator = true }) =>
        `<div class="tooltip-content-row">
           ${
             indicator
               ? ` <span class="tooltip-indicator" style="background:${color}"></span>`
               : ""
           }
            <span class="tooltip-text">${label}
              <strong style="color:${color}">${value}</strong>
            </span>
          </div>`
    );

    return `
      <div class="custom-grouped-bar-chart-tooltip">
        ${
          tooltipData?.title
            ? `<div class="tooltip-title">${tooltipData.title}</div>`
            : ""
        }
        <div style="padding:5px 0px;">
         ${htmlStringArray?.join("")}
        </div>
      </div>`;
  };
};
