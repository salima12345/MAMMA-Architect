import { useRef, useCallback, useState, useEffect } from 'react';
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer';
import { Building, Architect, ViewMode } from '@/types/map';
import { CLUSTERER_CONFIG } from '@/utils/constants';
import { supabase } from '@/lib/supabase';

export const useMarkerClusterer = () => {
  const markerClustererRef = useRef<MarkerClusterer | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [architects, setArchitects] = useState<Architect[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch buildings
        const { data: buildingsData, error: buildingsError } = await supabase
          .from('buildings')
          .select('*');

        if (buildingsError) throw buildingsError;

        // Fetch architects
        const { data: architectsData, error: architectsError } = await supabase
          .from('architects')
          .select('*');

        if (architectsError) throw architectsError;

        // Transform the data to match our types
        const transformedBuildings = buildingsData.map(building => ({
          id: building.id,
          name: building.name,
          position: building.position as { lat: number; lng: number },
          description: building.description,
          year_built: building.year_built,
          architect_id: building.architect_id,
          region: building.region,
          images: building.images,
          city: building.city
        }));

        const transformedArchitects = architectsData.map(architect => ({
          id: architect.id,
          name: architect.name,
          position: (architect.office_locations?.[0] || { lat: 0, lng: 0 }) as { lat: number; lng: number },
          image_url: architect.image_url,
          description: architect.description,
          education: architect.education as any
        }));

        setBuildings(transformedBuildings);
        setArchitects(transformedArchitects);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const createClusterer = useCallback((
    map: google.maps.Map, 
    viewMode: ViewMode,
    onSelect: (item: Building | Architect) => void
  ) => {
    if (!map || loading) return;

    if (markerClustererRef.current) {
      markerClustererRef.current.clearMarkers();
    }

    const items = viewMode === 'buildings' ? buildings : architects;
    
    // Make sure we have valid position data
    const validItems = items.filter(item => 
      item.position && 
      typeof item.position.lat === 'number' && 
      typeof item.position.lng === 'number'
    );

    const markers = validItems.map((item) => {
      const marker = new google.maps.Marker({
        position: item.position,
        icon: CLUSTERER_CONFIG.markerOptions.icon
      });

      marker.addListener('click', () => onSelect(item));
      return marker;
    });

    markerClustererRef.current = new MarkerClusterer({
      map,
      markers,
      algorithm: new SuperClusterAlgorithm({
        maxZoom: CLUSTERER_CONFIG.maxZoom,
        radius: CLUSTERER_CONFIG.radius
      }),
      renderer: {
        render: ({ count, position }) => 
          new google.maps.Marker({
            position,
            icon: {
              ...CLUSTERER_CONFIG.markerOptions.icon,
              scale: Math.min(12, 5 + Math.log(count) * 2),
            },
            label: {
              text: String(count),
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 'bold'
            },
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
          })
      }
    });
  }, [buildings, architects, loading]);

  return { 
    createClusterer,
    buildings,
    architects,
    loading
  };
};