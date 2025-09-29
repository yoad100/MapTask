type Lat = number;
type Lng = number;

export interface GeoPoint {
  lat: Lat;
  lng: Lng;
}

export interface GeoCoordinatesResponse {
  values: [Lng, Lat],
  x:Lng,
  y:Lat;
}

export interface MapObject {
  id: string;
  geometry: GeoPoint;
  type: "Feature";
  properties: {
    symbol: string; 
    name: string;
  }
}

export interface MapObjectRequest {
  geometry: {type:"Point",coordinates:[Lng,Lat]}; 
  type: "Feature";
  properties: {
    symbol: string;  
    name: string;
  }
}

export interface MapObjectResponse {
  id: string;
  geometry: {
    type: "Point";
    coordinates: GeoCoordinatesResponse; 
  }
  type: "Feature";
   properties: {
    symbol: string; 
    name: string;
  }
}

export interface MapPolygon {
  id: string;
  type: "Feature";
  geometry: {
    type: "Polygon";
    coordinates: GeoPoint[][];
  };
  properties: {
    name: string;
  }
}

export interface MapPolygonRequest {
  type: "Feature";
  geometry: { 
    type: "Polygon"; 
    coordinates: number[][][]; // [[[lng, lat], [lng, lat], ...]]
  }
  properties: {
    name: string;
  }
}

export interface MapPolygonResponse {
  id: string;
  type: "Feature";
  geometry: {
    boundingBox: null | any;
    coordinateReferenceSystem: null | any;
    coordinates: {
      exterior: {
        positions: GeoCoordinatesResponse[];
      };
      holes: {
        positions: GeoCoordinatesResponse[];
      }[];
    };
    extraMembers: null | any;
    type: number; // 8 = Polygon
  };
  properties: {
    name: string;
  };
}

export enum DrawingMode {
  None = 'none',
  Polygon = 'polygon',
  Object = 'object'
}