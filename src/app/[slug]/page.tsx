import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import BookingPage from '@/components/booking-page'
import type { ArtistPublic } from '@/lib/types'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const artist = await db.artist.findUnique({
    where: { slug },
    select: { name: true, businessName: true, tagline: true, bio: true }
  })

  if (!artist) return { title: 'Artist Not Found — BookMyGlow' }

  const displayName = artist.businessName || artist.name
  return {
    title: `${displayName} | Bridal Makeup Artist Delhi NCR`,
    description: artist.tagline || artist.bio || `Book appointments and view portfolio of ${displayName} in Delhi NCR.`,
    openGraph: {
      title: `${displayName} — Makeup Artist Delhi NCR`,
      description: artist.tagline || 'View portfolio and book directly.'
    }
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Log page view
  try {
    const foundArtist = await db.artist.findUnique({ where: { slug }, select: { id: true } })
    if (foundArtist) {
      await db.pageView.create({
        data: {
          artistId: foundArtist.id
        }
      })
    }
  } catch (e) {
    console.warn('Page view logging failed:', e)
  }

  const artistData = await db.artist.findUnique({
    where: { slug },
    include: {
      services: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
      portfolio: { orderBy: { sortOrder: 'asc' } },
      reviews: { where: { isVisible: true }, orderBy: { createdAt: 'desc' } }
    }
  })

  if (!artistData) {
    notFound()
  }

  const avgRating = artistData.reviews.length > 0
    ? artistData.reviews.reduce((acc, r) => acc + r.rating, 0) / artistData.reviews.length
    : 5.0

  const artistPublic: ArtistPublic = {
    id: artistData.id,
    slug: artistData.slug,
    name: artistData.name,
    businessName: artistData.businessName,
    bio: artistData.bio,
    tagline: artistData.tagline,
    avatarUrl: artistData.avatarUrl,
    coverUrl: artistData.coverUrl,
    instagramHandle: artistData.instagramHandle,
    city: artistData.city,
    locality: artistData.locality,
    languages: artistData.languages,
    yearsOfExp: artistData.yearsOfExp,
    isVerified: artistData.isVerified,
    themeColor: artistData.themeColor,
    showWhatsapp: artistData.showWhatsapp,
    showBookingForm: artistData.showBookingForm,
    whatsappNumber: artistData.whatsappNumber,
    services: artistData.services.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      duration: s.duration,
      priceType: s.priceType as any,
      price: s.price,
      priceMin: s.priceMin,
      priceMax: s.priceMax,
      category: s.category as any
    })),
    portfolio: artistData.portfolio.map(p => ({
      id: p.id,
      imageUrl: p.imageUrl,
      caption: p.caption,
      category: p.category,
      isFeatured: p.isFeatured
    })),
    reviews: (artistData.reviews || []).map(r => ({
      id: r.id,
      clientName: r.clientName,
      rating: r.rating,
      comment: r.comment,
      eventType: r.eventType,
      createdAt: typeof r.createdAt === 'string' ? r.createdAt : new Date(r.createdAt || Date.now()).toISOString()
    })),
    avgRating,
    totalReviews: artistData.reviews.length
  }

  return <BookingPage artist={artistPublic} />
}
