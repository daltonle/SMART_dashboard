// *
// * Colors
// *
const primaryColor = "#068FAB"
const red = "#FF595E"
const green = "#02A27F"
const yellow = "#FFCA3A"
const orange = "#E66337"
const purple = "#5E50B5"
const maroon = "#692D39"
const colors = [green, red, yellow, orange, purple, primaryColor, maroon];
const grey900 = "#212121";
const dividerColor = "#C1C1C2"
const labelColor = "#565659"
// *
// * Typography
// *
const sansSerif = "'Open Sans', 'Helvetica Neue', Helvetica, sans-serif";
const letterSpacing = "normal";
const fontSize = 12;
// *
// * Layout
// *
const padding = 8;
const baseProps = {
  width: 350,
  height: 350,
  padding: 50
};
// *
// * Labels
// *
const baseLabelStyles = {
  fontFamily: sansSerif,
  fontSize,
  letterSpacing,
  padding,
  fill: labelColor,
  stroke: "transparent",
  strokeWidth: 0
};

const centeredLabelStyles = Object.assign({ textAnchor: "middle" }, baseLabelStyles);
// *
// * Strokes
// *
const strokeWidth = ".5"
const strokeDasharray = "1, 0"
const strokeLinecap = "round"
const strokeLinejoin = "round"

export const MyVictoryTheme = {
  area: Object.assign(
    {
      style: {
        data: {
          fill: grey900
        },
        labels: centeredLabelStyles
      }
    },
    baseProps
  ),
  axis: Object.assign(
    {
      style: {
        axis: {
          fill: "transparent",
          stroke: dividerColor,
          strokeWidth: 2,
          strokeLinecap,
          strokeLinejoin
        },
        axisLabel: Object.assign({}, centeredLabelStyles, {
          padding,
          stroke: "transparent"
        }),
        grid: {
          fill: "none",
          stroke: dividerColor,
          strokeWidth,
          strokeDasharray,
          strokeLinecap,
          strokeLinejoin,
          pointerEvents: "painted"
        },
        ticks: {
          fill: "transparent",
          size: 5,
          stroke: dividerColor,
          strokeWidth: 1,
          strokeLinecap,
          strokeLinejoin
        },
        tickLabels: Object.assign({}, baseLabelStyles, {
          fill: labelColor
        })
      }
    },
    baseProps
  ),
  bar: Object.assign(
    {
      style: {
        data: {
          fill: green,
          padding,
          strokeWidth: 0
        },
        labels: baseLabelStyles
      }
    },
    baseProps
  ),
  boxplot: Object.assign(
    {
      style: {
        max: { padding, stroke: primaryColor, strokeWidth: 1 },
        maxLabels: baseLabelStyles,
        median: { padding, stroke: primaryColor, strokeWidth: 1 },
        medianLabels: baseLabelStyles,
        min: { padding, stroke: primaryColor, strokeWidth: 1 },
        minLabels: baseLabelStyles,
        q1: { padding, fill: primaryColor },
        q1Labels: baseLabelStyles,
        q3: { padding, fill: primaryColor },
        q3Labels: baseLabelStyles
      },
      boxWidth: 20
    },
    baseProps
  ),
  candlestick: Object.assign(
    {
      style: {
        data: {
          stroke: primaryColor
        },
        labels: centeredLabelStyles
      },
      candleColors: {
        positive: "#ffffff",
        negative: primaryColor
      }
    },
    baseProps
  ),
  chart: baseProps,
  errorbar: Object.assign(
    {
      borderWidth: 8,
      style: {
        data: {
          fill: "transparent",
          opacity: 1,
          stroke: primaryColor,
          strokeWidth: 2
        },
        labels: centeredLabelStyles
      }
    },
    baseProps
  ),
  group: Object.assign(
    {
      colorScale: colors
    },
    baseProps
  ),
  legend: {
    colorScale: colors,
    gutter: 24,
    orientation: "horizontal",
    titleOrientation: "top",
    style: {
      data: {
        type: "circle"
      },
      labels: {
        ...baseLabelStyles,
        fontSize: 14
      },
      title: Object.assign({}, baseLabelStyles, { padding: 5 })
    }
  },
  line: Object.assign(
    {
      style: {
        data: {
          fill: "transparent",
          opacity: 1,
          stroke: primaryColor,
          strokeWidth: 2
        },
        labels: centeredLabelStyles
      }
    },
    baseProps
  ),
  pie: Object.assign(
    {
      colorScale: colors,
      style: {
        data: {
          padding,
          stroke: dividerColor,
          strokeWidth: 1
        },
        labels: Object.assign({}, baseLabelStyles, { padding: 20 })
      }
    },
    baseProps
  ),
  scatter: Object.assign(
    {
      style: {
        data: {
          fill: primaryColor,
          opacity: 1,
          stroke: "transparent",
          strokeWidth: 0
        },
        labels: centeredLabelStyles
      }
    },
    baseProps
  ),
  stack: Object.assign(
    {
      colorScale: colors
    },
    baseProps
  ),
  tooltip: {
    style: Object.assign({}, centeredLabelStyles, { padding: 5, pointerEvents: "none" }),
    flyoutStyle: {
      stroke: grey900,
      strokeWidth: 1,
      fill: "#f0f0f0",
      pointerEvents: "none"
    },
    cornerRadius: 5,
    pointerLength: 10
  },
  voronoi: Object.assign(
    {
      style: {
        data: {
          fill: "transparent",
          stroke: "transparent",
          strokeWidth: 0
        },
        labels: Object.assign({}, centeredLabelStyles, { padding: 5, pointerEvents: "none" }),
        flyout: {
          stroke: grey900,
          strokeWidth: 1,
          fill: "#f0f0f0",
          pointerEvents: "none"
        }
      }
    },
    baseProps
  )
};