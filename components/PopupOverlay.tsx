"use client";
import React from 'react';
import { useRef, useEffect, useState } from 'react';
import PopupContainer from './PopupContainer';
import RegionsCard from './RegionsCard';
import ProjectCard from './ProjectCard';
import ArchitectCard from './ArchitectCard';
import ProjectDetails from './ProjectDetails';
import ArchitectDetails from './ArchitectDetails';
import { useMarkerAnimation } from '@/hooks/useMarkerAnimation';
import { useRegionZoom } from '@/hooks/useRegionZoom';
import { useNavStore } from '@/app/store/useNavStore';
import { useNavigation } from '@/hooks/useNavigation';
import { useConnectionStore } from '@/app/store/useConnectionStore';
import { useDataStore } from '@/app/store/useDataStore';
import { Building, Architect } from '@/types/map';
import { useSearchParams} from 'next/navigation'; 


interface PopupOverlayProps {
  onClose: () => void;
  mapInstance: google.maps.Map | null;
}

export default function PopupOverlay({ onClose, mapInstance }: PopupOverlayProps) {
  const { 
    activeNav, 
    selectedProject, 
    selectedArchitect,
    selectedRegion,
    navigateTo
  } = useNavStore();

  const { buildings, architects, fetchBuildings, fetchArchitects } = useDataStore();
  const { clearConnections } = useConnectionStore();

  const { 
    handleProjectNavigation, 
    handleArchitectNavigation,
    handleRegionNavigation,
    handleReset,
    updateURL 
  } = useNavigation();

  const contentRef = useRef<HTMLDivElement>(null);
  const { handleItemHover, cleanupMarkers } = useMarkerAnimation(mapInstance);
  const { zoomToRegion } = useRegionZoom(mapInstance);

  const [regions, setRegions] = useState<{ name: string; projectsCount: number }[]>([]);
  const searchParams = useSearchParams(); // Utilisez useSearchParams pour accéder aux paramètres de l'URL

  // Fetch buildings and architects on mount
  useEffect(() => {
    fetchBuildings();
    fetchArchitects();
  }, [fetchBuildings, fetchArchitects]);

  // Calculate regions based on buildings
  useEffect(() => {
    if (buildings.length > 0) {
      const regionsMap = new Map<string, number>();
      buildings.forEach(building => {
        const regionName = building.region;
        if (regionsMap.has(regionName)) {
          regionsMap.set(regionName, regionsMap.get(regionName)! + 1);
        } else {
          regionsMap.set(regionName, 1);
        }
      });
      const regionsArray = Array.from(regionsMap.entries()).map(([name, projectsCount]) => ({
        name,
        projectsCount
      }));
      setRegions(regionsArray);
    }
  }, [buildings]);

  // Highlight selected project when it changes
  useEffect(() => {
    if (selectedProject) {
      handleItemHover(selectedProject);
    } else {
      cleanupMarkers();
    }
  }, [selectedProject, handleItemHover, cleanupMarkers]);

  // Highlight selected architect's projects when it changes
  useEffect(() => {
    if (selectedArchitect) {
      const architectProjects = buildings.filter(
        building => building.architect_id === selectedArchitect.id
      );
      handleItemHover(selectedArchitect, architectProjects);
    } else {
      cleanupMarkers();
    }
  }, [selectedArchitect, buildings, handleItemHover, cleanupMarkers]);

  // Sync markers with URL on initial load
  useEffect(() => {
    const projectId = searchParams.get('project');
    const architectId = searchParams.get('architect');

    if (projectId) {
      const project = buildings.find(b => b.id === projectId);
      if (project) handleItemHover(project);
    }
    
    if (architectId) {
      const architect = architects.find(a => a.id === architectId);
      if (architect) {
        const projects = buildings.filter(b => b.architect_id === architectId);
        handleItemHover(architect, projects);
      }
    }
  }, [buildings, architects, handleItemHover, searchParams]);

  // Clear markers if URL no longer has project/architect params
  useEffect(() => {
    const hasProject = searchParams.has('project');
    const hasArchitect = searchParams.has('architect');

    if (!hasProject && !hasArchitect) {
      cleanupMarkers();
    }
  }, [searchParams, cleanupMarkers]);

  // Scroll to top when content changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [selectedProject, selectedArchitect, activeNav, selectedRegion]);

  const handleClose = () => {
    const hasProject = searchParams.has('project');
    const hasArchitect = searchParams.has('architect');

    // Only cleanup if closing without active params
    if (!hasProject && !hasArchitect) {
      cleanupMarkers();
    }
    
    clearConnections();
    onClose();
  };

  const handleBackClick = () => {
    clearConnections();
    if (selectedProject) {
      handleReset();
      updateURL({ view: 'buildings', project: null });
      return;
    }
    if (selectedArchitect) {
      handleReset();
      updateURL({ view: 'architects', architect: null });
      return;
    }
    if (selectedRegion && activeNav !== 'regions') {
      navigateTo({ nav: 'regions', region: null });
      updateURL({ view: 'regions' });
      return;
    }
  };

  const handleProjectClick = (building: Building) => {
    clearConnections();
    handleProjectNavigation(building);
    handleItemHover(building);
  };

  const handleArchitectClick = (architect: Architect) => {
    clearConnections();
    handleArchitectNavigation(architect);
    const architectProjects = buildings.filter(
      building => building.architect_id === architect.id
    );
    handleItemHover(architect, architectProjects);
  };

  const handleRegionClick = (region: { name: string; projectsCount: number }) => {
    clearConnections();
    cleanupMarkers();
    zoomToRegion(region.name, false);
    handleRegionNavigation(region.name);
  };

  const getBackButtonText = () => {
    if (selectedProject) return 'BACK TO BUILDINGS';
    if (selectedArchitect) return 'BACK TO ARCHITECTS';
    return 'NAVIGATE BY REGION';
  };

  const getFilteredBuildings = () => {
    if (selectedRegion) {
      return buildings.filter(building => building.region === selectedRegion);
    }
    return buildings;
  };

  const getFilteredArchitects = () => {
    if (selectedRegion) {
      const architectsInRegion = new Set<string>();
      buildings.forEach(building => {
        if (building.region === selectedRegion) {
          architectsInRegion.add(building.architect_id);
        }
      });
      return architects.filter(architect => architectsInRegion.has(architect.id));
    }
    return architects;
  };

  const renderContent = () => {
    if (selectedProject) {
      return (
        <ProjectDetails 
          project={selectedProject} 
          architects={architects}
          onArchitectClick={handleArchitectClick}
        />
      );
    }

    if (selectedArchitect) {
      const architectProjects = buildings.filter(
        building => building.architect_id === selectedArchitect.id
      );
      return (
        <ArchitectDetails 
          architect={selectedArchitect}
          projects={architectProjects}
          onProjectClick={handleProjectClick}
          onProjectHover={handleItemHover}
          onMount={(projects) => handleItemHover(selectedArchitect, projects)}
          onUnmount={cleanupMarkers}
          mapInstance={mapInstance}
          showPopup={true}
        />
      );
    }

    if (activeNav === 'regions') {
      return (
        <div className="flex flex-col gap-2">
          {regions.map((region) => (
            <RegionsCard
              key={region.name}
              regionName={region.name}
              projectsCount={region.projectsCount}
              onHover={() => zoomToRegion(region.name, true)}
              onClick={() => handleRegionClick(region)}
            />
          ))}
        </div>
      );
    }

    const filteredBuildings = getFilteredBuildings();
    const filteredArchitects = getFilteredArchitects();

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => {
                clearConnections();
                navigateTo({ nav: 'buildings' });
                updateURL({ view: 'buildings' });
              }}
              className={`text-sm transition-colors ${
                activeNav === 'buildings' 
                  ? 'text-[#C42644] font-semibold' 
                  : 'text-gray-500 hover:text-[#C42644]'
              }`}
            >
              Buildings
            </button>
            <button 
              onClick={() => {
                clearConnections();
                navigateTo({ nav: 'architects' });
                updateURL({ view: 'architects' });
              }}
              className={`text-sm transition-colors ${
                activeNav === 'architects' 
                  ? 'text-[#C42644] font-semibold' 
                  : 'text-gray-500 hover:text-[#C42644]'
              }`}
            >
              Architects
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {activeNav === 'buildings' ? (
            filteredBuildings.map((building) => {
              const architect = architects.find(arch => arch.id === building.architect_id);
              return (
                <div 
                  key={building.id}
                  onMouseEnter={() => handleItemHover(building)}
                  onMouseLeave={() => handleItemHover(null)}
                  className="cursor-pointer"
                  onClick={() => handleProjectClick(building)}
                >
                  <ProjectCard
                    imageSrc={building.images[0]}
                    title={building.name}
                    year={building.year_built.toString()}
                    architectName={architect?.name}
                  />
                </div>
              );
            })
          ) : (
            filteredArchitects.map((architect) => {
              const architectProjects = buildings.filter(
                building => building.architect_id === architect.id
              );

              // Calculate city statistics
              const cityCounts = architectProjects.reduce((acc, project) => {
                acc[project.city] = (acc[project.city] || 0) + 1;
                return acc;
              }, {} as Record<string, number>);
            
              const cityEntries = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);
              const primaryCity = cityEntries[0]?.[0];
              const primaryCityCount = cityEntries[0]?.[1] || 0;
              const otherCitiesCount = architectProjects.length - primaryCityCount;
            
              return (
                <div
                  key={architect.id}
                  className="cursor-pointer"
                  onMouseEnter={() => handleItemHover(architect, architectProjects)}
                  onMouseLeave={() => handleItemHover(null)}
                  onClick={() => handleArchitectClick(architect)}
                >
                  <ArchitectCard
                    imageSrc={architect.image_url}
                    architect={architect.name}
                    projectsCount={architectProjects.length}
                    primaryCity={primaryCity}
                    primaryCityCount={primaryCityCount}
                    otherCitiesCount={otherCitiesCount > 0 ? otherCitiesCount : undefined}
                  />
                </div>
              );
            })
          )}
        </div>
      </>
    );
  };

  return (
    <PopupContainer
      title={
        <div className="flex justify-between items-center w-full px-1.5 font-medium text-[13px] leading-[14.06px] tracking-[0.03em]">
          {(selectedRegion && activeNav !== 'regions') || selectedProject || selectedArchitect ? (
            <button onClick={handleBackClick}>
              ← {getBackButtonText()}
            </button>
          ) : (
            <span 
              className={`flex items-center gap-1 ${activeNav === 'regions' ? 'text-[#C42644]' : 'hover:text-[#9B1E35] cursor-pointer'}`} 
              onClick={activeNav === 'regions' ? undefined : () => {
                clearConnections();
                navigateTo({ nav: 'regions' });
                updateURL({ view: 'regions' });
              }}
            >
              {activeNav === 'regions' ? 'NAVIGATE BY REGION' : '← NAVIGATE BY REGION'}
            </span>
          )}
        </div>
      } 
      onClose={handleClose}
    >
      <div className='px-2' ref={contentRef}> 
        {renderContent()}
      </div>
    </PopupContainer>
  );
}