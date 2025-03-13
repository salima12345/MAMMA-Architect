import React, { useState } from 'react';
import Image from 'next/image';
import Cta from './ui/Cta';
import { ImageOff } from 'lucide-react';

interface ProjectCardProps {
  imageSrc: string;
  title: string;
  year?: string;
  architectName?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ imageSrc, title, year, architectName }) => {
  const [imageError, setImageError] = useState(false);

  // If imageSrc is empty, show empty state immediately
  if (!imageSrc) {
    return (
      <div className="bg-white rounded-[10px] px-[8px] py-2 cursor-pointer text-[#C42644] flex gap-3 hover:border hover:border-[#C42644] relative group">
        <div className="relative w-[75px] h-[75px] flex-shrink-0">
          <div className="w-full h-full rounded-[5px] bg-gray-100 flex items-center justify-center">
            <ImageOff className="w-6 h-6 text-gray-400" />
          </div>
        </div>
        <div className="flex flex-col flex-grow min-w-0">
          <h4 className="text-[16px] font-semibold truncate text-foreground">{title}</h4>
          <h3 className="text-[#B0B0B0] font-semibold text-[14px] truncate">{architectName}</h3>
          <p className="text-[#B0B0B0] truncate">{year}</p>
        </div>
        <div className='absolute bottom-2 right-2'>
          <Cta />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[10px] px-[8px] py-2 cursor-pointer text-[#C42644] flex gap-3 hover:border hover:border-[#C42644] relative group">
      <div className="relative w-[75px] h-[75px] flex-shrink-0">
        {imageError ? (
          <div className="w-full h-full rounded-[5px] bg-gray-100 flex items-center justify-center">
            <ImageOff className="w-6 h-6 text-gray-400" />
          </div>
        ) : (
          <Image
            src={imageSrc}
            alt={title ?? "project"}
            fill
            className="rounded-[5px] object-cover"
            sizes="75px"
            priority={true}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="flex flex-col flex-grow min-w-0">
        <h4 className="text-[16px] font-semibold truncate text-foreground">{title}</h4>
        <h3 className="text-[#B0B0B0] font-semibold text-[14px] truncate">{architectName}</h3>
        <p className="text-[#B0B0B0] truncate">{year}</p>
      </div>
      <div className='absolute bottom-2 right-2'>
        <Cta />
      </div>
    </div>
  );
};

export default ProjectCard;