// Icon bank for objects
// ICON_BANK is now in ObjectStore
import React, { useCallback } from 'react';
import { MapContainer as LeafletMap, TileLayer, Polygon, Marker, useMapEvents } from 'react-leaflet';
import { observer } from 'mobx-react-lite';
import L, { DivIcon, LeafletMouseEvent } from 'leaflet';
import { useStores } from '../../contexts/StoreContext';
import { DrawingMode, GeoPoint } from '../../services/types';
import { MAP_STRINGS } from '../../strings/map';
import 'leaflet/dist/leaflet.css';


const MapClickHandler: React.FC = observer(() => {
  const { mapStore, polygonStore, objectStore } = useStores();

  useMapEvents({
    click: useCallback((e: LeafletMouseEvent) => {
      const point: GeoPoint = { lat: e.latlng.lat, lng: e.latlng.lng };

      if (mapStore.drawingMode === DrawingMode.Polygon) {
        polygonStore.addDrawingPoint(point);
      } else if (mapStore.drawingMode === DrawingMode.Object) {
        // Get selected type and icon from objectStore
        const selectedType = "Feature";
        const selectedIcon = objectStore.selectedIcon;
        objectStore.addObjectLocal(point, selectedType, selectedIcon);
        mapStore.setDrawingMode(DrawingMode.None);
      }
    }, [mapStore, polygonStore, objectStore]),
    dblclick: useCallback(() => {
      if (mapStore.drawingMode === DrawingMode.Polygon && polygonStore.currentDrawingPoints.length >= 3) {
        const coordinates = polygonStore.finishDrawing();
        if (coordinates) {
          polygonStore.addPolygonLocaly([coordinates]);
          mapStore.setDrawingMode(DrawingMode.None);
        }
      }
    }, [mapStore, polygonStore])
  });

  return null;
});

const MapContainer: React.FC = observer(() => {
  const { mapStore, polygonStore, objectStore } = useStores();
  
  // Tel Aviv coordinates (based on the UI mockup)
  const center: [number, number] = [32.0853, 34.7818];

  const handlePolygonClick = (polygonId: string) => {
    mapStore.setSelectedPolygon(polygonId);
  };

  const handleObjectClick = (objectId: string) => {
    mapStore.setSelectedObject(objectId);
  };

  
  return (
    <div className="h-full w-full relative">
      <LeafletMap
        center={center}
        zoom={12}
        className="h-full w-full"
        style={{ cursor: mapStore.drawingMode !== DrawingMode.None ? 'crosshair' : 'grab' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution={MAP_STRINGS.TILE_ATTRIBUTION}
        />
        
        <MapClickHandler />

        {/* Render existing polygons */}
        {polygonStore.polygons.map((polygon) => (
          <Polygon
            key={polygon.id}
            positions={polygon.geometry.coordinates[0].map(coord => [coord.lat,coord.lng])}
            pathOptions={{
              color: mapStore.selectedPolygonId === polygon.id ? '#ff0000' : '#3388ff',
              fillColor: mapStore.selectedPolygonId === polygon.id ? '#ff0000' : '#3388ff',
              fillOpacity: 0.2,
              weight: 3
            }}
            eventHandlers={{
              click: () => handlePolygonClick(polygon.id)
            }}
          />
        ))}

        {/* Render current drawing points */}
        {polygonStore.currentDrawingPoints.map((point, index) => (
          <Marker
            key={`drawing-${index}`}
            position={[point.lat,point.lng]}
            icon={new DivIcon({
              html: '●',
              className: 'drawing-point',
              iconSize: [8, 8],
              iconAnchor: [4, 4]
            })}
          />
        ))}

        {/* Render temporary polygon while drawing */}
        {polygonStore.currentDrawingPoints.length >= 3 && (
          <Polygon
            positions={polygonStore.currentDrawingPoints.map(point => [point.lng,point.lat] as [number, number])}
            pathOptions={{
              color: '#ffaa00',
              fillColor: '#ffaa00',
              fillOpacity: 0.1,
              weight: 2,
              dashArray: '5, 5'
            }}
          />
        )}

        {/* Render objects */}
        {objectStore.objects.map((object) => {
          // Use custom icon if set, else use icon from bank, else default
          let icon: L.DivIcon | L.Icon = new L.Icon.Default();
          if (object.properties.symbol) {
            icon = new DivIcon({
              html: `<span style='font-size: 36px; line-height: 1;'>${object.properties.symbol}</span>`,
              className: 'custom-object-icon',
              iconSize: [40, 40],
              iconAnchor: [20, 20]
            });
          }
          return (
            <Marker
              key={object.id}
              position={[object.geometry.lat, object.geometry.lng]}
              icon={icon}
              eventHandlers={{
                click: () => handleObjectClick(object.id)
              }}
            />
          );
        })}
      </LeafletMap>

      {/* Drawing instructions overlay */}
      {mapStore.drawingMode === DrawingMode.Polygon && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-md shadow-lg z-[1000]">
          <p className="text-sm font-medium">
            {MAP_STRINGS.DRAW_POLYGON_INSTRUCTION}
          </p>
        </div>
      )}

      {mapStore.drawingMode === DrawingMode.Object && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-md shadow-lg z-[1000]">
          <p className="text-sm font-medium">
            {MAP_STRINGS.DRAW_OBJECT_INSTRUCTION}
          </p>
        </div>
      )}
    </div>
  );
});

export default MapContainer;