export const getRadialBarChartConfig = (
  data,
  totalTrades,
  activeIndex,
  setActiveIndex
) => {
  const options = {
    chart: {
      type: "radialBar",
      events: {
        dataPointMouseEnter: (event, chartContext, config) => {
          const index = config.dataPointIndex;
          setActiveIndex(index);
        },
        dataPointMouseLeave: () => {
          setActiveIndex(null);
        },
      },
    },
    legend: {
      show: false,
      position: "bottom",
      labels: {
        colors: "#ffffff",
      },
      onItemClick: {
        toggleDataSeries: false,
      },
    },
    stroke: {
      lineCap: "round",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.7,
        gradientToColors: data.map((item) => shadeColor(item.color, 20)),
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 70, 50, 0],
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 0.3,
        },
      },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "45%",
        },
        track: {
          show: true,
          strokeWidth: "50%",
          background: "inherit",
        },
        dataLabels: {
          style: {
            fontSize: "14px",
            fontWeight: "bold",
          },
          name: {
            show: true,
            fontSize: "16px",
            fontWeight: 600,
          },
          value: {
            show: true,
            fontSize: "16px",
            fontWeight: "bold",

            formatter: (val) =>
              `${Math.round(val * totalTrades * 0.01)} trades`,
          },
          total: {
            show: true,
            label: activeIndex ? data[activeIndex].name : "Total",
            fontSize: "16px",
            fontWeight: 700,
            formatter: () =>
              activeIndex
                ? `${data[activeIndex].value} Trades`
                : `${data.reduce((acc, item) => acc + item.value, 0)} Trades`,
          },
        },
      },
    },

    labels: data.map((item) => item.name),
    colors: data.map((item) => item.color),
  };

  return options;
};
