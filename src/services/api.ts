import axios from 'axios';
import { MapPolygon, MapObject, MapPolygonRequest, MapObjectRequest, MapObjectResponse, MapPolygonResponse } from './types';
import { toGeoJsonObjects, toGeoJsonPolygons } from '../utils/ToGeoJSON';

// Base URL from environment variable, fallback to localhost API
const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'https://localhost:7115/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log errors if API fails
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export class ApiService {
  // ----- Polygons -----
  static async getPolygons(): Promise<MapPolygonResponse[]> {
    const response = await api.get<MapPolygonResponse[]>('/polygons');
    return response.data || [];
  }

  static async deletePolygon(id: string): Promise<void> {
    await api.delete(`/polygons/${id}`);
  }

  static async deleteAllPolygons(): Promise<void> {
    await api.delete('/polygons');
  }

    static async savePolygonsBulk(
    polygons: MapPolygon[]
  ): Promise<MapPolygonResponse[]> {
    const response = await api.post<MapPolygonResponse[]>(
      '/polygons/save',
      toGeoJsonPolygons(polygons)
    );
    return response.data || [];
  }
  // ----- Objects -----
  static async getObjects(): Promise<MapObjectResponse[]> {
    const response = await api.get<MapObjectResponse[]>('/objects');
    return response.data || [];
  }

  static async deleteObject(id: string): Promise<void> {
    await api.delete(`/objects/${id}`);
  }

  static async saveObjectsBulk(
    objects: MapObject[]
  ): Promise<MapObjectResponse[]> {
    const response = await api.post<MapObjectResponse[]>(
      '/objects/save',
      toGeoJsonObjects(objects)
    );
    return response.data || [];
  }
}