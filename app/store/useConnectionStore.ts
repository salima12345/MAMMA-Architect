import { create } from 'zustand';

interface AnimatedPolyline extends google.maps.Polyline {
  animationFrameId?: number;
}

interface ConnectionState {
  connections: AnimatedPolyline[];
  showConnections: boolean;
  addConnection: (connection: AnimatedPolyline) => void;
  setShowConnections: (show: boolean) => void;
  clearConnections: () => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  connections: [],
  showConnections: false,
  addConnection: (connection) => 
    set((state) => ({ connections: [...state.connections, connection] })),
  setShowConnections: (show) => set({ showConnections: show }),
  clearConnections: () => {
    set((state) => {
      // Cancel animations and remove from map
      state.connections.forEach(line => {
        if (line.animationFrameId) {
          cancelAnimationFrame(line.animationFrameId);
        }
        line.setMap(null);
      });
      return { connections: [], showConnections: false };
    });
  },
}));