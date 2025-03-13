'use client';

import { useEffect, useRef, useState } from 'react';
import { OverlayView, InfoWindow } from '@react-google-maps/api';
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer';
import { ViewMode, MAP_CONSTANTS } from '@/types/map';
import UserLocationMarker from './UserLocationMarker';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useDataStore } from '@/app/store/useDataStore';

interface MapMarkersProps {
  mapInstance: google.maps.Map | null;
  viewMode: ViewMode;
  showUserLocation: boolean;
  userLocation: google.maps.LatLngLiteral | null;
}

export default function MapMarkers({
  mapInstance,
  viewMode,
  showUserLocation,
  userLocation,
}: MapMarkersProps) {
  const markerClustererRef = useRef<MarkerClusterer | null>(null);
  const [clickedMarker, setClickedMarker] = useState<any | null>(null);
  const searchParams = useSearchParams();
  const { buildings, architects } = useDataStore();

useEffect(() => {
  if (!mapInstance) return;

  const initializeMarkers = async () => {
    const { Marker } = (await google.maps.importLibrary('marker')) as google.maps.MarkerLibrary;

    const architectId = searchParams.get('architect');
    const items = viewMode === 'buildings' ? buildings : architects;

    // Filter by architect ID if architectId is provided
    const filteredItems =
      viewMode === 'buildings' && architectId
        ? items.filter((item) => 'architect_id' in item && item.architect_id === architectId)
        : items;

    // Filter out items with invalid positions
    const validItems = filteredItems.filter(
      (item) => item.position?.lat && item.position?.lng
    );

    const markers = validItems.map((item) => {
      const marker = new Marker({
        position: item.position,
        map: mapInstance,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: MAP_CONSTANTS.MARKER_COLOR,
          fillOpacity: 0.8,
          strokeWeight: 2,
          strokeColor: '#FFFFFF',
          scale: 8,
        },
      });

      marker.addListener('click', () => {
        setClickedMarker(item);
      });

      return marker;
    });

    markerClustererRef.current = new MarkerClusterer({
      map: mapInstance,
      markers,
      algorithm: new SuperClusterAlgorithm({
        maxZoom: 14,
        radius: 60,
      }),
      renderer: {
        render: ({ count, position }) =>
          new Marker({
            position,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: MAP_CONSTANTS.MARKER_COLOR,
              fillOpacity: 0.8,
              strokeWeight: 2,
              strokeColor: '#FFFFFF',
              scale: Math.min(12, 5 + Math.log(count) * 2),
            },
            label: {
              text: String(count),
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 'bold',
            },
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
          }),
      },
    });
  };

  initializeMarkers();

  return () => {
    if (markerClustererRef.current) {
      markerClustererRef.current.clearMarkers();
    }
  };
}, [mapInstance, viewMode, searchParams, buildings, architects]);

  return (
    <>
      {showUserLocation && userLocation && (
        <OverlayView position={userLocation} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
          <UserLocationMarker position={userLocation} />
        </OverlayView>
      )}

      {clickedMarker && (
        <InfoWindow position={clickedMarker.position} onCloseClick={() => setClickedMarker(null)}>
          <div className="max-w-[500px]">
            <div className="relative w-full h-[160px] mb-3 rounded-lg overflow-hidden">
              <Image
                src={clickedMarker.images[0]}
                alt={clickedMarker.name}
                fill
                className="object-cover"
                sizes="500px"
              />
            </div>
            <h3 className="font-semibold text-base mb-1">{clickedMarker.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{clickedMarker.architect}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${clickedMarker.position.lat},${clickedMarker.position.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#C42644] flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              View in Google Maps
            </a>
          </div>
        </InfoWindow>
      )}
    </>
  );
}