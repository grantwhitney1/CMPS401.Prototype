import {
  ColorPicker,
  Group,
  InputLabel,
  InputLabelProps,
  NumberInput,
  Paper,
  Stack,
  Tabs,
  Text,
} from "@mantine/core";
import { FC, useEffect, useMemo, useState } from "react";
import Plot, { PlotParams } from "react-plotly.js";
import { Function } from "./types";

const TAB_VALUES = ["f(x)", "g(x)", "j(x)", "k(x)"];

const xValuesTest = Array.from({ length: 800 }, (_, i) => i - 400);

const LABEL_PROPS: InputLabelProps = {
  fw: "100",
};

// EXAMPLE for f(x) = 3*sin(2x+4) + (1/2)(e^(-x^2)) + 5
const TestF = new Function({
  value: {
    coefficient: 1,
    exponent: 1,
    terms: {
      a: {
        exponent: 1,
        coefficient: 3,
        terms: {
          a: {
            exponent: 1,
            coefficient: 1,
            terms: {
              a: {
                exponent: 1,
                coefficient: 2,
              },
              b: 4,
            },
            functionOperation: Math.sin,
          },
        },
      },
      b: {
        exponent: 1,
        coefficient: 1,
        terms: {
          a: {
            exponent: 1,
            coefficient: 1 / 2,
            terms: {
              a: {
                exponent: 2,
                coefficient: -1,
                functionOperation: Math.exp,
              },
            },
          },
          b: 5,
        },
      },
    },
  },
  range: { a: 0, b: 4 },
});

export const App = () => {
  // TypeScript code goes here
  const [xOffset, setXOffset] = useState<number>(0);
  const [yOffset, setYOffset] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);
const [ lineColor, setLineColor] = useState<string>('red');

  const cubicData = useMemo(() => {
    return xValuesTest.map(
      (x) => Math.pow(x + xOffset, 3) * multiplier + yOffset
    );
  }, [multiplier, xOffset, yOffset]);

  const reciprocalData = useMemo(() => {
    return xValuesTest.map((x) => multiplier * (1 / (x - xOffset)) + yOffset);
  }, [multiplier, xOffset, yOffset]);

  const linearData = useMemo(() => {
    return xValuesTest.map((x) => multiplier * (x - xOffset) + yOffset);
  }, [multiplier, xOffset, yOffset]);

  const lnData = useMemo(() => {
    return xValuesTest.map((x) => multiplier * Math.log(x - xOffset) + yOffset);
  }, [multiplier, xOffset, yOffset]);

  const plots: PlotParams[] = useMemo(
    () => [
      {
        data: [
          {
            x: xValuesTest,
            y: linearData,
            type: "scatter",
            mode: "lines",
            marker: { color: lineColor },
          },
        ],
        layout: { width: 1000, height: 600, screenX: 10 },
      },
      {
        data: [
          {
            x: xValuesTest,
            y: cubicData,
            type: "scatter",
            mode: "lines",
            marker: { color: lineColor },
          },
        ],
        layout: { width: 1000, height: 600, screenX: 10 },
      },
      {
        data: [
          {
            x: xValuesTest,
            y: reciprocalData,
            type: "scatter",
            mode: "lines",
            marker: { color: "blue" },
          },
        ],
        layout: { width: 1000, height: 600 },
      },
      {
        data: [
          {
            x: xValuesTest,
            y: lnData,
            type: "scatter",
            mode: "lines",
            marker: { color: lineColor },
          },
        ],
        layout: { width: 1000, height: 600, screenX: 10 },
      },
    ],
    [cubicData, linearData, lnData, reciprocalData, lineColor]
  );

  useEffect(() => {
    // EVALUATE EXAMPLE f(x) = 3*sin(2x+4) + (1/2)(e^(-x^2)) + 5
    // AT x=1
    alert(`${TestF.evaluate(1)}`);
  }, []);

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
                  <NumberInput
                    labelProps={LABEL_PROPS}
                    defaultValue={0}
                    onChange={(value) => setXOffset(Number(value))}
                    label="X-Offset"
                  />
                  <NumberInput
                    labelProps={LABEL_PROPS}
                    defaultValue={0}
                    onChange={(value) => setYOffset(Number(value))}
                    label="Y-Offset"
                  />
                  <NumberInput
                    labelProps={LABEL_PROPS}
                    defaultValue={1}
                    onChange={(value) => setMultiplier(Number(value))}
                    label="Multiplier"
                  />
                  <InputLabel />
                  <ColorPicker
                    value={lineColor}
                    onChange={setLineColor}
                    swatches={[
                      'red', 'green', 'blue', 'yellow',
                      'orange', 'purple', 'pink', 'black', 'white'
                    ]}
                    style={{ marginTop: '10px' }}
                  />
                </Stack>
                <Plot {...plots[index]} />
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
