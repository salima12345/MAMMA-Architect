"use client"; 
import { useSearchParams } from 'next/navigation'; 
import { useNavStore } from '@/app/store/useNavStore'; 

export function MapTitle() {
  const searchParams = useSearchParams();
  const { selectedProject, selectedArchitect, selectedRegion } = useNavStore();

  const getTitle = () => {
    if (selectedProject) {
      return `Mapping of ${selectedProject.name}`;
    }

    if (selectedArchitect) {
      return `Mapping of buildings by ${selectedArchitect.name}`;
    }

    if (selectedRegion) {
      return `Mapping of buildings in ${selectedRegion}`;
    }

    const viewParam = searchParams.get('view');
    if (viewParam === 'regions') {
      return 'Mapping by regions';
    } else if (viewParam) {
      return `Mapping of ${viewParam}`;
    }
    return 'Mapping of buildings';
  };

  return (
    <h1 className="absolute top-4 left-4 z-30 font-medium text-[12px] leading-[14.06px] tracking-[0.03em] py-3 uppercase text-[#C42644]">
      {getTitle()}
    </h1>
  );
}