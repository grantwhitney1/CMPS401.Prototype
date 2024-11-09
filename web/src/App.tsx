import { faPalette } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  ColorPicker,
  Group,
  Paper,
  Stack,
  TextInput,
} from "@mantine/core";
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import { useCallback, useMemo, useState } from "react";
import Plot, { PlotParams } from "react-plotly.js";
import { Function } from "./function";
import { useHeight } from "./hooks/use-height";
import { useWidth } from "./hooks/use-width";
import { getSecondaryColor } from "./utils/color-utils";

const ColorSwatches = [
  "#E4080A",
  "#FE9900",
  "#FFDE59",
  "#7DDA58",
  "#5DB6E9",
  "#CC6CE7",
  "#000000",
];

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
            coefficient: 20,
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
  range: { a: -10, b: 10 },
});

export const App = () => {
  const width = useWidth() * 0.7;
  const height = useHeight();

  const [showColorSwatch, setShowColorSwatch] = useState<boolean>(false);
  const toggleColorSwatch = useCallback(
    () => setShowColorSwatch(!showColorSwatch),
    [showColorSwatch, setShowColorSwatch]
  );

  const [lineColor, setLineColor] = useState<string>(ColorSwatches[0]);

  const iconColor = useMemo(() => getSecondaryColor(lineColor), [lineColor]);

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
        <Stack
          w={(width / 0.7) * 0.3}
          justify="stretch"
          h="100vh"
          gap={0}
          m={0}
        >
          <Paper
            bg="rgba(0, 0, 0, 0.025)"
            shadow="xl"
            withBorder
            mr="1rem"
            h="100%"
            pt="md"
            p="md"
          >
            <TeX math="f(x) = 3sin(2x + 4) + {1 \over 2}e^{-x^2} + 5" />
            <Group justify="left" pt="md" wrap="nowrap">
              <Button
                onClick={toggleColorSwatch}
                bg={lineColor}
                w={32}
                h={32}
                p={0}
              >
                <FontAwesomeIcon icon={faPalette} color={iconColor} />
              </Button>
              <TextInput w="calc(100% - 32px)" />
            </Group>
            {showColorSwatch && (
              <ColorPicker
                swatches={ColorSwatches}
                onChange={setLineColor}
                value={lineColor}
                mt="md"
                w="100%"
              />
            )}
          </Paper>
        </Stack>
        <Plot {...plots[0]} />
      </Group>
    </Stack>
  );
};
