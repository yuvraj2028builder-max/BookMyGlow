import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await req.json()
    const { serviceId, clientName, clientPhone, clientEmail, eventDate, eventType, eventLocation, notes } = body

    if (!clientName || !clientPhone || !eventDate) {
      return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 })
    }

    const artist = await db.artist.findUnique({
      where: { slug },
      include: { services: true }
    })

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 })
    }

    const service = serviceId ? artist.services.find(s => s.id === serviceId) : null
    const totalAmount = service?.price || service?.priceMin || null

    const booking = await db.booking.create({
      data: {
        artistId: artist.id,
        serviceId: service?.id || null,
        clientName,
        clientPhone,
        clientEmail: clientEmail || null,
        eventDate: new Date(eventDate),
        eventType: eventType || null,
        eventLocation: eventLocation || null,
        notes: notes || null,
        status: 'pending',
        source: 'booking_page',
        totalAmount
      }
    })

    // Upsert or create client in CRM
    await db.client.create({
      data: {
        artistId: artist.id,
        name: clientName,
        phone: clientPhone,
        email: clientEmail || null,
        weddingDate: eventType?.toLowerCase().includes('wedding') ? new Date(eventDate) : null,
        notes: notes || null
      }
    }).catch(e => console.warn('Client CRM sync error:', e))

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error('Booking submission error:', error)
    return NextResponse.json({ error: 'Failed to record booking' }, { status: 500 })
  }
}
