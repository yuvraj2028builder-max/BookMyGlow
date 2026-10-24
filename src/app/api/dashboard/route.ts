import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session?.artistId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const artist = await db.artist.findUnique({
      where: { id: session.artistId },
      include: {
        services: { orderBy: { sortOrder: 'asc' } },
        portfolio: { orderBy: { sortOrder: 'asc' } },
        bookings: { orderBy: { eventDate: 'desc' }, include: { service: true } },
        reviews: { orderBy: { createdAt: 'desc' } },
        earnings: { orderBy: { date: 'desc' } },
        clients: { orderBy: { createdAt: 'desc' } },
        auditResults: { orderBy: { createdAt: 'desc' }, take: 1 },
        pageViews: true
      }
    })

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 })
    }

    // Calculations for Earnings Tracker & Stats
    const totalBookings = artist.bookings.length
    const pendingBookings = artist.bookings.filter(b => b.status === 'pending').length
    
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const thisMonthEarnings = artist.earnings
      .filter(e => {
        const d = new Date(e.date)
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear
      })
      .reduce((acc, curr) => acc + curr.amount, 0)

    const lastMonthEarnings = artist.earnings
      .filter(e => {
        const d = new Date(e.date)
        const lm = currentMonth === 0 ? 11 : currentMonth - 1
        const ly = currentMonth === 0 ? currentYear - 1 : currentYear
        return d.getMonth() === lm && d.getFullYear() === ly
      })
      .reduce((acc, curr) => acc + curr.amount, 0)

    const totalPageViews = artist.pageViews.length
    const conversionRate = totalPageViews > 0 ? ((totalBookings / totalPageViews) * 100).toFixed(1) : '0'

    const avgRating = artist.reviews.length > 0
      ? artist.reviews.reduce((acc, r) => acc + r.rating, 0) / artist.reviews.length
      : 5.0

    return NextResponse.json({
      artist,
      stats: {
        totalBookings,
        pendingBookings,
        thisMonthEarnings,
        lastMonthEarnings,
        totalPageViews,
        conversionRate: parseFloat(conversionRate),
        totalClients: artist.clients.length,
        avgRating
      }
    })
  } catch (error) {
    console.error('Dashboard load error:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session?.artistId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const updated = await db.artist.update({
      where: { id: session.artistId },
      data: {
        name: body.name,
        businessName: body.businessName,
        tagline: body.tagline,
        bio: body.bio,
        whatsappNumber: body.whatsappNumber,
        instagramHandle: body.instagramHandle?.replace(/^@/, ''),
        city: body.city,
        locality: body.locality,
        yearsOfExp: body.yearsOfExp ? parseInt(body.yearsOfExp) : undefined,
        showWhatsapp: body.showWhatsapp,
        showBookingForm: body.showBookingForm,
        avatarUrl: body.avatarUrl,
        coverUrl: body.coverUrl
      }
    })

    return NextResponse.json({ success: true, artist: updated })
  } catch (error) {
    console.error('Update artist profile error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
