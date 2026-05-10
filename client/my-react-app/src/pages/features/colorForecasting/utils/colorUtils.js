export function hexToRgb(hex) {
  const normalizedHex = hex.replace("#", "");
  const value = normalizedHex.length === 3
    ? normalizedHex.split("").map((char) => char + char).join("")
    : normalizedHex;

  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16)
  };
}

export function colorDistance(rgb1, rgb2) {
  const rDiff = rgb1.r - rgb2.r;
  const gDiff = rgb1.g - rgb2.g;
  const bDiff = rgb1.b - rgb2.b;

  return Math.sqrt((rDiff ** 2) + (gDiff ** 2) + (bDiff ** 2));
}

export function findClosestPantones(hex, pantoneList, limit = 3) {
  const sourceRgb = hexToRgb(hex);

  return pantoneList
    .map((pantone) => ({
      ...pantone,
      distance: colorDistance(sourceRgb, hexToRgb(pantone.hex))
    }))
    .sort((left, right) => left.distance - right.distance)
    .slice(0, limit);
}

export function findClosestColors(targetHex, colorList, limit = 4) {
  const sourceRgb = hexToRgb(targetHex);
  const normalizedTargetHex = targetHex.toUpperCase();

  return colorList
    .filter((color) => color.hex.toUpperCase() !== normalizedTargetHex)
    .map((color) => ({
      ...color,
      distance: colorDistance(sourceRgb, hexToRgb(color.hex))
    }))
    .sort((left, right) => left.distance - right.distance)
    .slice(0, limit);
}
