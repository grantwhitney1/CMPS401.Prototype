import Plot, { PlotParams } from "react-plotly.js";

const EXAMPLE_PLOT_PARAMS: PlotParams = {
  data: [
    {
      x: [1, 2, 3],
      y: [1, 2, 3],
      type: "bar",
      mode: "lines+markers",
      marker: { color: "red" },
    },
  ],
  layout: {},
};

export const App = () => {
  // TypeScript code goes here

  // App JSX (basically HTML) UI is returned here
  return (
    <div>
      <h1>CMPS 401 Prototype</h1>
      <Plot {...EXAMPLE_PLOT_PARAMS} />
    </div>
  );
};
