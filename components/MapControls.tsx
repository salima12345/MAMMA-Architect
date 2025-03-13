'use client';

import { Button } from './ui/Button';
import {  Plus, Minus, MapPin } from 'lucide-react';
import { ViewMode } from '../types/map';
import { MAP_CONSTANTS } from '../types/map';

interface MapControlsProps {
  viewMode: ViewMode;
  showConnections: boolean;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleViewMode: () => void;
  onToggleConnections: () => void;
  onGetUserLocation: () => void;
  isLoadingLocation: boolean;
  isLocationActive: boolean;
}

export function MapControls({

  zoom,
  onZoomIn,
  onZoomOut,
 
  onGetUserLocation,
  isLoadingLocation,
  isLocationActive,
}: MapControlsProps) {
  return (
    <>
    

      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 flex flex-col gap-2">
        <Button
          variant="outline"
          className="rounded-full p-2 bg-transparent hover:bg-[#C42644] hover:text-white group"
          onClick={onZoomIn}
          disabled={zoom >= MAP_CONSTANTS.MAX_ZOOM_LEVEL}
          style={{ borderColor: MAP_CONSTANTS.BORDER_COLOR }}
        >
          <Plus className="h-6 w-6 text-[#C42644] group-hover:text-white" />
        </Button>
        <Button
          variant="outline"
          className="rounded-full p-2 bg-transparent hover:bg-[#C42644] hover:text-white group"
          onClick={onZoomOut}
          disabled={zoom <= MAP_CONSTANTS.MIN_ZOOM_LEVEL}
          style={{ borderColor: MAP_CONSTANTS.BORDER_COLOR }}
        >
          <Minus className="h-6 w-6 text-[#C42644] group-hover:text-white" />
        </Button>
        <Button
          variant={isLocationActive ? 'default' : 'outline'}
          className={`rounded-full p-2 group ${
            isLocationActive ? 'bg-[#C42644] text-white' : 'bg-transparent hover:bg-[#C42644] hover:text-white group'
          }`}
          onClick={onGetUserLocation}
          disabled={isLoadingLocation}
          style={{ borderColor: MAP_CONSTANTS.BORDER_COLOR }}
        >
          <MapPin
            className={`h-5 w-5 ${
              isLocationActive ? 'text-white' : 'text-[#C42644] group-hover:text-white'
            }`}
          />
        </Button>
      </div>
    </>
  );
}
