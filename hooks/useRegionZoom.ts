"use client";
import { useCallback} from 'react';

export function useRegionZoom(mapInstance: google.maps.Map | null) {
    
  const zoomToRegion = useCallback((regionName: string, isHover: boolean = false) => {
    if (!mapInstance) return;

    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ 
      address: `${regionName}, Morocco`,
      bounds: new google.maps.LatLngBounds(
        new google.maps.LatLng(27.6666, -13.1683), 
        new google.maps.LatLng(35.9222, -0.9983)   
      )
    }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const bounds = results[0].geometry.viewport;
        
        // Ajuster les limites pour éviter un zoom trop proche
        const extendedBounds = new google.maps.LatLngBounds(bounds.getSouthWest(), bounds.getNorthEast());
        extendedBounds.extend(new google.maps.LatLng(
          bounds.getCenter().lat() + 0.1,
          bounds.getCenter().lng() + 0.1
        ));
        
        mapInstance.fitBounds(extendedBounds);
        
        setTimeout(() => {
          const currentZoom = mapInstance.getZoom() || 0;
          const maxZoom = isHover ? 11 : 12;
          const minZoom = 6;
          
          if (currentZoom > maxZoom) {
            mapInstance.setZoom(maxZoom);
          } else if (currentZoom < minZoom) {
            mapInstance.setZoom(minZoom);
          }
        }, 100);
      }
    });
  }, [mapInstance]);

  return { zoomToRegion };
}
