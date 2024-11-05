type FunctionProps = {
  value: Expression;
  range: { a: number; b: number };
};

export class Function {
  expression: Expression;
  range: { a: number; b: number };

  constructor({ value, range }: FunctionProps) {
    this.expression = value;
    this.range = range;
  }

  evaluate(x: number): number {
    function evaluateExpression(value: Expression): number {
      let result = 0;

      if ("b" in value.terms) {
        const aResult = evaluateExpressionMember(value.terms.a);
        const bResult = evaluateExpressionMember(value.terms.b);
        result = value.operator
          ? value.operator(aResult, bResult)
          : aResult + bResult;
      } else {
        result = evaluateExpressionMember(value.terms.a);
      }

      result *= value.coefficient;
      result **= value.exponent;

      return value.functionOperation ? value.functionOperation(result) : result;
    }

    function evaluateExpressionMember(
      value: Expression | Term | number
    ): number {
      if (typeof value === "number") return value;
      if ("terms" in value) return evaluateExpression(value);

      const result = x ** value.exponent * value.coefficient;

      return value.functionOperation ? value.functionOperation(result) : result;
    }

    return this?.expression && evaluateExpression(this.expression);
  }

  generatePoints() {
    const xValues = Array.from(
      { length: this.range.b - this.range.a },
      (_, i) => i + this.range.a
    );

    return { x: [...xValues], y: [...xValues.map((x) => this.evaluate(x))] };
  }
}

type Expression = {
  terms:
    | { a: Expression | Term | number; b: Expression | Term | number }
    | { a: Expression | Term | number };
  exponent: number;
  coefficient: number;
  operator?: (a: number, b: number) => number;
  functionOperation?: (x: number) => number;
};

type Term = {
  exponent: number;
  coefficient: number;
  functionOperation?: (x: number) => number;
};
