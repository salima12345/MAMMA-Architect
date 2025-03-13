import { create } from 'zustand';
import { Building, Architect } from '@/types/map';
import { supabase } from '@/lib/supabase';

interface DataStore {
  buildings: Building[];
  architects: Architect[];
  loading: boolean;
  error: string | null;
  fetchBuildings: () => Promise<void>;
  fetchArchitects: () => Promise<void>;
}

export const useDataStore = create<DataStore>((set) => ({
  buildings: [],
  architects: [],
  loading: false,
  error: null,

  fetchBuildings: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('buildings')
        .select('*');
       
      console.log('Fetched buildings:', data); 
      
      if (error) throw error;
      set({ buildings: data, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchArchitects: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('architects')
        .select('*');

      if (error) throw error;

      set({ architects: data, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));