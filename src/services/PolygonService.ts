import { BaseService } from './BaseService';
import { MapPolygon, MapPolygonRequest, MapPolygonResponse } from './types';
import { toGeoJsonPolygons } from '../utils/ToGeoJSON';

class PolygonService extends BaseService<MapPolygonRequest, MapPolygonResponse> {
  constructor() {
    super('polygons');
  }

  async saveBulkPolygons(polygons: MapPolygon[]): Promise<MapPolygonResponse[]> {
    // Convert to GeoJSON before saving
    return super.saveBulk(toGeoJsonPolygons(polygons));
  }

  async deleteAllPolygons(): Promise<void> {
    await this.api.delete(`/${this.endpoint}`);
  }
}

export const polygonService = new PolygonService();