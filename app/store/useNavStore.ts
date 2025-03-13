import { create } from 'zustand';
import { Building, Architect } from '@/types/map';

type ViewType = 'regions' | 'buildings' | 'architects';

interface NavState {
  showPopup: boolean;
  activeNav: ViewType;
  selectedProject: Building | null;
  selectedArchitect: Architect | null;
  selectedRegion: string | null;
  setShowPopup: (show: boolean) => void;
  setActiveNav: (nav: ViewType) => void;
  setSelectedProject: (project: Building | null) => void;
  setSelectedArchitect: (architect: Architect | null) => void;
  setSelectedRegion: (region: string | null) => void;
  reset: () => void;
  navigateTo: (params: {
    nav?: ViewType;
    project?: Building | null;
    architect?: Architect | null;
    region?: string | null;
  }) => void;
}

export const useNavStore = create<NavState>((set) => ({
  showPopup: true,
  activeNav: 'regions',
  selectedProject: null,
  selectedArchitect: null,
  selectedRegion: null,
  setShowPopup: (show) => set({ showPopup: show }),
  setActiveNav: (nav) => set({ activeNav: nav }),
  setSelectedProject: (project) => set({ selectedProject: project }),
  setSelectedArchitect: (architect) => set({ selectedArchitect: architect }),
  setSelectedRegion: (region) => set({ selectedRegion: region }),
reset: () => set({
  selectedProject: null,
  selectedArchitect: null,
  selectedRegion: null,
}),
navigateTo: ({ nav, project, architect, region }) => {
  const updates: Partial<NavState> = {};
  
  if (nav) updates.activeNav = nav;
  updates.selectedProject = project ?? null;
  updates.selectedArchitect = architect ?? null;
  updates.selectedRegion = region ?? null;
  
  set(state => ({
    ...state,
    ...updates
  }));
},
}));