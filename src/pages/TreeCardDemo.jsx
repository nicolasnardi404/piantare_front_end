import TreeCard from '../components/TreeCard';
import './TreeCardDemo.css';

/**
 * TreeCard Demo Page
 *
 * Displays the TreeCard component with sample data
 */
const TreeCardDemo = () => {
  const sampleTreeData = {
    commonName: "Jaboticaba",
    scientificName: "Plinia cauliflora",
    description: "Iconic Brazilian trunk-fruiting tree producing sweet grape-like fruits directly on the bark. Fruits multiple times a year, supporting pollinators and frugivores.",
    // Using a placeholder image - replace with actual tree image
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop",

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
    alert(`Added ${sampleTreeData.commonName} to cart!`);
    console.log('Added to cart:', sampleTreeData.commonName);
  };

  return (
    <div className="tree-card-demo">
      <div className="tree-card-demo__header">
        <h1 className="tree-card-demo__title">TreeCard Component Demo</h1>
        <p className="tree-card-demo__subtitle">
          Reusable tree card following the Figma design system
        </p>
      </div>

      <TreeCard
        {...sampleTreeData}
        onAddToCart={handleAddToCart}
      />

      <div className="tree-card-demo__info">
        <h2>Component Features:</h2>
        <ul>
          <li>✅ Fully responsive design</li>
          <li>✅ Matches existing color palette and design tokens</li>
          <li>✅ Follows DRY principles</li>
          <li>✅ Reusable for any tree type</li>
          <li>✅ Optional sections (all props are flexible)</li>
        </ul>
      </div>
    </div>
  );
};

export default TreeCardDemo;
