export interface FloodSurvey {
  id: string
  created_at: string
  
  // Location
  area_name: string
  address: string | null
  city: string
  postal_code: string | null
  latitude: number | null
  longitude: number | null
  
  // Flood Details
  flood_date: string
  water_level_cm: number | null
  flood_duration_hours: number | null
  flood_frequency: 'first_time' | 'yearly' | 'multiple_yearly' | 'monthly' | null
  
  // Impact
  property_damage: boolean
  damage_estimate_usd: number | null
  people_affected: number | null
  evacuation_required: boolean
  
  // Disadvantages
  loss_of_income: boolean
  health_issues: boolean
  displacement: boolean
  infrastructure_damage: boolean
  contaminated_water: boolean
  power_outage: boolean
  road_blockage: boolean
  crop_damage: boolean
  
  // Additional Info
  disadvantages_description: string | null
  support_received: string | null
  immediate_needs: string | null
  
  // Contact
  respondent_name: string | null
  contact_phone: string | null
  contact_email: string | null
  
  // Metadata
  severity_level: 'minor' | 'moderate' | 'severe' | 'critical'
  status: 'pending' | 'reviewed' | 'verified' | 'resolved'
}

export type FloodSurveyInsert = Omit<FloodSurvey, 'id' | 'created_at'>

export interface DashboardStats {
  totalSurveys: number
  totalAffected: number
  totalDamage: number
  criticalCases: number
  areaBreakdown: { area: string; count: number }[]
  severityBreakdown: { severity: string; count: number }[]
  disadvantagesBreakdown: { type: string; count: number }[]
  recentSurveys: FloodSurvey[]
}
