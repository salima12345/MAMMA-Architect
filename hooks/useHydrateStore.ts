import { useEffect } from 'react';
import { useDataStore } from '@/app/store/useDataStore';
import { useNavStore } from '@/app/store/useNavStore';
import { useNavigation } from '@/hooks/useNavigation';
import { ViewType } from '@/utils/constants';

// hooks/useHydrateStore.ts
export function useHydrateStore() {
    const { buildings, architects } = useDataStore();
    const { 
      setActiveNav,
      setSelectedRegion,
      setSelectedArchitect,
      setSelectedProject,
      navigateTo
    } = useNavStore();
    const { updateURL } = useNavigation();
  
    useEffect(() => {
      if (buildings.length === 0 || architects.length === 0) return;
  
      const params = new URLSearchParams(window.location.search);
      
      // Hydrate view mode
      const view = params.get('view') as ViewType || 'regions';
      setActiveNav(view);
  
      // Hydrate region
      const region = params.get('region');
      if (region) setSelectedRegion(region);
  
      // Hydrate architect
      const architectId = params.get('architect');
      if (architectId) {
        const architect = architects.find(a => a.id === architectId);
        if (architect) {
          setSelectedArchitect(architect);
        } else {
          updateURL({ architect: null });
        }
      }
  
      // Hydrate project
      const projectId = params.get('project');
      if (projectId) {
        const project = buildings.find(b => b.id === projectId);
        if (project) {
          setSelectedProject(project);
        } else {
          updateURL({ project: null });
        }
      }
    }, [buildings, architects]);
  }