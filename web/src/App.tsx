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
import { FC, useMemo, useState } from "react";
import Plot, { PlotParams } from "react-plotly.js";

const TAB_VALUES = ["f(x)", "g(x)", "j(x)", "k(x)"];

const xValuesTest = Array.from({ length: 800 }, (_, i) => i - 400);

const LABEL_PROPS: InputLabelProps = {
  fw: "100",
};

export const App = () => {
  // TypeScript code goes here
  const [xOffset, setXOffset] = useState<number>(0);
  const [yOffset, setYOffset] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);

  const cubicData = useMemo(() => {
    return xValuesTest.map(
      (x) => Math.pow(x + xOffset, 3) * multiplier + yOffset
    );
  }, [multiplier, xOffset, yOffset]);

  const reciprocalData = useMemo(() => {
    return xValuesTest.map((x) => multiplier * (1 / (x - xOffset)) + yOffset);
  }, [multiplier, xOffset, yOffset]);

  const linearData = useMemo(() =>{
    return xValuesTest.map(x => multiplier *(x-xOffset)+yOffset);

  }, [multiplier, xOffset,yOffset]);

  const lnData = useMemo (() => {
    return xValuesTest.map(x => multiplier * Math.log(x-xOffset)+yOffset);
  }, [multiplier, xOffset,yOffset]);

  const plots: PlotParams[] = useMemo(
    () => [
      {
        data: [
          {
            x: xValuesTest, // These are what we populate with the OUTPUT from grain .wasm functions
            y: linearData, //
            type: "scatter",
            mode: "lines",
            marker: { color: "red" },
          },
        ],
        layout: { width: 1000, height: 600 , screenX: 10},
      },
      {
        data: [
          {
            x: xValuesTest, // These are what we populate with the OUTPUT from grain .wasm functions
            y: cubicData, //
            type: "scatter",
            mode: "lines",
            marker: { color: "red" },
          },
        ],
        layout: { width: 1000, height: 600 , screenX: 10},
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
      {data: [
        {
          x: xValuesTest, // These are what we populate with the OUTPUT from grain .wasm functions
          y: lnData, //
          type: "scatter",
          mode: "lines",
          marker: { color: "red" },
        },
      ],
      layout: { width: 1000, height: 600 , screenX: 10},
    },
    ],
    [cubicData, reciprocalData]
  );

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
