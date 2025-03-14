"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { GraduationCap, User } from 'lucide-react';
import { Architect, Building } from '@/types/map';
import ProjectCard from './ProjectCard';
import AccordianButton from './ui/AccordianButton';
import { useMarkerAnimation } from '@/hooks/useMarkerAnimation';
import { useConnectionStore } from '@/app/store/useConnectionStore';

interface ArchitectDetailsProps {
  architect: Architect;
  projects?: Building[];
  mapInstance: google.maps.Map | null;
  onProjectClick?: (project: Building) => void;
  onProjectHover?: (project: Building | null) => void;
  onMount?: (projects: Building[]) => void;
  onUnmount?: () => void;
  showPopup?: boolean;
}

interface PathInfo {
  points: google.maps.LatLng[];
  controlPoint: google.maps.LatLng;
}

function ArchitectDetails({
  architect = {
    id: "0",
    name: '',
    position: { lat: 0, lng: 0 },
    image_url: '',
    description: '',
    education: {
      school: '',
      position: { lat: 0, lng: 0 },
      year: ''
    }
  },
  projects = [],
  mapInstance,
  onProjectClick,
  onProjectHover,
  onMount,
  onUnmount,
  showPopup = true
}: ArchitectDetailsProps) {
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const { cleanupMarkers } = useMarkerAnimation(mapInstance);
  const [hoveredProject, setHoveredProject] = useState<Building | null>(null);
  const [pathsInfo, setPathsInfo] = useState<PathInfo[]>([]);
  const animationRef = useRef<number[]>([]);
  const [imageError, setImageError] = useState(false);
  
  const { 
    connections, 
    showConnections, 
    addConnection, 
    setShowConnections, 
    clearConnections 
  } = useConnectionStore();

  useEffect(() => {
    if (!showPopup) {
      clearConnections();
      setPathsInfo([]);
    }
    return () => {
      animationRef.current.forEach(cancelAnimationFrame);
      animationRef.current = [];
      clearConnections();
      setPathsInfo([]);
      cleanupMarkers();
      onUnmount?.();
    };
  }, [showPopup, clearConnections, cleanupMarkers, onUnmount]);

  const generateControlPoint = (
    start: google.maps.LatLng,
    end: google.maps.LatLng,
    index: number
  ): google.maps.LatLng => {
    const mid = new google.maps.LatLng(
      (start.lat() + end.lat()) / 2,
      (start.lng() + end.lng()) / 2
    );

    const dx = end.lng() - start.lng();
    const dy = end.lat() - start.lat();
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    
    const perpendicularAngle = angle + (index % 2 === 0 ? Math.PI/2 : -Math.PI/2);
    const offset = distance * 0.3;

    return new google.maps.LatLng(
      mid.lat() + Math.sin(perpendicularAngle) * offset,
      mid.lng() + Math.cos(perpendicularAngle) * offset
    );
  };

  const createCurvedPath = (
    start: google.maps.LatLng,
    end: google.maps.LatLng,
    index: number
  ): google.maps.LatLng[] => {
    const points: google.maps.LatLng[] = [];
    const steps = 200;
    const controlPoint = generateControlPoint(start, end, index);

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lat = (1 - t) * (1 - t) * start.lat() + 
                  2 * (1 - t) * t * controlPoint.lat() + 
                  t * t * end.lat();
      const lng = (1 - t) * (1 - t) * start.lng() + 
                  2 * (1 - t) * t * controlPoint.lng() + 
                  t * t * end.lng();
      points.push(new google.maps.LatLng(lat, lng));
    }

    setPathsInfo(prev => [...prev, { points, controlPoint }]);
    return points;
  };

  const animateConnection = (line: google.maps.Polyline) => {
    let offset = 0;
    const animate = () => {
      offset = (offset + 0.05) % 100;
      line.set('icons', [{
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 1.5,
          fillColor: '#C42644',
          fillOpacity: 0.8,
          strokeColor: 'white',
          strokeWeight: 0.5,
        },
        offset: `${offset}%`,
        repeat: '7px'
      }]);
      animationRef.current.push(requestAnimationFrame(animate));
    };
    animate();
  };
  
  const createConnection = (
    start: google.maps.LatLng,
    end: google.maps.LatLng,
    index: number
  ): google.maps.Polyline => {
    const path = createCurvedPath(start, end, index);
    
    const line = new google.maps.Polyline({
      path: path,
      geodesic: false,
      strokeOpacity: 0,
      strokeWeight: 0,
      icons: [{
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 1.5,
          fillColor: '#C42644',
          fillOpacity: 0.8,
          strokeColor: 'white',
          strokeWeight: 0.5,
        },
        offset: '0%',
        repeat: '7px'
      }],
      map: mapInstance,
      zIndex: 1
    });
  
    animateConnection(line);
    return line;
  };

  const toggleEducationConnections = () => {
    if (!mapInstance || !architect.education.position) return;
    
    if (showConnections) {
      animationRef.current.forEach(cancelAnimationFrame);
      animationRef.current = [];
      clearConnections();
      setPathsInfo([]);
      return;
    }

    const schoolPos = new google.maps.LatLng(
      architect.education.position.lat,
      architect.education.position.lng
    );

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(schoolPos);

    projects.forEach((project, index) => {
      if (project.position) {
        const projectPos = new google.maps.LatLng(
          project.position.lat,
          project.position.lng
        );
        bounds.extend(projectPos);
        const line = createConnection(schoolPos, projectPos, index);
        addConnection(line);
      }
    });

    mapInstance.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    setShowConnections(true);
  };

  const projectsByCity = projects.reduce((acc, project) => {
    if (!acc[project.city]) {
      acc[project.city] = [];
    }
    acc[project.city].push(project);
    return acc;
  }, {} as Record<string, Building[]>);

  const toggleCity = (city: string) => {
    setExpandedCity(expandedCity === city ? null : city);
  };

  const handleProjectHover = (project: Building | null) => {
    if (!project) {
      cleanupMarkers();
    }
    setHoveredProject(project);
    onProjectHover?.(project);
  };

  const handleProjectClick = (project: Building) => {
    clearConnections();
    setPathsInfo([]);
    onProjectClick?.(project);
  };

  const EmptyImageState = () => (
    <div className="w-full h-full rounded-[5px] bg-gray-100 flex items-center justify-center">
      <User className="w-12 h-12 text-gray-400" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="relative w-[116px] h-[116px] border-[5px] border-white flex-shrink-0 rounded-[5px]">
          {!architect.image_url || imageError ? (
            <EmptyImageState />
          ) : (
            <Image
              src={architect.image_url}
              alt={architect.name ?? "architect"}
              className="rounded-[5px] object-cover"
              fill
              sizes="116px"
              priority={true}
              loading="eager"
              quality={75} 
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
              onError={() => setImageError(true)}
            />
          )}
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-[20px] leading-[24.2px]">
            {architect.name}
          </h4>
          <div className="space-y-2">
            <div
              className={`flex gap-2 cursor-pointer transition-colors ${
                showConnections ? 'text-[#C42644]' : 'text-[#B0B0B0] hover:text-[#C42644]'
              }`}
              onClick={toggleEducationConnections}
            >
              <GraduationCap size={25} className="flex-shrink-0 mt-0.5" />
              <p className="font-semibold text-[10px] leading-[20px] tracking-[0.02em] underline decoration-solid uppercase">
                {architect.education?.school ?? 'Unknown School'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-[14px] leading-[20px] tracking-[0.02em]">
          {architect.description}
        </p>
      </div>
      {projects.length > 0 && (
        <div className="space-y-3">
          <div className="border-y border-y-[#B0B0B0] py-3">
            {Object.entries(projectsByCity).map(([city, cityProjects]) => (
              <div key={city} className="mb-4 last:mb-0">
                <div
                  onClick={() => toggleCity(city)}
                  className="w-full flex items-center justify-between py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <span className="font-semibold text-[16px] leading-[16.94px]">
                    {cityProjects.length} Projects in {city}:
                  </span>
                  <AccordianButton isExpanded={expandedCity === city} />
                </div>
                {expandedCity === city && (
                  <div className="space-y-3 pt-2">
                    {cityProjects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => handleProjectClick(project)}
                        onMouseEnter={() => handleProjectHover(project)}
                        onMouseLeave={() => handleProjectHover(null)}
                        className="cursor-pointer"
                      >
                        <ProjectCard
                          imageSrc={project.images?.[0]}
                          title={project.name}
                          year={project.year_built.toString()}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ArchitectDetails;