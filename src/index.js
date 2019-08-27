import * as turf from "@turf/turf";
import * as L from "leaflet";
import { extractGridCounts, getColor, style } from "./utils";
import data from "./data.json";
import "normalize.css";

/*

Grid Setup

*/

const bbox = [-79.63, 43.59, -79.13, 43.89];
const cellSide = 4;
const options = { units: "kilometers" };
const grid = turf.hexGrid(bbox, cellSide, options);
for (let [k, v] of Object.entries(grid.features)) {
  grid.features[k].properties = {
    ...grid.features[k].properties,
    count: 0
  };
}

/*

Leaflet

*/

const map = L.map(document.getElementById("map"), {
  center: [43.6426, -79.3871],
  zoom: 11
});

// prettier-ignore
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>"
}).addTo(map);

/* @typedef {Point[]} points */
const points = [];
data.features.forEach(({ properties, geometry: { type, coordinates } }) => {
  const [lon, lat] = coordinates;

  L.marker([lat, lon])
    .addTo(map)
    .bindPopup(`${lon}, ${lat}`);

  points.push(turf.point([lon, lat]));
});

/*

Count Points in Grid

*/

// iterate through grid hexagons
for (let [k, v] of Object.entries(grid.features)) {
  let poly = turf.polygon(grid.features[k].geometry.coordinates);

  // iterate through each dataset coordinate
  for (let j = 0; j < points.length; j++) {
    let currPoint = points[j];
    let isPointInPolygon = turf.booleanPointInPolygon(currPoint, poly);
    if (!!isPointInPolygon) {
      grid.features[k].properties = {
        ...grid.features[k].properties,
        count: grid.features[k].properties.count + 1
      };
    }
  }
}

// colour generator
const gridCounts = extractGridCounts(grid);
const colorHandler = getColor(gridCounts);

L.geoJson(grid, {
  style: function(gridFeatureGeoJson) {
    const count = gridFeatureGeoJson.properties.count;
    const fillColor = colorHandler(count);
    return style(fillColor);
  }
}).addTo(map);
