"use client";
import React, { useState } from 'react';
import { LoadScript, GoogleMap } from '@react-google-maps/api';
import { MapControls } from './MapControls';
import MapMarkers from './MapMarker';
import PopupOverlay from './PopupOverlay';
import { MapTitle } from './MapTitle';
import { useMapState } from '@/hooks/useMapState';
import { useNavStore } from '@/app/store/useNavStore';
import { useNavigation } from '@/hooks/useNavigation';
import { useHydrateStore } from '@/hooks/useHydrateStore';

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};

const center = {
  lat: 31.7917,
  lng: -7.0926,
};

export function MapContainer() {
  useHydrateStore();
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const {
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
  } = useMapState();

  const {
    showPopup,
    activeNav,

    setShowPopup,
    navigateTo,
  } = useNavStore();

  const { updateURL } = useNavigation();
  

  const handleMapLoaded = (map: google.maps.Map) => {
    handleMapLoad(map);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsMapLoaded(true);
          return 100;
        }
        return prev + 10;
      });
    }, 80);
  };

  const handleNavClick = (nav: 'regions' | 'buildings' | 'architects') => {
    // Ne remontez pas la popup si elle est déjà fermée
    if (!showPopup) {
      setShowPopup(true);
    }
    navigateTo({ nav, project: null, architect: null });
    updateURL({ view: nav });
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  return (
    <div className="relative">
      {!isMapLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-100 border-t-[#C42644] rounded-full animate-spin" />
            <div className="mt-4 text-gray-600 text-sm font-medium text-center">
              {progress}%
            </div>
          </div>
        </div>
      )}

      {isMapLoaded && (
        <>
          <MapTitle />

          <div className="fixed left-1/2 -translate-x-1/2 top-4 z-30 flex gap-4 bg-white rounded-lg shadow-md px-4 py-3">
            {(['regions', 'buildings', 'architects'] as const).map((nav) => (
              <button
                key={nav}
                onClick={() => handleNavClick(nav)}
                className={`text-sm font-medium transition-colors ${
                  activeNav === nav 
                    ? 'text-[#C42644]'
                    : 'text-gray-500 hover:text-[#C42644]'
                }`}
              >
                {nav.charAt(0).toUpperCase() + nav.slice(1)}
              </button>
            ))}
          </div>

          <MapControls
            viewMode={viewMode}
            showConnections={showConnections}
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onToggleViewMode={handleToggleViewMode}
            onToggleConnections={handleToggleConnections}
            onGetUserLocation={handleGetUserLocation}
            isLoadingLocation={isLoadingLocation}
            isLocationActive={isLocationActive}
          />
        </>
      )}

      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        region="MA"
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={zoom}
          center={center}
          options={{
            disableDefaultUI: true,
            zoomControl: false,
            minZoom: 5,
            maxZoom: 15,
            mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID,
          }}
          onLoad={handleMapLoaded}
          onZoomChanged={handleZoomChanged}
        >
          {isMapLoaded && (
            <MapMarkers
              mapInstance={mapInstance}
              viewMode={viewMode}
              showUserLocation={showUserLocation}
              userLocation={userLocation}
            />
          )}
        </GoogleMap>
      </LoadScript>

      {isMapLoaded && showPopup && (
        <PopupOverlay onClose={handlePopupClose} mapInstance={mapInstance} />
      )}
    </div>
  );
}

export default MapContainer