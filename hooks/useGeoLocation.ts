'use client';

import { useState, useCallback } from 'react';
import { LatLng } from '@/types/geo';

export function useGeolocation() {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const getUserLocation = useCallback((): Promise<LatLng> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = 'Geolocation is not supported by your browser';
        setLocationError(error);
        reject(new Error(error));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(location);
            setLocationError(null);
            resolve(location);
          },
          (error) => {
            setLocationError(error.message);
            setUserLocation(null);
            reject(error);
          }
        );
      }
    });
  }, []);

  return { userLocation, locationError, getUserLocation };
}

