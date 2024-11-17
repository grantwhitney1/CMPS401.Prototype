import {
  faEye,
  faEyeSlash,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  ColorPicker,
  Group,
  Paper,
  Stack,
  TextInput,
} from "@mantine/core";
import "katex/dist/katex.min.css";
import { PlotData } from "plotly.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import Plot, { PlotParams } from "react-plotly.js";
import { Function } from "./function";
import { ParseExpression } from "./function-parser";
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

export const App = () => {
  const width = useWidth() * 0.7;
  const height = useHeight();

  const [showColorSwatch, setShowColorSwatch] = useState<boolean>(false);
  const toggleColorSwatch = useCallback(
    () => setShowColorSwatch(!showColorSwatch),
    [showColorSwatch, setShowColorSwatch]
  );

  const [hide, setHide] = useState<boolean>(false);
  const toggleHide = useCallback(() => setHide(!hide), [hide, setHide]);
  const hideIcon = useMemo(() => (hide ? faEyeSlash : faEye), [hide]);
  const hideColor = useMemo(() => (hide ? "grey" : "black"), [hide]);

  const [savedGraphs, setSavedGraphs] = useState<Plotly.Data[]>([]); // Array of saved graphs
  const [currentGraphIndex, setCurrentGraphIndex] = useState<number | null>(null); // Index of the currently selected graph

  const [lineColor, setLineColor] = useState<string>(ColorSwatches[0]);

  const iconColor = useMemo(() => getSecondaryColor(lineColor), [lineColor]);

  const [functionInputString, setFunctionInputString] = useState<
    string | undefined
  >();
  const [customFunction, setCustomFunction] = useState<Function | undefined>();

  // Function to save the current plot
  const savePlot = () => {
    if (plot) {
      setSavedGraphs((prevGraphs) => [...prevGraphs, plot]);
      console.log("Plot added to savedGraphs:", plot);
    }
  };

  const plot: Plotly.Data | undefined = useMemo(
    () =>
      customFunction && {
        ...customFunction.generatePoints(),
        type: "scatter",
        mode: "lines",
        marker: { color: lineColor },
      },
    [customFunction, lineColor]
  );

  const [data, setData] = useState<Partial<PlotData>[]>(plot ? [plot] : []);

  const plotParams = useMemo(() => {
    if (currentGraphIndex !== null && savedGraphs[currentGraphIndex]) {
      return {
        data: [savedGraphs[currentGraphIndex]], // Show the selected saved graph
        layout: { width: width, height: height },
      };
    }
    // If no graph is selected, show the current plot (if exists)
    return {
      data: plot ? [plot] : [],
      layout: { width: width, height: height },
    };
  }, [currentGraphIndex, savedGraphs, plot]);

  useEffect(() => {
    if (!plot) return;
    if (hide) {
      setData(data.filter((x) => x !== plot));
    } else if (!data.includes(plot)) {
      setData([plot]);
    }
  }, [data, setData, hide, plot]);

  useEffect(() => {
    if (functionInputString) {
      const expression = ParseExpression(functionInputString);
      const newFunction = new Function({
        expression: expression[0],
        range: { a: -10, b: 10 },
      });
      setCustomFunction(newFunction);
    }
  }, [functionInputString]);

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
            p="md"
            pt={0}
          >
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
              <Button bg={hideColor} w={32} h={32} p={0} onClick={toggleHide}>
                <FontAwesomeIcon icon={hideIcon} color="white" />
              </Button>
              <TextInput
              
                w="calc(100% - 96px)"
                value={functionInputString}
                onChange={(event) =>
                  setFunctionInputString(event.currentTarget.value)
                }
              />
              <Button
              style={{
                width: 80,
              }}
  onClick={() => {
    if (plot) {
      setSavedGraphs((prevGraphs) => [...prevGraphs, plot]);
      console.log("Plot added to savedGraphs:", plot);
    }
  }}
>
  Save
</Button>

  
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
              <div style ={{
            
          }}>
      {savedGraphs.map((_, index) => (
        <Button style={{
        marginTop: 20,
        marginBottom: 0,
        marginRight: 20,
        marginLeft: 30,
      width: 180,
      backgroundColor: currentGraphIndex === index ? "purple" : "",}}
          key={index}
          onClick={() => {
            // Toggle between showing and hiding the graph
            setCurrentGraphIndex(currentGraphIndex === index ? null : index);
          }} // Set the current graph index to display it
        >
          Show Saved Graph {index + 1}
        </Button>
      ))}
    </div>
            {/* <Text>{debugPrintFunction}</Text> */}
          </Paper>
        </Stack>
        <Plot {...plotParams} />
      </Group>
    
    </Stack>
    
    
  );
}; 