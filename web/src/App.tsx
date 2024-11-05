import { ColorPicker, Group, Paper, Stack, Text } from "@mantine/core";
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import { useMemo, useState } from "react";
import Plot, { PlotParams } from "react-plotly.js";
import { useHeight } from "./hooks/use-height";
import { useWidth } from "./hooks/use-width";
import { Function } from "./types";

// EXAMPLE for f(x) = 3*sin(2x+4) + (1/2)(e^(-x^2)) + 5
const TestF = new Function({
  expression: {
    coefficient: 1,
    exponent: 1,
    terms: [
      {
        exponent: 1,
        coefficient: 3,
        terms: [
          {
            exponent: 1,
            coefficient: 1,
            terms: [
              {
                exponent: 1,
                coefficient: 2,
              },
              4,
            ],
            functionOperation: Math.sin,
          },
        ],
      },
      {
        exponent: 1,
        coefficient: 1,
        terms: [
          {
            exponent: 1,
            coefficient: 1 / 2,
            terms: [
              {
                exponent: 2,
                coefficient: -1,
                functionOperation: Math.exp,
              },
            ],
          },
          5,
        ],
      },
    ],
  },
  range: { a: -400, b: 400 },
});

export const App = () => {
  const width = useWidth() * 0.75;
  const height = useHeight();

  const [lineColor, setLineColor] = useState<string>("red");

  const plots: PlotParams[] = useMemo(
    () => [
      {
        data: [
          {
            ...TestF.generatePoints(),
            type: "scatter",
            mode: "lines",
            marker: { color: lineColor },
          },
        ],
        layout: { width: width, height: height },
      },
    ],
    [height, lineColor, width]
  );

  return (
    <Stack>
      <Group p={0} m={0} w="100%" gap={0} wrap="nowrap" justify="stretch">
        <Stack m={0} gap={0} h="100vh" w="25%" justify="stretch">
          <Paper
            withBorder
            h="100%"
            shadow="xl"
            mr="1rem"
            bg="rgba(0, 0, 0, 0.025)"
          >
            <Text m="1rem auto" ta="center">
              Plot for: &nbsp;
              <TeX math="f(x) = 3sin(2x + 4) + {1 \over 2}e^{-x^2} + 5" />
            </Text>
            <ColorPicker
              value={lineColor}
              m="auto"
              onChange={setLineColor}
              swatches={[
                "red",
                "green",
                "blue",
                "yellow",
                "orange",
                "purple",
                "pink",
                "black",
              ]}
              style={{ marginTop: "10px" }}
            />
          </Paper>
        </Stack>
        <Plot {...plots[0]} />
      </Group>
    </Stack>
  );
};
