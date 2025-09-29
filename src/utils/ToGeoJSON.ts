import { MapObject, MapObjectRequest, MapPolygon, MapPolygonRequest } from "../services/types";

export const toGeoJsonObjects = (objects: MapObject[]):MapObjectRequest[] =>
  objects.map(obj => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [obj.geometry.lng, obj.geometry.lat], // [lng, lat]
    },
    properties: {
      name: obj.properties.name || "",
      symbol: obj.properties.symbol,
    },
  }));

export const toGeoJsonPolygons = (polygons: MapPolygon[]): MapPolygonRequest[] =>
  polygons.map(polygon => ({
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: polygon.geometry.coordinates.map(ring => {
        const coords = ring.map(p => [p.lng, p.lat]);
        const first = coords[0];
        const last = coords[coords.length - 1];

        if (first[0] !== last[0] || first[1] !== last[1]) {
          coords.push(first);
        }

        return coords;
      })
    },
    properties: {
      name: polygon.properties.name || "",
    }
  }));
