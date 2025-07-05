import React, { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import api from "../services/api"; // Adjust path as needed

function Globe() {
  const canvasRef = useRef(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    api.get("/planted-plants/map-markers").then((res) => {
      setMarkers(
        res.data.map((m) => ({
          location: [m.latitude, m.longitude],
          size: 0.03,
        }))
      );
    });
  }, []);

  useEffect(() => {
    if (!canvasRef.current || markers.length === 0) return;
    let phi = 0;
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600,
      height: 600,
      phi: 0,
      theta: 0.3,
      dark: 0,
      diffuse: 0.4,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [251 / 255, 100 / 255, 21 / 255],
      glowColor: [1, 1, 1],
      markers,
      onRender: (state) => {
        state.phi = phi;
        phi += 0.01;
      },
    });
    return () => globe.destroy();
  }, [markers]);

  return (
    <canvas
      ref={canvasRef}
      width={150}
      height={150}
      style={{ display: "block", margin: "0 auto" }}
    />
  );
}

export default Globe;
