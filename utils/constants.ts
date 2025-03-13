// Map Dimensions and Styling
export const MAP_STYLE = {
  containerStyle: {
    width: '100%',
    height: '100vh',
  },
  markerColor: '#C42644',  // Primary color for markers
  secondaryColor: '#4A5568', // Secondary color for UI elements
};

// Map Center and Bounds
export const MAP_COORDINATES = {
  defaultCenter: {
    lat: 31.7917,
    lng: -7.0926
  },
  moroccanBounds: {
    north: 35.9222,
    south: 27.6666,
    east: -1.0166,
    west: -13.1683
  }
};

// Zoom Level Settings
export const ZOOM_SETTINGS = {
  minZoom: 5,
  maxZoom: 15,
  defaultZoom: 6,
  clusterMaxZoom: 14
};

// Google Maps Options
export const MAP_OPTIONS = {
  disableDefaultUI: true,
  zoomControl: false,
  minZoom: ZOOM_SETTINGS.minZoom,
  maxZoom: ZOOM_SETTINGS.maxZoom,
  mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID,
  restriction: {
    latLngBounds: MAP_COORDINATES.moroccanBounds,
    strictBounds: false,
  }
};

// Marker and Cluster Configurations
export const MARKER_CONFIG = {
  default: {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: MAP_STYLE.markerColor,
    fillOpacity: 0.8,
    strokeWeight: 2,
    strokeColor: '#FFFFFF',
    scale: 8,
  },
  hover: {
    fillOpacity: 1,
    scale: 10,
  },
  selected: {
    fillOpacity: 1,
    scale: 12,
    strokeWeight: 3,
  }
};

export const CLUSTER_CONFIG = {
  algorithm: {
    maxZoom: ZOOM_SETTINGS.clusterMaxZoom,
    radius: 60
  },
  renderer: {
    styles: {
      default: {
        color: '#FFFFFF',
        fontSize: '12px',
        fontWeight: 'bold'
      }
    },
    baseScale: 5,
    scaleIncrement: 2,
    maxScale: 12
  }
};

// Animation Timings
export const ANIMATION_SETTINGS = {
  markerHoverDelay: 200,
  regionZoomDuration: 300,
  connectionAnimationSpeed: 20
};

// Popup Settings
export const POPUP_CONFIG = {
  viewTypes: {
    buildings: 'buildings',
    architects: 'architects'
  } as const,
  styles: {
    active: 'text-[#C42644] font-semibold',
    inactive: 'text-gray-500 hover:text-[#C42644]'
  }
};

// Type definitions for the constants
export type ViewType = keyof typeof POPUP_CONFIG.viewTypes;

// Helper function to get marker size based on count
export const getMarkerScale = (count: number): number => {
  return Math.min(
    CLUSTER_CONFIG.renderer.maxScale,
    CLUSTER_CONFIG.renderer.baseScale + Math.log(count) * CLUSTER_CONFIG.renderer.scaleIncrement
  );
};

export const CLUSTERER_CONFIG = {

  markerOptions: {

    icon: {

      url: 'path/to/icon.png',

      scaledSize: new google.maps.Size(30, 30)

    }

  },

  maxZoom: 15,

  radius: 40

};
