// import React from "react";
// import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
// import MarkerClusterGroup from "react-leaflet-markercluster";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet.markercluster/dist/MarkerCluster.css";
// import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// // Fix for default marker icon
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
//   iconUrl: require("leaflet/dist/images/marker-icon.png"),
//   shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
// });

// // São Paulo coordinates as default center
// const defaultPosition = [-23.5505, -46.6333];

// const BaseMap = ({ children }) => {
//   return (
//     <MapContainer
//       center={defaultPosition}
//       zoom={13}
//       style={{
//         height: "100%",
//         width: "100%",
//         position: "absolute",
//         top: 0,
//         left: 0,
//       }}
//     >
//       <LayersControl position="bottomright">
//         <LayersControl.BaseLayer checked name="Street Map">
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           />
//         </LayersControl.BaseLayer>
//         <LayersControl.BaseLayer name="Satellite">
//           <TileLayer
//             url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
//             attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
//             maxZoom={19}
//             minZoom={0}
//             tileSize={256}
//           />
//         </LayersControl.BaseLayer>
//       </LayersControl>

//       <MarkerClusterGroup
//         chunkedLoading
//         spiderfyOnMaxZoom={true}
//         showCoverageOnHover={true}
//         zoomToBoundsOnClick={true}
//         maxClusterRadius={50}
//         iconCreateFunction={(cluster) => {
//           const count = cluster.getChildCount();
//           let size = 40;
//           let className = "marker-cluster-";

//           if (count < 10) {
//             className += "small";
//           } else if (count < 100) {
//             className += "medium";
//             size = 50;
//           } else {
//             className += "large";
//             size = 60;
//           }

//           return L.divIcon({
//             html: `<div><span>${count}</span></div>`,
//             className: `marker-cluster ${className}`,
//             iconSize: L.point(size, size),
//           });
//         }}
//       >
//         {children}
//       </MarkerClusterGroup>
//     </MapContainer>
//   );
// };

// export default BaseMap;
