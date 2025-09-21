import { BaseService } from './BaseService';
import { MapObject, MapObjectRequest, MapObjectResponse } from './types';
import { toGeoJsonObjects } from '../utils/ToGeoJSON';

class ObjectService extends BaseService<MapObjectRequest, MapObjectResponse> {
  constructor() {
    super('objects');
  }

  async saveBulkObjects(objects: MapObject[]): Promise<MapObjectResponse[]> {
    // Convert to GeoJSON before saving
    return super.saveBulk(toGeoJsonObjects(objects));
  }
}

export const objectService = new ObjectService();
