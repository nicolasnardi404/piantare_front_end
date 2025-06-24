import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Polygon,
  useMap,
  LayersControl,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Box } from "@mui/material";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// São Paulo coordinates as default center
const defaultPosition = [-23.5505, -46.6333];

const parseAreaCoordinates = (coordinates) => {
  if (!coordinates) return null;
  if (Array.isArray(coordinates)) return coordinates;
  try {
    const parsed = JSON.parse(coordinates);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch (error) {
    console.error("Error parsing area coordinates:", error);
    return null;
  }
};

const MapController = ({ initialArea }) => {
  const map = useMap();
  const parsedArea = parseAreaCoordinates(initialArea);

  useEffect(() => {
    // Force a map resize after mounting
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    try {
      // If there's an initial area, fit the map to it
      if (parsedArea && Array.isArray(parsedArea) && parsedArea.length > 0) {
        const bounds = L.latLngBounds(parsedArea);
        map.fitBounds(bounds);
      } else {
        // Make sure we pass the coordinates in the correct order [lat, lng]
        map.setView([defaultPosition[0], defaultPosition[1]], 13);
      }
    } catch (error) {
      console.error("Error setting map view:", error);
      // Fallback to default position if anything goes wrong
      map.setView([defaultPosition[0], defaultPosition[1]], 13);
    }
  }, [map, parsedArea]);

  return null;
};

const ProjectAreaMap = ({ initialArea, onChange }) => {
  const [drawnItems, setDrawnItems] = useState(null);
  const parsedArea = parseAreaCoordinates(initialArea);

  const handleCreated = (e) => {
    const { layer } = e;
    if (drawnItems) {
      drawnItems.clearLayers();
      drawnItems.addLayer(layer);
    }
    const coordinates = layer
      .getLatLngs()[0]
      .map((latLng) => [latLng.lat, latLng.lng]);
    onChange(JSON.stringify(coordinates)); // Stringify the coordinates before sending them back
  };

  const handleEdited = (e) => {
    const layers = e.layers;
    layers.eachLayer((layer) => {
      const coordinates = layer
        .getLatLngs()[0]
        .map((latLng) => [latLng.lat, latLng.lng]);
      onChange(JSON.stringify(coordinates)); // Stringify the coordinates before sending them back
    });
  };

  const handleDeleted = () => {
    onChange(null);
  };

  const handleDrawStart = () => {
    if (drawnItems) {
      drawnItems.clearLayers();
    }
  };

  return (
    <MapContainer
      center={[defaultPosition[0], defaultPosition[1]]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <LayersControl position="bottomright">
        <LayersControl.BaseLayer checked name="Mapa">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satélite">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            maxZoom={19}
            minZoom={0}
            tileSize={256}
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      <FeatureGroup ref={setDrawnItems}>
        <EditControl
          position="topright"
          onCreated={handleCreated}
          onEdited={handleEdited}
          onDeleted={handleDeleted}
          onDrawStart={handleDrawStart}
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
            polygon: {
              allowIntersection: false,
              drawError: {
                color: "#e1e100",
                message: "Os limites do polígono não podem se cruzar!",
              },
              shapeOptions: {
                color: "#4caf50",
                fillColor: "#4caf50",
                fillOpacity: 0.2,
              },
            },
          }}
          edit={{
            featureGroup: drawnItems,
            remove: true,
            edit: true,
          }}
        />
      </FeatureGroup>

      {parsedArea && Array.isArray(parsedArea) && parsedArea.length > 0 && (
        <Polygon
          positions={parsedArea}
          pathOptions={{
            color: "#4caf50",
            fillColor: "#4caf50",
            fillOpacity: 0.2,
          }}
        />
      )}

      <MapController initialArea={initialArea} />
    </MapContainer>
  );
};

export default ProjectAreaMap;
