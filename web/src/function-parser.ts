import { Expression, Term } from "./function";

type TokenType =
  | "Number"
  | "XTerm"
  | "ExponentiatedConstant"
  | "Expression"
  | "Operator"
  | "LeftParenthesis"
  | "RightParenthesis";

type Pattern = {
  type: TokenType;
  regex: RegExp;
};

const ExpressionRegex = /[-+]?\d+(\.\d+)?(?:[-+*/^][-+]?\d+(\.\d+)?)*/.source;

const TokenPatterns: Pattern[] = [
  {
    type: "Number",
    regex: /([-+]?\d+(\.\d+)?)/,
  },
  {
    type: "XTerm",
    regex: new RegExp(
      `([-+]?)\\s*(\\d+(\\.\\d+)?)?\\s*(x)\\s*(\\^\\s*\\(?([-+]?\\d+(\\.\\d+)?|${ExpressionRegex})\\)?)?`
    ),
  },
  {
    type: "ExponentiatedConstant",
    regex: new RegExp(
      `([-+]?\\d+(\\.\\d+)?)\\s*(\\^\\s*\\(?([-+]?\\d+(\\.\\d+)?|${ExpressionRegex})\\)?)?`
    ),
  },
  {
    type: "Expression",
    regex: new RegExp(ExpressionRegex),
  },
  {
    type: "Operator",
    regex: /[+\-*/^]/,
  },
  {
    type: "LeftParenthesis",
    regex: /\(/,
  },
  {
    type: "RightParenthesis",
    regex: /\)/,
  },
];

interface Token {
  type: TokenType;
  value: string;
}

function Tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let remainingInput = input;

  while (remainingInput) {
    let matched = false;

    for (const pattern of TokenPatterns) {
      const match = remainingInput.match(pattern.regex);
      if (match && match.index === 0) {
        tokens.push({ type: pattern.type, value: match[0] });
        remainingInput = remainingInput.slice(match[0].length).trim();
        matched = true;
        break;
      }
    }

    if (!matched) {
      console.log(`Unrecognized token at "${remainingInput}"`);
      return [];
    }
  }

  return tokens;
}

export function ParseExpression(
  inputString: string,
  startIndex = 0
): [Expression, number] {
  const tokens = Tokenize(inputString);
  const terms: Array<Expression | Term | number> = [];
  const coefficient = 1;
  const exponent = 1;
  let index = startIndex;
  let operator: ((a: number, b: number) => number) | undefined;
  let functionOperation: ((x: number) => number) | undefined;

  while (index < tokens.length) {
    const token = tokens[index];
    switch (token.type) {
      case "Number":
        terms.push(parseFloat(token.value));
        break;
      case "XTerm":
        terms.push(ParseXTerm(token.value) ?? 0);
        break;
      case "ExponentiatedConstant":
        terms.push(ParseExponentiatedConstant(token.value) ?? 0);
        break;
      case "Expression":
        terms.push(ParseExpression(token.value)[0]); // Recursively parse sub-expressions
        break;
      case "LeftParenthesis": {
        // Parse the sub-expression inside the parentheses
        const [subExpression, newIndex] = ParseExpression(
          token.value,
          index + 1
        );
        terms.push(subExpression);
        index = newIndex; // Update the index to continue after the closing parenthesis
        break;
      }
      case "RightParenthesis":
        // If we reach a closing parenthesis, return the current expression and the index
        return [
          {
            terms,
            coefficient,
            exponent,
            operator,
            functionOperation,
          },
          index,
        ];
    }

    if (index < tokens.length - 1) {
      const nextToken = tokens[index + 1];
      if (nextToken && nextToken.type === "Operator") {
        operator = GetOperator(nextToken.value); // Define `getOperator` function to map symbols
      }
    }

    index++;
  }

  return [
    {
      terms,
      coefficient,
      exponent,
      operator,
      functionOperation,
    },
    index,
  ];
}

function ParseXTerm(value: string): Term | undefined {
  const match = value.match(
    TokenPatterns.find((p) => p.type === "XTerm")!.regex
  );
  if (!match) {
    console.log("Invalid XTerm format");
    return undefined;
  }

  const coefficient = match[2] ? parseFloat(match[2]) : 1;
  const exponent = match[6] ? parseFloat(match[6]) : 1;

  return {
    coefficient,
    exponent,
  };
}

function ParseExponentiatedConstant(value: string): Term | undefined {
  const match = value.match(
    TokenPatterns.find((p) => p.type === "ExponentiatedConstant")!.regex
  );
  if (!match) {
    console.log("Invalid ExponentiatedConstant format");
    return undefined;
  }

  const coefficient = match[1] ? parseFloat(match[1]) : 1;
  const exponent = match[4] ? parseFloat(match[4]) : 1;

  return {
    coefficient,
    exponent,
  };
}

function GetOperator(op: string): (a: number, b: number) => number {
  switch (op) {
    case "+":
      return (a, b) => a + b;
    case "-":
      return (a, b) => a - b;
    case "*":
      return (a, b) => a * b;
    case "/":
      return (a, b) => a / b;
    case "^":
      return (a, b) => Math.pow(a, b);
    default:
      console.log(`Unknown operator: ${op}`);
      return (a, b) => a + b;
  }
}
