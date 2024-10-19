import { Tabs } from "@mantine/core";
import Plot, { PlotParams } from "react-plotly.js";

const TAB_VALUES = ["f(x)", "g(x)", "j(x)", "k(x)"];

const EXAMPLE_PLOT_PARAMS: PlotParams = {
  data: [
    {
      x: [1, 2, 3], // These are what we populate with the OUTPUT from grain .wasm functions
      y: [1, 2, 3], //
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
    <Tabs defaultValue={TAB_VALUES[0]}>
      <Tabs.List>
        {TAB_VALUES.map((item) => (
          <Tabs.Tab value={item} variant="outline">
            {item}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {TAB_VALUES.map((item) => (
        <Tabs.Panel value={item}>
          <h1>Plot for: {item}</h1>
          <Plot {...EXAMPLE_PLOT_PARAMS} />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};
