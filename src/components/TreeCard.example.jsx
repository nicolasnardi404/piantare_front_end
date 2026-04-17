/**
 * TreeCard Usage Example
 *
 * This file demonstrates how to use the TreeCard component
 * with sample data matching the Figma design
 */

import TreeCard from './TreeCard';

const TreeCardExample = () => {
  const sampleTreeData = {
    commonName: "Jaboticaba",
    scientificName: "Plinia cauliflora",
    description: "Iconic Brazilian trunk-fruiting tree producing sweet grape-like fruits directly on the bark. Fruits multiple times a year, supporting pollinators and frugivores.",
    imageUrl: "/images/trees/jaboticaba.jpg", // Replace with actual image path

    characteristics: {
      height: "5–10m",
      co2: "0.14t CO₂",
      lifespan: "20–30yr",
      origin: "Atlantic Forest, Brazil",
    },

    keyFeatures: [
      "Trunk fruiting",
      "Multi-harvest",
      "Cultural icon",
      "Pollinator",
    ],

    ecologicalScores: [
      {
        label: "Biodiversity",
        score: 9,
        description: "Trunk-borne flowers attract pollinators directly; fruit consumed by bats, birds and mammals.",
      },
      {
        label: "Resilience",
        score: 8,
        description: "Adapts well to various soil conditions and demonstrates strong resistance to pests and diseases.",
      },
      {
        label: "Carbon",
        score: 7,
        description: "Moderate carbon sequestration capacity with dense wood structure and year-round foliage.",
      },
      {
        label: "Water",
        score: 8,
        description: "Efficient water usage with deep root system that helps prevent soil erosion.",
      },
      {
        label: "Social impact",
        score: 9,
        description: "Provides food security, cultural value, and economic opportunities for local communities.",
      },
      {
        label: "Soil health",
        score: 8,
        description: "Leaf litter enriches soil organic matter and supports beneficial microorganism communities.",
      },
    ],

    availability: {
      needed: 10,
      available: 7,
    },

    pricing: {
      pricePerTree: 20,
    },
  };

  const handleAddToCart = () => {
    console.log('Added to cart:', sampleTreeData.commonName);
    // Add your cart logic here
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: 'var(--color-offwhite)' }}>
      <TreeCard
        {...sampleTreeData}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default TreeCardExample;
