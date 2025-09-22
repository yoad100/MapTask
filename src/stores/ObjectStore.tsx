

import { makeAutoObservable, runInAction } from 'mobx';
import { MapObject, GeoPoint } from '../services/types';
import { objectService } from '../services/ObjectService';
import { MapStore } from './MapStore';

export class ObjectStore {
  objects: MapObject[] = [];
  newObjects: MapObject[] = [];
  selectedObjectType: string = 'marker';
  iconBank: { [key: string]: string } = {
    marker: '📍',
    jeep: '🚙',
    house: '🏠',
    flag: '🚩',
    tree: '🌳',
  };
  selectedIcon: string = this.iconBank['marker']; // default icon
  

  addIconToBank(type: string, icon: string) {
    this.iconBank[type] = icon;
  }

  constructor(private mapStore: MapStore) {
    makeAutoObservable(this);
  }

  async loadObjects() {
  try {
    this.mapStore.setLoading(true);
    this.mapStore.clearError();

    const objects = await objectService.getAll(); // returns MapObjectResponse[]
    runInAction(() => {
      this.objects = objects.map(obj => ({
        ...obj,
        geometry: {
          lng: obj.geometry.coordinates[0],  
          lat: obj.geometry.coordinates[1],  
        },
      }));
    });
  } catch (error) {
    runInAction(() => {
      this.mapStore.setError(error instanceof Error ? error.message : 'Failed to load objects');
    });
  } finally {
    runInAction(() => {
      this.mapStore.setLoading(false);
    });
  }
}

  addObjectLocal(geometry: GeoPoint, type: "Feature", symbol: string) {
    const newObject: MapObject = {
      id: `${Date.now()}-${Math.random()}`,
      geometry,
      type,
      properties:{
        symbol,
        name: `${this.selectedObjectType} ${this.objects.length + 1}`,
      }
    };
    this.newObjects.push(newObject);
    this.objects.push(newObject);
    return newObject;
  }

  async deleteObject(id: string) {
    const beforeLength = this.newObjects.length;
    this.newObjects = this.newObjects.filter(o => o.id !== id);
    // If new object was removed, stop here
    if (this.newObjects.length < beforeLength) {
      this.objects = this.objects.filter(o => o.id !== id);
      return;
    }
    try {
      this.mapStore.setLoading(true);
      this.mapStore.clearError();

      await objectService.delete(id);

      runInAction(() => {
        this.objects = this.objects.filter(o => o.id !== id);
        if (this.mapStore.selectedObjectId === id) {
          this.mapStore.setSelectedObject(null);
        }
      });
    } catch (error) {
      runInAction(() => {
        this.mapStore.setError(error instanceof Error ? error.message : 'Failed to delete object');
      });
    } finally {
      runInAction(() => {
        this.mapStore.setLoading(false);
      });
    }
  }


  get selectedObject(): MapObject | null {
    return this.objects.find(o => o.id === this.mapStore.selectedObjectId) || null;
  }

  // Bulk save all objects to API
  async saveObjectsToServer() {
    await objectService.saveBulkObjects(this.newObjects);
    return true;
  }
}