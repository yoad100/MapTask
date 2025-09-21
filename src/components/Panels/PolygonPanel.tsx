import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../contexts/StoreContext';
import { DrawingMode } from '../../services/types';
import Button from '../UI/Button';
import { PANEL_STRINGS } from '../../strings/panels';
//

const PolygonPanel: React.FC = observer(() => {
  const { mapStore, polygonStore } = useStores();

  const handleAddClick = () => {
    if (mapStore.drawingMode === DrawingMode.Polygon) {
      mapStore.setDrawingMode(DrawingMode.None);
      polygonStore.clearDrawingPoints();
    } else {
      mapStore.setDrawingMode(DrawingMode.Polygon);
    }
  };

  const handleDeleteClick = async () => {
    if (mapStore.selectedPolygonId) {
      await polygonStore.deletePolygon(mapStore.selectedPolygonId);
    } else {
      // If no specific polygon selected, show confirmation for delete all
    if (window.confirm(PANEL_STRINGS.DELETE_ALL_POLYGONS_CONFIRM)) {
        await polygonStore.deleteAllPolygons();
      }
    }
  };

  const isDrawing = mapStore.drawingMode === DrawingMode.Polygon;
  const hasSelection = mapStore.selectedPolygonId !== null;
  const hasPolygons = polygonStore.polygons.length > 0;

  return (
    <div className="p-4 border-b border-gray-200">
  <h2 className="text-lg font-semibold mb-3">{PANEL_STRINGS.POLYGON_HEADER}</h2>
      
      <div className="flex gap-2">
        <Button
          onClick={handleAddClick}
          variant={isDrawing ? 'primary' : 'secondary'}
          disabled={mapStore.isLoading}
          className="flex-1"
        >
          {isDrawing ? PANEL_STRINGS.CANCEL : PANEL_STRINGS.ADD}
        </Button>
        
        <Button
          onClick={handleDeleteClick}
          variant="danger"
          disabled={mapStore.isLoading || (!hasSelection && !hasPolygons)}
          className="flex-1"
        >
          {PANEL_STRINGS.DELETE}
        </Button>
      </div>

      {/* Selection info */}
      {hasSelection && (
        <div className="mt-2 text-sm text-gray-600">
          {PANEL_STRINGS.SELECTED_POLYGON} {polygonStore.selectedPolygon?.id || PANEL_STRINGS.UNNAMED_POLYGON}
        </div>
      )}

      {/* Drawing progress */}
      {isDrawing && (
        <div className="mt-2 text-sm text-blue-600">
          Points: {polygonStore.currentDrawingPoints.length}
          {polygonStore.currentDrawingPoints.length >= 3 && ' (Double-click to finish)'}
        </div>
      )}
    </div>
  );
});

export default PolygonPanel;