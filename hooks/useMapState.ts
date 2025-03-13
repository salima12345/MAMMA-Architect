import { useState, useCallback } from 'react';
import { ViewMode, MAP_CONSTANTS } from '@/types/map';
import { useGeolocation } from './useGeoLocation';

export function useMapState() {
  const [viewMode, setViewMode] = useState<ViewMode>('buildings');
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [zoom, setZoom] = useState<number>(MAP_CONSTANTS.MIN_ZOOM_LEVEL);
  const [showConnections, setShowConnections] = useState(false);
  const [isLocationActive, setIsLocationActive] = useState(false);
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const { userLocation, getUserLocation } = useGeolocation();

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
  }, []);

  const handleZoomChanged = useCallback(() => {
    if (mapInstance) {
      setZoom(mapInstance.getZoom() || MAP_CONSTANTS.MIN_ZOOM_LEVEL);
    }
  }, [mapInstance]);

  const handleZoomIn = useCallback(() => {
    if (mapInstance && zoom < MAP_CONSTANTS.MAX_ZOOM_LEVEL) {
      mapInstance.setZoom(zoom + 1);
    }
  }, [mapInstance, zoom]);

  const handleZoomOut = useCallback(() => {
    if (mapInstance && zoom > MAP_CONSTANTS.MIN_ZOOM_LEVEL) {
      mapInstance.setZoom(zoom - 1);
    }
  }, [mapInstance, zoom]);

  const handleToggleViewMode = useCallback(() => {
    setShowConnections(false);
    setViewMode((prev) => (prev === 'buildings' ? 'architects' : 'buildings'));
  }, []);

  const handleToggleConnections = useCallback(() => {
    if (viewMode === 'architects') {
      setShowConnections((prev) => !prev);
    }
  }, [viewMode]);

  const handleGetUserLocation = useCallback(() => {
    if (isLocationActive) {
      setIsLocationActive(false);
      setShowUserLocation(false);
    } else {
      setIsLoadingLocation(true);
      getUserLocation()
        .then((location) => {
          if (mapInstance) {
            mapInstance.panTo(location);
            mapInstance.setZoom(14);
            setIsLocationActive(true);
            setShowUserLocation(true);
          }
        })
        .finally(() => {
          setIsLoadingLocation(false);
        });
    }
  }, [getUserLocation, mapInstance, isLocationActive, showUserLocation]);

  return {
    mapInstance,
    viewMode,
    zoom,
    showConnections,
    showUserLocation,
    userLocation,
    isLoadingLocation,
    isLocationActive,
    handleMapLoad,
    handleZoomChanged,
    handleZoomIn,
    handleZoomOut,
    handleToggleViewMode,
    handleToggleConnections,
    handleGetUserLocation,
  };
}