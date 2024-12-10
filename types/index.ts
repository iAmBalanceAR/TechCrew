export type Issue = {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'closed'
  priority: 'low' | 'medium' | 'high'
  assigned_to: string | null
  reported_by: string
  related_item_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  closed_at: string | null
  reporter?: {
    email: string
    full_name: string
  }
}

export type IssueFormData = {
  title: string
  description: string
  status: 'open' | 'in_progress' | 'closed'
  priority: 'low' | 'medium' | 'high'
  assigned_to?: string | null
  related_item_id?: string | null
  notes?: string | null
}

export interface Schedule {
  id: string
  date: string
  band_id: string | null
  band_name: string | null
  show_time: string
  tech_id: string
  tech_name: string | null
  created_at: string
  updated_at: string
  bands?: {
    name: string
  }
}

export interface ScheduleFormData {
  date: string
  band_id?: string
  band_name?: string
  show_time: string
  tech_name?: string | null
  is_band_override: boolean
}

export interface GigLog {
  id: string
  date: string
  band_id: string
  venue: string
  notes: string | null
  tech_id: string
  created_at: string
  updated_at: string
  bands?: {
    name: string
  }
}

export interface GigLogFormData {
  date: string
  band_id: string
  venue: string
  notes?: string | null
}

export interface Band {
  id: string
  name: string
  home_location: string
  members: number
  last_played: string | null
  notes: string | null
  input_lists: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface BandFormData {
  name: string
  home_location: string
  members: number
  last_played?: string | null
  notes?: string | null
  input_lists?: string | null
} 