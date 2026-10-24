export type ServiceCategory = 'bridal' | 'party' | 'editorial' | 'engagement' | 'other'
export type PriceType = 'fixed' | 'range' | 'hidden'
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type BookingSource = 'booking_page' | 'whatsapp' | 'discovery'

export interface ArtistPublic {
  id: string
  slug: string
  name: string
  businessName: string | null
  bio: string | null
  tagline: string | null
  avatarUrl: string | null
  coverUrl: string | null
  instagramHandle: string | null
  city: string
  locality: string | null
  languages: string
  yearsOfExp: number
  isVerified: boolean
  themeColor: string
  showWhatsapp: boolean
  showBookingForm: boolean
  whatsappNumber: string | null
  services: ServicePublic[]
  portfolio: PortfolioPublic[]
  reviews: ReviewPublic[]
  avgRating: number
  totalReviews: number
}

export interface ServicePublic {
  id: string
  name: string
  description: string | null
  duration: number
  priceType: PriceType
  price: number | null
  priceMin: number | null
  priceMax: number | null
  category: ServiceCategory
}

export interface PortfolioPublic {
  id: string
  imageUrl: string
  caption: string | null
  category: string
  isFeatured: boolean
}

export interface ReviewPublic {
  id: string
  clientName: string
  rating: number
  comment: string | null
  eventType: string | null
  createdAt: string
}

export interface AuditReport {
  overallScore: number
  sections: AuditSection[]
  topPriority: string
  generatedAt: string
}

export interface AuditSection {
  name: string
  nameHi: string
  score: number
  maxScore: number
  status: 'good' | 'warning' | 'critical'
  finding: string
  findingHi: string
  fix: string
  fixHi: string
  impact: 'high' | 'medium' | 'low'
}

export interface DashboardStats {
  totalBookings: number
  pendingBookings: number
  thisMonthEarnings: number
  lastMonthEarnings: number
  totalPageViews: number
  thisWeekViews: number
  conversionRate: number
  totalClients: number
  avgRating: number
}

export interface BookingRequest {
  serviceId?: string
  clientName: string
  clientPhone: string
  clientEmail?: string
  eventDate: string
  eventType?: string
  eventLocation?: string
  notes?: string
}
