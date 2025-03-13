import React from 'react';
import { ArrowRight } from 'lucide-react';

interface RegionsCardProps {
  regionName: string;
  projectsCount: number;
  onHover: (regionName: string) => void;
  onClick: (regionName: string) => void;
}

const RegionsCard: React.FC<RegionsCardProps> = ({ regionName, projectsCount, onHover, onClick }) => {
  return (
    <div 
      className="bg-white rounded-[10px] px-3 py-2 cursor-pointer text-[#C42644] hover:bg-[#C42644] hover:text-white transition-colors duration-300 flex flex-col h-full"
      onMouseEnter={() => onHover(regionName)}
      onMouseLeave={() => onHover('')}
      onClick={() => onClick(regionName)}
    >
      <div className="flex-grow">
        <h3 className="font-bold text-[18px] leading-[38px] tracking-[0.01em]">{regionName}</h3>
        <p className="text-[14px]">
          {projectsCount} {projectsCount > 1 ? "architectural projects" : "architectural project"}
        </p>
      </div>
      <div className="flex justify-end items-center text-[14px] font-medium ">
        <span>Discover projects</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
};

export default RegionsCard;

