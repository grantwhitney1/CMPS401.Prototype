import { Paper, Stack, Tabs, Text } from "@mantine/core";
import { FC } from "react";
import Plot, { PlotParams } from "react-plotly.js";

const TAB_VALUES = ["f(x)", "g(x)", "j(x)", "k(x)"];

const EXAMPLE_PLOT_PARAMS: PlotParams = {
  data: [
    {
      x: [1, 2, 3], // These are what we populate with the OUTPUT from grain .wasm functions
      y: [1, 2, 3], //
      type: "scatter",
      mode: "lines+markers",
      marker: { color: "red" },
    },
  ],
  layout: { width: 1398, height: 600 },
};

export const App = () => {
  // TypeScript code goes here

  // App JSX (basically HTML) UI is returned here
  return (
    <Tabs defaultValue={TAB_VALUES[0]}>
      <Tabs.List>
        {TAB_VALUES.map((item) => (
          <Tabs.Tab value={item} variant="outline">
            <TextThin>{item}</TextThin>
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {TAB_VALUES.map((item) => (
        <Tabs.Panel value={item}>
          <Paper m="32 auto" withBorder shadow="sm" w={1400}>
            <Stack justify='center'>
              <TextThinHeader>Plot for: {item}</TextThinHeader>
              <Plot {...EXAMPLE_PLOT_PARAMS} />
            </Stack>
          </Paper>
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};

type TextProps = {
  children: string[] | string;
};

const TextThinHeader: FC<TextProps> = ({ children }) => (
  <Text ta="center" m="16 0" fz="28" fw="100">
    {children}
  </Text>
);

const TextThin: FC<TextProps> = ({ children }) => (
  <Text ta="center" m="4 16" fz="22" fw="100">
    {children}
  </Text>
);
