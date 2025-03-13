import { useCallback, useRef, useState } from "react";
import { Building, Architect } from "@/types/map";

export function useMarkerAnimation(mapInstance: google.maps.Map | null) {
  const [hoveredItem, setHoveredItem] = useState<Building | Architect | null>(null);
  const markersRef = useRef<{
    markers: Array<{
      marker: google.maps.Marker;
      outerMarker: google.maps.Marker;
      infoWindow: google.maps.InfoWindow;
    }>;
  }>({ markers: [] });
  const animationFrameRef = useRef<number>();

  const cleanupMarkers = useCallback(() => {
    markersRef.current.markers.forEach(({ marker, outerMarker, infoWindow }) => {
      marker.setMap(null);
      outerMarker.setMap(null);
      infoWindow.close();
    });
    markersRef.current.markers = [];

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
  }, []);

  const createMarker = useCallback(
    (item: Building | Architect, map: google.maps.Map, animate: boolean = true) => {
      const marker = new google.maps.Marker({
        position: item.position,
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "#C42644",
          fillOpacity: animate ? 1 : 0.5,
          strokeWeight: 0,
          scale: 8,
        },
        zIndex: 1000,
      });

      const outerMarker = new google.maps.Marker({
        position: item.position,
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "#C42644",
          fillOpacity: animate ? 0.26 : 0,
          strokeWeight: 0,
          scale: 16,
        },
        zIndex: 999,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(item),
      });

      marker.addListener("click", () => infoWindow.open(map, marker));
      outerMarker.addListener("click", () => infoWindow.open(map, marker));

      return { marker, outerMarker, infoWindow };
    },
    []
  );

  const createInfoWindowContent = (item: Building | Architect) => {
    return `
      <div class="max-w-[300px]">
        <div class="relative w-full h-[160px] mb-3 rounded-lg overflow-hidden">
        <img
          src="${'images' in item ? item.images?.[0] ?? 'placeholder.jpg' : 'image_url' in item ? item.image_url : 'placeholder.jpg'}"
          alt="${item.name}"
          style="width: 100%; height: 100%; object-fit: cover;"
        />
      </div>
        <h3 class="font-semibold text-base mb-1">${item.name}</h3>
        ${'architect' in item ? `<p class="text-sm text-gray-600 mb-2">${item.architect}</p>` : ''}
        <a
          href="https://www.google.com/maps/search/?api=1&query=${item.position.lat},${item.position.lng}"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-[#C42644] flex items-center gap-1"
          style="text-decoration: none;"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          View in Google Maps
        </a>
      </div>
    `;
  };

  const fitMapToMarkers = useCallback(
    (positions: Array<{ lat: number; lng: number }>) => {
      if (!mapInstance || positions.length === 0) return;
      const bounds = new google.maps.LatLngBounds();
      positions.forEach(position => bounds.extend(position));
      mapInstance.fitBounds(bounds, 100); 
    },
    [mapInstance]
  );

  const displayMarkers = useCallback(
    (items: (Building | Architect)[], shouldAnimate: boolean = false, shouldZoom: boolean = false) => {
      if (!mapInstance) return;
      cleanupMarkers();

      const markerRefs = items.map(item => createMarker(item, mapInstance, shouldAnimate));
      markersRef.current.markers = markerRefs;

      if (shouldZoom) {
        fitMapToMarkers(items.map(item => item.position));
      }

      if (shouldAnimate) {
        let scale = 16;
        let increasing = true;

        const animate = () => {
          if (markersRef.current.markers.length === 0) return;

          scale = increasing ? scale + 0.3 : scale - 0.3;
          if (scale >= 24) increasing = false;
          if (scale <= 16) increasing = true;

          markersRef.current.markers.forEach(({ outerMarker }) => {
            outerMarker.setIcon({
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#C42644",
              fillOpacity: 0.26,
              strokeWeight: 0,
              scale: scale,
            });
          });

          animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();
      }
    },
    [mapInstance, cleanupMarkers, createMarker, fitMapToMarkers]
  );

  const handleItemHover = useCallback(
    (item: Building | Architect | null, projects?: Building[]) => {
      const urlParams = new URLSearchParams(window.location.search);
      const architectIdParam = urlParams.get("architect");
      
      // Check if the item is an architect with the same ID as the URL parameter
      if (architectIdParam && item && 'id' in item && item.id === architectIdParam) {
        cleanupMarkers();
        return;
      }
  
      setHoveredItem(item);
  
      if (!item) {
        cleanupMarkers();
        return;
      }
  
      const itemsToMark = projects || [item];
      displayMarkers(itemsToMark, true, true);
    },
    [displayMarkers, cleanupMarkers]
  );
  

  const showArchitectProjects = useCallback(
    (projects: Building[]) => {
      displayMarkers(projects, false, false);
    },
    [displayMarkers]
  );

  return {
    handleItemHover,
    showArchitectProjects,
    cleanupMarkers,
    hoveredItem,
  };
}