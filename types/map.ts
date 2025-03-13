import { LatLng } from './geo';

export interface Education {
  school: string;
  position: LatLng;
  year: string;
}


export interface Building {

  id: string;

  name: string;

  position: {

    lat: number;

    lng: number;

  };

  description: string;

  year_built: number;

  architect_id:string;
  region:string;

  images: string[];

  city:string;

}



export interface Architect {
  id: string;
  name: string;
  position: LatLng;
  image_url: string;
  description: string;
  education: Education;
}
export interface BuildingDetails {
  project: Building;
  architects: Architect[]; 
}

export type ViewMode = 'buildings' | 'architects';


export const MAP_CONSTANTS = {
  MARKER_COLOR: '#C42644',
  BORDER_COLOR: '#C42644',
  MIN_ZOOM_LEVEL: 4.3,
  MAX_ZOOM_LEVEL: 15,
  CLUSTER_ZOOM_LEVEL: 10,
  LINK_ZOOM_LEVEL: 4,
} as const;
