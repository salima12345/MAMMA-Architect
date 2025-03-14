import React, { useState } from 'react';
import Image from 'next/image';
import Cta from './ui/Cta';
import { ImageOff } from 'lucide-react';

interface ArchitectCardProps {
  imageSrc: string;
  architect: string;
  projectsCount: number;
  primaryCity?: string;
  primaryCityCount?: number;
  otherCitiesCount?: number;
}

const ArchitectCard: React.FC<ArchitectCardProps> = ({
  imageSrc,
  architect,
  projectsCount,
  primaryCity,
  primaryCityCount,
  otherCitiesCount,
}) => {
  const [imageError, setImageError] = useState(false);

  if (!imageSrc) {
    return (
      <div className="bg-white rounded-[10px] py-[8px] px-2 cursor-pointer flex gap-3 hover:border hover:border-[#C42644] relative group">
        <div className="relative w-[75px] h-[75px] flex-shrink-0">
          <div className="w-full h-full rounded-[5px] bg-gray-100 flex items-center justify-center">
            <ImageOff className="w-6 h-6 text-gray-400" />
          </div>
        </div>
        <div className="flex flex-col flex-grow min-w-0 h-[75px]">
          <h4 className="text-[16px] font-semibold truncate">{architect}</h4>
          <h3 className='text-[#B0B0B0] font-semibold text-[14px]'>{projectsCount} projects in Morocco</h3>
          <div className='flex items-end justify-between'>
            <div className='flex items-center gap-2'>
              {primaryCity && primaryCityCount && (
                <div className='border border-[#D9D9D9] rounded-[5px] p-1 font-semibold text-xs leading-[14.06px] tracking-[-0.05em] text-[#D9D9D9]'>
                  {primaryCityCount} projects in {primaryCity}
                </div>
              )}
              {otherCitiesCount && (
                <div className='border border-[#D9D9D9] rounded-[5px] p-1 font-semibold text-xs leading-[14.06px] tracking-[-0.05em] text-[#D9D9D9]'>
                  +{otherCitiesCount}
                </div>
              )}
            </div>
            <Cta />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[10px] py-[8px] px-2 cursor-pointer flex gap-3 hover:border hover:border-[#C42644] relative group">
      <div className="relative w-[75px] h-[75px] flex-shrink-0">
        {imageError ? (
          <div className="w-full h-full rounded-[5px] bg-gray-100 flex items-center justify-center">
            <ImageOff className="w-6 h-6 text-gray-400" />
          </div>
        ) : (
          <Image
            src={imageSrc}
            alt={architect}
            fill
            className="rounded-[5px] object-cover"
            sizes="75px"
            priority={true}
            placeholder="blur"
            loading="eager"
            quality={75} 
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="flex flex-col flex-grow min-w-0 h-[75px]">
        <h4 className="text-[16px] font-semibold truncate">{architect}</h4>
        <h3 className='text-[#B0B0B0] font-semibold text-[14px]'>{projectsCount} projects in Morocco</h3>
        <div className='flex items-end justify-between'>
          <div className='flex items-center gap-2'>
            {primaryCity && primaryCityCount && (
              <div className='border border-[#D9D9D9] rounded-[5px] p-1 font-semibold text-xs leading-[14.06px] tracking-[-0.05em] text-[#D9D9D9]'>
                {primaryCityCount} projects in {primaryCity}
              </div>
            )}
            {otherCitiesCount && (
              <div className='border border-[#D9D9D9] rounded-[5px] p-1 font-semibold text-xs leading-[14.06px] tracking-[-0.05em] text-[#D9D9D9]'>
                +{otherCitiesCount}
              </div>
            )}
          </div>
          <Cta />
        </div>
      </div>
    </div>
  );
};

export default ArchitectCard;