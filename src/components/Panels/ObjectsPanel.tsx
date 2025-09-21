import React, { useState } from 'react';

import AddCustomIconForm from '../UI/AddCustomIconForm';
import { PANEL_STRINGS } from '../../strings/panels';
import { createPortal } from 'react-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../contexts/StoreContext';
import { DrawingMode } from '../../services/types';
import Button from '../UI/Button';

const ObjectsPanel: React.FC = observer(() => {
  const { mapStore, objectStore } = useStores();
  const { selectedObjectType, selectedIcon, iconBank } = objectStore;
  const [showIconPopup, setShowIconPopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { polygonStore } = useStores();
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const promises: Promise<boolean>[] = [];
      if (objectStore.newObjects.length > 0) {
        promises.push(objectStore.saveObjectsToServer());
      }

      if (polygonStore.newPolygons.length > 0) {
        promises.push(polygonStore.savePolygonsToServer());
      }

      await Promise.all(promises);

      await objectStore.loadObjects();
      await polygonStore.loadPolygons();
    } finally {
      setIsSaving(false);
    }
};


  const handleAddClick = () => {
    if (mapStore.drawingMode === DrawingMode.Object) {
      mapStore.setDrawingMode(DrawingMode.None);
    } else {
      mapStore.setDrawingMode(DrawingMode.Object);
    }
  };

  const handleDeleteClick = async () => {
    if (mapStore.selectedObjectId) {
      await objectStore.deleteObject(mapStore.selectedObjectId);
    }
  };

  const isAddingObject = mapStore.drawingMode === DrawingMode.Object;
  const hasSelection = mapStore.selectedObjectId !== null;

  return (
    <div className="p-4 border-b border-gray-200">
  <h2 className="text-lg font-semibold mb-3">{PANEL_STRINGS.OBJECTS_HEADER}</h2>
      
      {/* Icon selector popup trigger */}
      <div className="mb-3">
        <Button
          type="button"
          variant="secondary"
          className="w-full py-2 px-3 flex items-center justify-center gap-2 text-blue-600"
          onClick={() => setShowIconPopup(true)}
        >
          <span style={{ fontSize: 24 }}>{selectedIcon}</span>
          <span className="capitalize">{selectedObjectType}</span>
          <span className="ml-2 text-xs text-gray-500">{PANEL_STRINGS.CHOOSE_ICON}</span>
        </Button>
        {showIconPopup && createPortal(
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw]">
              <h3 className="text-lg font-semibold mb-4">{PANEL_STRINGS.SELECT_ICON}</h3>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {Object.entries(iconBank).map(([type, icon]) => (
                  <Button
                    key={type}
                    type="button"
                    variant={selectedObjectType === type ? 'primary' : 'secondary'}
                    className={`border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      selectedObjectType === type ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                    }`}
                    onClick={() => {
                      objectStore.selectedObjectType = type;
                      objectStore.selectedIcon = icon;
                      setShowIconPopup(false);
                    }}
                  >
                    <span style={{ fontSize: 32 }}>{icon}</span>
                    <span className="mt-1 text-xs capitalize">{type}</span>
                  </Button>
                ))}
              </div>
              <hr className="my-3" />
              <AddCustomIconForm onAdd={(type, icon) => {
                objectStore.addIconToBank(type, icon);
              }} />
              <Button
                type="button"
                variant="secondary"
                className="mt-2 w-full"
                onClick={() => setShowIconPopup(false)}
              >
                {PANEL_STRINGS.CANCEL}
              </Button>
            </div>
          </div>,
          document.body
        )}
    </div>

      <div className="flex gap-2">
        <Button
          onClick={handleAddClick}
          variant={isAddingObject ? 'primary' : 'secondary'}
          disabled={mapStore.isLoading}
          className="flex-1"
        >
          {isAddingObject ? PANEL_STRINGS.CANCEL : PANEL_STRINGS.ADD}
        </Button>
        <Button
          onClick={handleDeleteClick}
          variant="danger"
          disabled={mapStore.isLoading || !hasSelection}
          className="flex-1"
        >
          {PANEL_STRINGS.DELETE}
        </Button>
      </div>
      <div className="flex mt-2">
        <Button
          onClick={handleSave}
          variant="primary"
          disabled={isSaving}
          className="flex-1"
        >
          {isSaving ? PANEL_STRINGS.SAVING : PANEL_STRINGS.SAVE}
        </Button>
      </div>

      {/* Selection info */}
      {hasSelection && (
        <div className="mt-2 text-sm text-gray-600">
          {PANEL_STRINGS.SELECTED_OBJECT} {objectStore.selectedObject?.properties.name || PANEL_STRINGS.UNNAMED_OBJECT}
        </div>
      )}

      {/* Adding instruction */}
      {isAddingObject && (
        <div className="mt-2 text-sm text-blue-600 flex items-center gap-2">
          {PANEL_STRINGS.ADD} {PANEL_STRINGS.ON_MAP_INSTRUCTION}
          <span style={{ fontSize: 20 }}>{selectedIcon}</span>
          <span className="capitalize">{selectedObjectType}</span>
        </div>
      )}
    </div>
  );
});

export default ObjectsPanel;