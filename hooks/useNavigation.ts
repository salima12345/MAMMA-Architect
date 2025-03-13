"use client";
import { useRouter } from 'next/navigation';
import { useNavStore } from '@/app/store/useNavStore';
import { Building, Architect } from '@/types/map';
export const useNavigation = () => {
  const router = useRouter();
  const { navigateTo, reset } = useNavStore();

// hooks/useNavigation.ts
const updateURL = (params: {
  view?: string | null;
  region?: string | null;
  architect?: string | null;
  project?: string | null;
}) => {
  const newParams = new URLSearchParams();

  // Always set the view
  if (params.view) {
    newParams.set('view', params.view);
  }

  // Conditionally add other parameters
  if (params.region) {
    newParams.set('region', params.region);
  }
  if (params.architect) {
    newParams.set('architect', params.architect);
  }
  if (params.project) {
    newParams.set('project', params.project);
  }

  router.push(`?${newParams.toString()}`, { scroll: false });
};

 // hooks/useNavigation.ts
const handleProjectNavigation = (building: Building) => {
  navigateTo({
    nav: 'buildings',
    project: building,
    architect: null,
  });
  updateURL({ 
    view: 'buildings',
    project: building.id,
    region: null,
    architect: null,
  });
};

const handleArchitectNavigation = (architect: Architect) => {
  navigateTo({
    nav: 'architects',
    project: null,
    architect: architect,
  });
  updateURL({
    view: 'architects',
    architect: architect.id,
    project: null,
  });
};

const handleRegionNavigation = (regionName: string) => {
  navigateTo({
    nav: 'buildings',
    project: null,
    architect: null,
    region: regionName,
  });
  updateURL({ 
    view: 'buildings', 
    region: regionName,
    project: null,
    architect: null,
  });
};

  const handleReset = () => {
    reset();
    updateURL({ view: 'regions' });
  };

  return {
    updateURL,
    handleProjectNavigation,
    handleArchitectNavigation,
    handleRegionNavigation,
    handleReset,
  };
};