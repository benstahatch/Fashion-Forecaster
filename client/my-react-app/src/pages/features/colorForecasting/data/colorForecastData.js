export const heroData = {
  label: "Color Forecasting",
  title: "Spring/Summer Collection Direction"
};

export const overviewData = {
  label: "Collection Overview",
  title: "Core direction for the collection",
  description:
    "This section introduces the seasonal concept, the emotional tone, and the overall color story before individual palette decisions are shown."
};

export const paletteData = {
  label: "Palette Grid",
  title: "Reference color card layout",
  cards: [
    { name: "Soft Clay", code: "PANTONE 15-1317", tone: "#d8b8a6" },
    { name: "Calm Sage", code: "PANTONE 14-6316", tone: "#b7c4b2" },
    { name: "Dust Blue", code: "PANTONE 16-4010", tone: "#98a8bc" },
    { name: "Warm Sand", code: "PANTONE 13-1011", tone: "#ddc9ab" }
  ]
};

export const colorStories = [
  {
    title: "Soft Clay",
    description:
      "A grounding mid-tone used to anchor the collection and set the emotional temperature."
  },
  {
    title: "Calm Sage",
    description:
      "A restorative green that introduces softness and supports the idea of balance and reset."
  },
  {
    title: "Dust Blue",
    description:
      "A quiet cool tone that gives the palette air, distance, and a modern seasonal contrast."
  }
];

export const principles = [
  {
    title: "Forecast from culture first",
    description:
      "Macro signals and lifestyle changes should shape the palette before product-level decisions are made."
  },
  {
    title: "Build range, not isolated colors",
    description:
      "Each color must work as part of a broader system across hero items, basics, and accents."
  }
];

export const targetMarket = {
  label: "Target Market",
  title: "Customer profile and lifestyle context",
  description:
    "This section will eventually connect the palette direction to the customer mindset, wardrobe behavior, and buying environment."
};

export function fetchColorForecastData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        heroData,
        overviewData,
        paletteData,
        colorStories,
        principles,
        targetMarket
      });
    }, 500);
  });
}
