import React from "react";

export default function ColorStorySection({
  title,
  description,
  imagePosition = "left"
}) {
  const sectionClassName =
    imagePosition === "right"
      ? "color-story-section color-story-section-reverse"
      : "color-story-section";

  return (
    <section className={sectionClassName}>
      <div className="color-story-image" />
      <div className="color-story-copy">
        <p className="section-label">Individual Color Section</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </section>
  );
}
