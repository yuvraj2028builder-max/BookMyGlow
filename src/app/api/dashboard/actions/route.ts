import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.artistId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { action, id, ...data } = body

    if (action === 'create_service') {
      const service = await db.service.create({
        data: {
          artistId: session.artistId,
          name: data.name,
          description: data.description,
          duration: data.duration ? parseInt(data.duration) : 60,
          priceType: data.priceType || 'fixed',
          price: data.price ? parseInt(data.price) : null,
          priceMin: data.priceMin ? parseInt(data.priceMin) : null,
          priceMax: data.priceMax ? parseInt(data.priceMax) : null,
          category: data.category || 'bridal'
        }
      })
      return NextResponse.json({ success: true, service })
    }

    if (action === 'delete_service') {
      await db.service.delete({
        where: { id, artistId: session.artistId }
      })
      return NextResponse.json({ success: true })
    }

    if (action === 'update_booking_status') {
      const updated = await db.booking.update({
        where: { id, artistId: session.artistId },
        data: { status: data.status }
      })

      // If marked completed with totalAmount, log into earnings automatically!
      if (data.status === 'completed' && updated.totalAmount) {
        await db.earning.create({
          data: {
            artistId: session.artistId,
            amount: updated.totalAmount,
            description: `Payment for booking: ${updated.clientName}`,
            date: new Date(),
            category: updated.eventType || 'Makeup Service'
          }
        }).catch(e => console.warn('Earning log auto-sync error:', e))
      }

      return NextResponse.json({ success: true, booking: updated })
    }

    if (action === 'add_earning') {
      const earning = await db.earning.create({
        data: {
          artistId: session.artistId,
          amount: parseInt(data.amount),
          description: data.description,
          date: data.date ? new Date(data.date) : new Date(),
          category: data.category || 'Bridal'
        }
      })
      return NextResponse.json({ success: true, earning })
    }

    if (action === 'save_client') {
      const client = await db.client.create({
        data: {
          artistId: session.artistId,
          name: data.name,
          phone: data.phone,
          email: data.email,
          skinType: data.skinType,
          allergies: data.allergies,
          preferences: data.preferences,
          notes: data.notes,
          weddingDate: data.weddingDate ? new Date(data.weddingDate) : null
        }
      })
      return NextResponse.json({ success: true, client })
    }

    if (action === 'add_portfolio') {
      const item = await db.portfolioItem.create({
        data: {
          artistId: session.artistId,
          imageUrl: data.imageUrl,
          caption: data.caption,
          category: data.category || 'bridal',
          isFeatured: data.isFeatured || false
        }
      })
      return NextResponse.json({ success: true, item })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('Artist action error:', error)
    return NextResponse.json({ error: 'Failed to process action' }, { status: 500 })
  }
}
