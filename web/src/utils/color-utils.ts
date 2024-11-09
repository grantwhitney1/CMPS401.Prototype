type Color = {
  r: number;
  g: number;
  b: number;
};

function getLuminance(color: Color) {
  const { r, g, b } = color;
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function hexToRgb(hex: string): Color | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function getSecondaryColor(hexColor: string) {
  const color = hexToRgb(hexColor);
  if (!color) {
    throw new Error("Invalid hex color");
  }
  const luminance = getLuminance(color);
  return luminance > 0.5 ? "black" : "white";
}
