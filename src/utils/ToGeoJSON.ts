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

export const toGeoJsonPolygons = (polygons: MapPolygon[]):MapPolygonRequest[] =>
  polygons.map(polygon => ({
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: polygon.geometry.coordinates.map(pos =>
        pos.map(p => [p.lng, p.lat])
      )
    },
    properties: {
      name: polygon.properties.name || "",
    }
  }));