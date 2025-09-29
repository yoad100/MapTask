import { makeAutoObservable, runInAction } from "mobx";
import { MapPolygon, GeoPoint } from "../services/types";
import { polygonService } from "../services/PolygonService";
import { MapStore } from "./MapStore";

export class PolygonStore {
  polygons: MapPolygon[] = [];
  newPolygons: MapPolygon[] = [];
  currentDrawingPoints: GeoPoint[] = [];

  constructor(private mapStore: MapStore) {
    makeAutoObservable(this);
  }

  async loadPolygons() {
    try {
      this.mapStore.setLoading(true);
      this.mapStore.clearError();

      const polygons = await polygonService.getAll();

      runInAction(() => {
        this.polygons = polygons.map((poly) => {
          const exterior = poly.geometry.coordinates.exterior.positions.map(
            (pos: { values: [number, number] }) => ({
              lng: pos.values[0], 
              lat: pos.values[1], 
            })
          );

          const holes = poly.geometry.coordinates.holes.map(
            (hole: { positions: { values: [number, number] }[] }) =>
              hole.positions.map((pos) => ({
                lng: pos.values[0],
                lat: pos.values[1],
              }))
          );

          return {
            ...poly,
            geometry: {
              type: "Polygon",
              coordinates: [exterior, ...holes], // Leaflet expects [outer, hole1, hole2...]
            },
          };
        });
      });
    } catch (error) {
      runInAction(() => {
        this.mapStore.setError(
          error instanceof Error ? error.message : "Failed to load polygons"
        );
      });
    } finally {
      runInAction(() => {
        this.mapStore.setLoading(false);
      });
    }
  }

  addDrawingPoint(point: GeoPoint) {
    this.currentDrawingPoints.push(point);
  }

  finishDrawing() {
    if (this.currentDrawingPoints.length >= 3) {
      return [...this.currentDrawingPoints];
    }
    return null;
  }

  clearDrawingPoints() {
    this.currentDrawingPoints = [];
  }

  async addPolygonLocaly(coordinates: GeoPoint[][]) {
    try {
      this.mapStore.setLoading(true);
      this.mapStore.clearError();

      const newPolygon: MapPolygon = {
        id: `poly-${Date.now()}`,
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: coordinates,
        },
        properties: { name: `Polygon ${this.polygons.length + 1}` },
      };

      runInAction(() => {
        this.newPolygons.push(newPolygon);
        this.polygons.push(newPolygon);
        this.clearDrawingPoints();
      });

      return newPolygon;
    } catch (error) {
      runInAction(() => {
        this.mapStore.setError(
          error instanceof Error ? error.message : "Failed to save polygon"
        );
      });
      throw error;
    } finally {
      runInAction(() => {
        this.mapStore.setLoading(false);
      });
    }
  }

  async deletePolygon(id: string) {
    const beforeLength = this.newPolygons.length;
    this.newPolygons = this.newPolygons.filter((p) => p.id !== id);

    // If new polygon was removed, stop here
    if (this.newPolygons.length < beforeLength) {
      this.polygons = this.polygons.filter((p) => p.id !== id);
      return;
    }
    try {
      this.mapStore.setLoading(true);
      this.mapStore.clearError();

      await polygonService.delete(id);

      runInAction(() => {
        this.polygons = this.polygons.filter((p) => p.id !== id);
        if (this.mapStore.selectedPolygonId === id) {
          this.mapStore.setSelectedPolygon(null);
        }
      });
    } catch (error) {
      runInAction(() => {
        this.mapStore.setError(
          error instanceof Error ? error.message : "Failed to delete polygon"
        );
      });
    } finally {
      runInAction(() => {
        this.mapStore.setLoading(false);
      });
    }
  }

  async deleteAllPolygons() {
    try {
      this.mapStore.setLoading(true);
      this.mapStore.clearError();

      await polygonService.deleteAllPolygons();

      runInAction(() => {
        this.polygons = [];
        this.mapStore.clearSelections();
      });
    } catch (error) {
      runInAction(() => {
        this.mapStore.setError(
          error instanceof Error
            ? error.message
            : "Failed to delete all polygons"
        );
      });
    } finally {
      runInAction(() => {
        this.mapStore.setLoading(false);
      });
    }
  }

  get selectedPolygon(): MapPolygon | null {
    return (
      this.polygons.find((p) => p.id === this.mapStore.selectedPolygonId) ||
      null
    );
  }

  // Bulk save all polygons to API
  async savePolygonsToServer() {
    await polygonService.saveBulkPolygons(this.newPolygons);
    runInAction(() => {
      this.newPolygons = [];
    });
    return true;
  }
}
