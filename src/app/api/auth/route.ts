import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, verifyPassword, signToken, getSession } from '@/lib/auth'
import { generateSlug } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { action, email, password, name, phone, instagramHandle, city, locality } = await req.json()

    if (action === 'signup') {
      if (!email || !password || !name || !phone) {
        return NextResponse.json({ error: 'All primary fields are required' }, { status: 400 })
      }

      const existing = await db.artist.findFirst({
        where: { OR: [{ email }, { phone }] }
      })

      if (existing) {
        return NextResponse.json({ error: 'Email or phone number already registered' }, { status: 400 })
      }

      const baseSlug = generateSlug(name)
      let slug = baseSlug
      let counter = 1
      while (await db.artist.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }

      const passwordHash = await hashPassword(password)

      const artist = await db.artist.create({
        data: {
          email,
          phone,
          passwordHash,
          name,
          slug,
          instagramHandle: instagramHandle ? instagramHandle.replace(/^@/, '') : null,
          whatsappNumber: phone,
          city: city || 'Delhi NCR',
          locality: locality || 'South Delhi',
          tagline: 'Bridal & Editorial Makeup Artist',
          bio: 'Crafting bespoke bridal looks with luxury skin finishes. Available for destination and Delhi NCR bookings.',
          services: {
            create: [
              {
                name: 'Signature HD Bridal Glam',
                category: 'bridal',
                description: 'Full HD airbrush finish, 3D lashes, jewelry & dupatta draping + touchup kit.',
                priceType: 'fixed',
                price: 25000,
                duration: 180
              },
              {
                name: 'Sangeet / Cocktail Glam',
                category: 'party',
                description: 'Luminous glowy skin, glitter eyes, modern hair styling.',
                priceType: 'fixed',
                price: 12000,
                duration: 120
              },
              {
                name: 'Engagement Look',
                category: 'engagement',
                description: 'Soft dewy finish, romantic hair updos, eyelash extensions.',
                priceType: 'range',
                priceMin: 15000,
                priceMax: 18000,
                duration: 150
              }
            ]
          }
        }
      })

      const token = signToken({ artistId: artist.id })
      const res = NextResponse.json({ success: true, artist: { id: artist.id, slug: artist.slug, name: artist.name } })
      res.cookies.set('bmg_token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 30 })
      return res
    }

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
      }

      const artist = await db.artist.findFirst({
        where: { OR: [{ email }, { phone: email }] }
      })

      if (!artist) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const valid = await verifyPassword(password, artist.passwordHash)
      if (!valid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const token = signToken({ artistId: artist.id })
      const res = NextResponse.json({ success: true, artist: { id: artist.id, slug: artist.slug, name: artist.name } })
      res.cookies.set('bmg_token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 30 })
      return res
    }

    if (action === 'logout') {
      const res = NextResponse.json({ success: true })
      res.cookies.set('bmg_token', '', { httpOnly: true, path: '/', maxAge: 0 })
      return res
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  const session = await getSession()
  if (!session?.artistId) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  const artist = await db.artist.findUnique({
    where: { id: session.artistId },
    select: {
      id: true,
      slug: true,
      name: true,
      email: true,
      phone: true,
      businessName: true,
      bio: true,
      tagline: true,
      avatarUrl: true,
      coverUrl: true,
      instagramHandle: true,
      whatsappNumber: true,
      city: true,
      locality: true,
      yearsOfExp: true,
      isVerified: true,
      showWhatsapp: true,
      showBookingForm: true
    }
  })

  return NextResponse.json({ authenticated: true, artist })
}
