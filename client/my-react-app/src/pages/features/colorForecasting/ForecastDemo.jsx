import React, { useEffect, useState } from "react";
import ForecastHero from "../../../components/forecast/ForecastHero";
import MoodboardGrid from "../../../components/forecast/MoodboardGrid";
import PaletteDisplay from "../../../components/forecast/PaletteDisplay";
import ForecastSection from "../../../components/forecast/ForecastSection";
import { getColors } from "./data/colorService";
import "../../../styles/forecast.css";

const moodboardImages = [
  {
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    alt: "Editorial fashion portrait in neutral tailoring"
  },
  {
    src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    alt: "Minimal interior details with sculptural forms"
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    alt: "Soft desert light over natural textures"
  },
  {
    src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
    alt: "Runway-inspired look in fluid monochrome layers"
  },
  {
    src: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
    alt: "Close-up of tactile woven fabric"
  },
  {
    src: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
    alt: "Quiet street style in understated neutrals"
  },
  {
    src: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    alt: "Tailored garment hanging in studio"
  },
  {
    src: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
    alt: "Moody editorial portrait with soft movement"
  },
  {
    src: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80",
    alt: "Stone, linen, and organic material palette"
  }
];

export default function ForecastDemo() {
  const [colors, setColors] = useState([]);
  const [groupedColors, setGroupedColors] = useState({});
  const [activeSeason, setActiveSeason] = useState("");

  useEffect(() => {
    async function loadColors() {
      const data = await getColors();
      const allColors = data || [];
      const grouped = allColors.reduce((groups, color) => {
        const season = color.season && color.season.trim()
          ? color.season
          : "Uncategorized";

        if (!groups[season]) {
          groups[season] = [];
        }

        groups[season].push(color);
        return groups;
      }, {});

      setColors(allColors);
      setGroupedColors(grouped);

      const [firstSeason] = Object.keys(grouped);
      if (firstSeason) {
        setActiveSeason(firstSeason);
      }
    }

    loadColors();
  }, []);

  return (
    <main className="forecast-page">
      <ForecastHero />
      <MoodboardGrid images={moodboardImages} />
      <PaletteDisplay colors={groupedColors[activeSeason] || colors} />
      <ForecastSection
        title="Cultural Context"
        body="Consumers are shifting toward quieter forms of luxury, valuing tactile materials, emotional longevity, and pieces that feel grounded rather than performative. The visual language points to restraint, with focus placed on silhouette, texture, and atmosphere over overt novelty."
      />
      <ForecastSection
        title="Target Market"
        body="This direction suits a style-conscious customer seeking elevated essentials that move easily between work, travel, and social settings. The audience prioritizes polish and versatility, responding to collections that feel editorial yet practical in everyday wardrobe building."
      />
      <ForecastSection
        title="Inspiration"
        body="Key references include gallery interiors, weathered stone, archival tailoring, soft-focus portraiture, and tonal dressing captured with deliberate simplicity. The mood should remain calm and curated, balancing clarity with material depth."
      />
    </main>
  );
}
