export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      architects: {
        Row: {
          id: string
          name: string
          image_url: string
          nationality: string
          graduation_date: string
          authorization_date: string
          description: string
          education: Json
          office_locations: Json[]
          created_at?: string
        }
        Insert: {
          id?: string
          name: string
          image_url: string
          nationality: string
          graduation_date: string
          authorization_date: string
          description: string
          education: Json
          office_locations: Json[]
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          image_url?: string
          nationality?: string
          graduation_date?: string
          authorization_date?: string
          description?: string
          education?: Json
          office_locations?: Json[]
          created_at?: string
        }
      }
      buildings: {
        Row: {
          id: string
          name: string
          images: string[]
          year_built: number
          position: Json
          architect_id: string
          city: string
          description: string
          region: string
          created_at?: string
        }
        Insert: {
          id?: string
          name: string
          images: string[]
          year_built: number
          position: Json
          architect_id: string
          city: string
          description: string
          region: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          images?: string[]
          year_built?: number
          position?: Json
          architect_id?: string
          city?: string
          description?: string
          region?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}