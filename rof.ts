
function generateNumberArray(range: [number, number]): number[] {
    const [start, end] = range;
    const result: number[] = [];
    let current = start;

    // To handle precision issues, we use toFixed(1) for comparison
    while (parseFloat(current.toFixed(1)) <= end) {
        result.push(parseFloat(current.toFixed(1)));
        current += 0.1;
    }

    return result;
}

const xValues = generateNumberArray([0, 1]);
console.log(xValues); // Output: [0, 0.1, 0.2, ..., 0.9, 1.0]
