import { makeAutoObservable } from 'mobx';
import { DrawingMode } from '../services/types';

export class MapStore {
  drawingMode: DrawingMode = DrawingMode.None;
  selectedPolygonId: string | null = null;
  selectedObjectId: string | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setDrawingMode(mode: DrawingMode) {
    this.drawingMode = mode;
    this.clearSelections();
  }

  setSelectedPolygon(id: string | null) {
    this.selectedPolygonId = id;
    this.selectedObjectId = null;
  }

  setSelectedObject(id: string | null) {
    this.selectedObjectId = id;
    this.selectedPolygonId = null;
  }

  clearSelections() {
    this.selectedPolygonId = null;
    this.selectedObjectId = null;
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  clearError() {
    this.error = null;
  }
}