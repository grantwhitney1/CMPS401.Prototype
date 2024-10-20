import {
  Group,
  InputLabel,
  InputLabelProps,
  NumberInput,
  Paper,
  Stack,
  Tabs,
  Text,
} from "@mantine/core";
import { FC } from "react";
import Plot, { PlotParams } from "react-plotly.js";

const TAB_VALUES = ["f(x)", "g(x)", "j(x)", "k(x)"];

/*Functions for 1/x and cubic*/
const calculateCubicValues = (
  xValues: number[],
  xOffset: number,
  yOffset: number,
  multiplier: number
): number[] => {
  return xValues.map((x) => Math.pow(x + xOffset, 3) * multiplier + yOffset);
};

const calculateReciprocalValues = (
  xValues: number[],
  xOffset: number,
  yOffset: number,
  multiplier: number
): number[] => {
  return xValues.map((x) => multiplier * (1 / (x - xOffset)) + yOffset);
};
const xValuesTest = Array.from({ length: 800 }, (_, i) => i - 400);

const xOffset = 0;
const yValuesTestReciprocal = calculateReciprocalValues(
  xValuesTest,
  xOffset,
  0,
  1
);

const yValuesTestCubic = calculateCubicValues(xValuesTest, xOffset, 0, 1);

const PLOTS: PlotParams[] = [
  {
    data: [
      {
        x: xValuesTest, // These are what we populate with the OUTPUT from grain .wasm functions
        y: yValuesTestReciprocal, //
        type: "scatter",
        mode: "lines",
        marker: { color: "red" },
      },
    ],
    layout: { width: 1000, height: 600 },
  },
  {
    data: [
      {
        x: xValuesTest, // These are what we populate with the OUTPUT from grain .wasm functions
        y: yValuesTestCubic, //
        type: "scatter",
        mode: "lines",
        marker: { color: "blue" },
      },
    ],
    layout: { width: 1000, height: 600 },
  },
];

const LABEL_PROPS: InputLabelProps = {
  fw: "100",
};

export const App = () => {
  // TypeScript code goes here
  // Calculate y values
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
      {TAB_VALUES.map((item, index) => (
        <Tabs.Panel value={item}>
          <Paper m="32 auto" withBorder shadow="sm" w={1400}>
            <Stack>
              <TextThinHeader>Plot for: {item}</TextThinHeader>
              <Group w="100%" gap={0}>
                <Stack justify="flex-start" w={350} h={500} p="xl">
                  <NumberInput labelProps={LABEL_PROPS} label="X-Offset" />
                  <NumberInput labelProps={LABEL_PROPS} label="Y-Offset" />
                  <NumberInput labelProps={LABEL_PROPS} label="Multiplier" />
                  <InputLabel />
                </Stack>
                <Plot {...PLOTS[index]} />
              </Group>
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
