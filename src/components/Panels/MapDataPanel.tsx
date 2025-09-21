import React from 'react';
import { observer } from 'mobx-react-lite';

import { PANEL_STRINGS } from '../../strings/panels';
import { useStores } from '../../contexts/StoreContext';
import { MapObject, MapPolygon } from '@/services/types';


const MapDataPanel: React.FC = observer(() => {
  const { objectStore, polygonStore, mapStore } = useStores();
  // Helper to format polygon coordinates as string
  const formatPolygonLat = (polygon: MapPolygon) => {
    if (!polygon.geometry.coordinates || polygon.geometry.coordinates.length === 0) return '';
    const first = polygon.geometry.coordinates[0][0];
    return first.lat.toFixed(6);
  };
  const formatPolygonLon = (polygon: MapPolygon) => {
    if (!polygon.geometry.coordinates || polygon.geometry.coordinates.length === 0) return '';
    const first = polygon.geometry.coordinates[0][0];
    return first.lng.toFixed(6);
  };

  // Combined data: polygons first, then objects
  const tableRows = [
  ...polygonStore.polygons.map((poly: MapPolygon) => ({
      id: poly.id,
      type: 'polygon',
      name: `${poly.properties.name}`,
      lat: formatPolygonLat(poly),
      lng: formatPolygonLon(poly),
    })),
  ...objectStore.objects.map((obj: MapObject) => ({
      id: obj.id,
      type: 'object',
      name: `${obj.properties.name}`,
      lat: obj.geometry.lat.toFixed(6),
      lng: obj.geometry.lng.toFixed(6),
    }))
  ];

  const handleRowClick = (row: any) => {
    if (row.type === 'polygon') {
      mapStore.setSelectedPolygon(row.id);
    } else {
      mapStore.setSelectedObject(row.id);
    }
  };

  return (
    <div className="p-4 flex-1 flex flex-col">
  <h2 className="text-lg font-semibold mb-3">{PANEL_STRINGS.MAPDATA_HEADER}</h2>
  <div className="flex flex-col overflow-hidden h-64">
        {/* Save button removed; now only in ObjectsPanel */}
        <div className="border rounded-md overflow-hidden bg-white flex-1 flex flex-col">
          {/* Header */}
          <div className="grid grid-cols-4 bg-gray-50 border-b">
            <div className="p-2 text-sm font-medium text-gray-700 border-r">{PANEL_STRINGS.TYPE}</div>
            <div className="p-2 text-sm font-medium text-gray-700 border-r">{PANEL_STRINGS.NAME}</div>
            <div className="p-2 text-sm font-medium text-gray-700 border-r">{PANEL_STRINGS.LAT}</div>
            <div className="p-2 text-sm font-medium text-gray-700">{PANEL_STRINGS.LNG}</div>
          </div>
          {/* Data rows */}
          <div className="overflow-y-auto h-full">
            {tableRows.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                {PANEL_STRINGS.NO_DATA}
              </div>
            ) : (
              tableRows.map((row) => (
                <div
                  key={row.id}
                  onClick={() => handleRowClick(row)}
                  className={`grid grid-cols-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 ${
                    (row.type === 'polygon' && mapStore.selectedPolygonId === row.id) ||
                    (row.type === 'object' && mapStore.selectedObjectId === row.id)
                      ? 'bg-blue-100'
                      : ''
                  }`}
                >
                  <div className="p-2 text-sm border-r capitalize">{row.type}</div>
                  <div className="p-2 text-sm border-r truncate" title={row.name}>{row.name}</div>
                  <div className="p-2 text-sm border-r font-mono text-xs">{row.lat}</div>
                  <div className="p-2 text-sm font-mono text-xs">{row.lng}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Stats */}
      <div className="mt-3 text-xs text-gray-500">
        {PANEL_STRINGS.TOTAL_POLYGONS} {polygonStore.polygons.length} | {PANEL_STRINGS.TOTAL_OBJECTS} {objectStore.objects.length}
      </div>
    </div>
  );
});

export default MapDataPanel;