export const getPieChartConfig = (
  activeIndex,
  setActiveIndex,
  data,
  totalTrades,
  labels,
  colors
) => {
  const options = {
    chart: {
      type: "pie",
      events: {
        dataPointMouseEnter: (event, chartContext, config) => {
          setActiveIndex(config.dataPointIndex);
        },
        dataPointMouseLeave: () => {
          setActiveIndex(null);
        },
      },
    },
    labels,
    colors,
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 0.05,
        },
      },
    },
    stroke: {
      show: true,
      width: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
            },
            value: {
              show: true,
              fontSize: "18px",
              fontWeight: "bold",
              formatter: (val) => `${Math.round(val)} Trades`,
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "15px",
              fontWeight: 700,
              formatter: () =>
                activeIndex !== null
                  ? `${data[activeIndex].value} Trades`
                  : `${totalTrades} Trades`,
              style: {
                fontSize: "18px",
                fontWeight: "bold",
                color: "#000",
              },
            },
          },
        },
      },
    },
  };

  return options;
};
