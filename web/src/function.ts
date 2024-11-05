type FunctionProps = {
  expression: Expression;
  range: { a: number; b: number };
};

export class Function {
  expression: Expression;
  range: { a: number; b: number };

  constructor({ expression, range }: FunctionProps) {
    this.expression = expression;
    this.range = range;
  }

  evaluate(x: number): number {
    function evaluateExpression(expression: Expression): number {
      let result = 0;

      expression?.terms.forEach((member, index) => {
        if (index === 0)
          result += expression?.operator
            ? expression?.operator(result, evaluateExpressionMember(member))
            : result + evaluateExpressionMember(member);
      });

      result *= evaluateExpressionMember(expression.coefficient);
      result **= evaluateExpressionMember(expression.exponent);

      return expression.functionOperation
        ? expression.functionOperation(result)
        : result;
    }

    function evaluateExpressionMember(
      member: Expression | Term | number
    ): number {
      if (typeof member === "number") return member;
      if ("terms" in member) return evaluateExpression(member);

      const result =
        x ** evaluateExpressionMember(member.exponent) *
        evaluateExpressionMember(member.coefficient);

      return member.functionOperation
        ? member.functionOperation(result)
        : result;
    }

    return this?.expression && evaluateExpression(this.expression);
  }

  generatePoints() {
    const xValues = Array.from(
      { length: (this.range.b - this.range.a) * 1000 },
      (_, i) => (i + this.range.a) / 1000 - (this.range.b - this.range.a) / 2
    );

    return { x: [...xValues], y: [...xValues.map((x) => this.evaluate(x))] };
  }
}

type Expression = {
  terms: Array<Expression | Term | number>;
  exponent: Expression | Term | number;
  coefficient: Expression | Term | number;
  operator?: (a: number, b: number) => number;
  functionOperation?: (x: number) => number;
};

type Term = {
  exponent: Expression | Term | number;
  coefficient: Expression | Term | number;
  functionOperation?: (x: number) => number;
};
