import React, { createContext, useContext } from 'react';
import { MapStore } from '../stores/MapStore';
import { PolygonStore } from '../stores/PolygonStore';
import { ObjectStore } from '../stores/ObjectStore';

export interface RootStore {
  mapStore: MapStore;
  polygonStore: PolygonStore;
  objectStore: ObjectStore;
}

const mapStore = new MapStore();
const polygonStore = new PolygonStore(mapStore);
const objectStore = new ObjectStore(mapStore);

const rootStore: RootStore = {
  mapStore,
  polygonStore,
  objectStore,
};

const StoreContext = createContext<RootStore>(rootStore);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StoreContext.Provider value={rootStore}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStores = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStores must be used within a StoreProvider');
  }
  return context;
};