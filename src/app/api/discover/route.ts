import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const locality = searchParams.get('locality')
    const category = searchParams.get('category')
    const maxBudget = searchParams.get('maxBudget')

    const artists = await db.artist.findMany({
      where: {
        isActive: true,
        ...(locality && locality !== 'all' ? { locality } : {})
      },
      include: {
        services: true,
        reviews: true,
        portfolio: { take: 3 }
      }
    })

    const transformed = artists.map(artist => {
      const avgRating = artist.reviews.length > 0
        ? artist.reviews.reduce((acc, r) => acc + r.rating, 0) / artist.reviews.length
        : 5.0

      const startingPrice = artist.services.reduce((min, s) => {
        const p = s.price || s.priceMin || 999999
        return p < min ? p : min
      }, 999999)

      return {
        id: artist.id,
        slug: artist.slug,
        name: artist.name,
        businessName: artist.businessName,
        tagline: artist.tagline,
        avatarUrl: artist.avatarUrl,
        city: artist.city,
        locality: artist.locality,
        yearsOfExp: artist.yearsOfExp,
        isVerified: artist.isVerified,
        avgRating,
        totalReviews: artist.reviews.length,
        startingPrice: startingPrice === 999999 ? null : startingPrice,
        portfolioPreview: artist.portfolio.map(p => p.imageUrl),
        servicesCount: artist.services.length
      }
    }).filter(a => {
      if (maxBudget && a.startingPrice && a.startingPrice > parseInt(maxBudget)) {
        return false
      }
      return true
    })

    return NextResponse.json({ artists: transformed })
  } catch (error) {
    console.error('Discover error:', error)
    return NextResponse.json({ error: 'Failed to fetch directory' }, { status: 500 })
  }
}
