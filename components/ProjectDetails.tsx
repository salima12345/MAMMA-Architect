"use client";
import { useState,useEffect } from 'react';
import { Building, Architect } from '@/types/map';

import Cta from './ui/Cta';
import ImageModal from './ImageModal';
import Image from 'next/image'; 

interface ProjectDetailsProps {
  project: Building;
  architects: Architect[];
  onArchitectClick: (architect: Architect) => void;
  onProjectHover?: (project: Building | null) => void;
}

export default function ProjectDetails({ project, architects, onArchitectClick, onProjectHover }: ProjectDetailsProps) {
  useEffect(() => {
    if (onProjectHover) {
      onProjectHover(project);
    }
  }, [project, onProjectHover]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fix: Add optional chaining and nullish checks
  const architect = architects.find(a => a.id === project.architect_id);
  const allImages = [...project.images, ...project.images];

  const handleOpenModal = () => {
    setCurrentImageIndex(2);
    setIsModalOpen(true);
  };

  const handleNext = () => {
    setCurrentImageIndex(prev => Math.min(prev + 1, allImages.length - 1));
  };

  const handlePrevious = () => {
    setCurrentImageIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <>
      {/* Hero Image Section */}
      <div className="h-[219px] w-full flex gap-2">
        <div className="w-2/3 h-full relative">
          <Image
            src={allImages[0]}
            alt={`${project.name} - Main View`}
            fill
            className="object-cover rounded-[5px]"
            sizes="(max-width: 768px) 100vw, 50vw" 
            priority={true}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=" 

          />
        </div>
        
        <div className="w-1/3 h-full flex flex-col gap-1">
          <div className="h-1/2 relative">
            <Image
              src={allImages[1]}
              alt={`${project.name} - Secondary View`}
              fill
              className="object-cover rounded-[5px]"
              sizes="(max-width: 768px) 100vw, 25vw"
              priority={true}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=" 
            />
          </div>
          <div className="h-1/2 relative">
            <Image
              src={allImages[2]}
              alt={`${project.name} - Additional View`}
              fill
              className="object-cover rounded-[5px]"
              sizes="(max-width: 768px) 100vw, 25vw"
              priority={true}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=" 
            />
            {allImages.length > 3 && (
              <div 
                className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer group rounded-[5px]"
                onClick={handleOpenModal}
              >
                <span className="text-white text-xl font-medium">
                  +{allImages.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="py-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-[23px]">{project.name}</h3>
        </div>
        <p className="text-[18px]">{project.year_built}</p>
      </div>

      {/* Architect Information Section */}
      {architect && (
        <div 
          className="flex flex-col gap-4 py-4 border-y border-y-[#B0B0B0] relative group cursor-pointer hover:bg-gray-50"
          onClick={() => onArchitectClick?.(architect)}
        >
          <div className="flex gap-4">
         <div className="relative w-[70px] h-[70px]">
              {architect.image_url ? (
                <Image
                  src={architect.image_url}
                  alt={architect.name}
                  fill
                  className="rounded-full object-cover"
                  sizes="70px" 
                  priority={true}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=" 
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl text-gray-400">
                    {architect.name.charAt(0)}
                  </span>
                </div>
              )}
           
         </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-medium text-lg">{architect.name}</h4>
              <p className='font-semibold text-[12px] text-[#B0B0B0] leading-[14.06px] tracking-[0.01em]'>
                See More about {architect.name}
              </p>
              <Cta />
            </div>
          </div>
        </div>
      )}
      <p className='pt-1'>{project.description}</p>

      <ImageModal
        images={allImages}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentIndex={currentImageIndex}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </>
  );
}