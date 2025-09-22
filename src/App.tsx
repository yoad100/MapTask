import React, { useEffect, Suspense, lazy } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreProvider, useStores } from './contexts/StoreContext';
import LoadingSpinner from './components/UI/LoadingSpinner';
import Button from './components/UI/Button';
import { DrawingMode } from './services/types';
import PolygonPanel from './components/Panels/PolygonPanel';
import ObjectsPanel from './components/Panels/ObjectsPanel';
import MapDataPanel from './components/Panels/MapDataPanel';
import MapContainer from './components/Map/MapContainer';

const AppContent: React.FC = observer(() => {
  const { mapStore, polygonStore, objectStore } = useStores();

  useEffect(() => {
    // Load initial data with error handling
    const loadInitialData = async () => {
      try {
        await Promise.all([
          polygonStore.loadPolygons(),
          objectStore.loadObjects()
        ]);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();
  }, [polygonStore, objectStore]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        mapStore.setDrawingMode(DrawingMode.None);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [mapStore]);

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Map Panel */}
      <div className="flex-1 relative">
        <MapContainer />
        
        {mapStore.isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[1000]">
            <LoadingSpinner />
          </div>
        )}
        
        {mapStore.error && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-[1000] max-w-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm">{mapStore.error}</span>
              <Button
                onClick={() => mapStore.clearError()}
                variant="danger"
                className="ml-2 text-lg leading-none px-2 py-0"
              >
                ×
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="w-80 bg-white shadow-lg border-l border-gray-200 flex flex-col overflow-hidden">
          <PolygonPanel />
          <ObjectsPanel />
          <MapDataPanel />
      </div>
    </div>
  );
});

const App: React.FC = () => {
  return (
      <StoreProvider>
        <AppContent />
      </StoreProvider>
  );
};

export default App;