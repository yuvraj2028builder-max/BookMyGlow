import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { signToken } from '@/lib/auth'
import { generateSlug } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { credential, userInfo } = await req.json()

    let email = userInfo?.email
    let name = userInfo?.name
    let picture = userInfo?.picture

    // If Google ID token credential provided, decode the JWT payload
    if (credential && !email) {
      try {
        const payloadBase64 = credential.split('.')[1]
        const decoded = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf-8'))
        email = decoded.email
        name = decoded.name
        picture = decoded.picture
      } catch (err) {
        console.warn('Failed to parse Google JWT payload:', err)
      }
    }

    if (!email) {
      return NextResponse.json({ error: 'Google authentication failed — no email provided' }, { status: 400 })
    }

    // Check if artist already exists with this Google email
    let artist = await db.artist.findFirst({
      where: { OR: [{ email }] }
    })

    if (!artist) {
      // First time Google Sign In -> Auto register artist
      const baseSlug = generateSlug(name || email.split('@')[0])
      let slug = baseSlug
      let counter = 1
      while (await db.artist.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }

      artist = await db.artist.create({
        data: {
          email,
          phone: '',
          passwordHash: 'google_oauth_user',
          name: name || 'Makeup Artist',
          businessName: `${name || 'Artist'} Studio`,
          slug,
          avatarUrl: picture || null,
          city: 'Delhi NCR',
          locality: 'South Delhi',
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
    }

    const token = signToken({ artistId: artist.id })
    const res = NextResponse.json({
      success: true,
      artist: { id: artist.id, slug: artist.slug, name: artist.name }
    })
    
    // Set 30-day session cookie
    res.cookies.set('bmg_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    })

    return res
  } catch (error) {
    console.error('Google Auth API error:', error)
    return NextResponse.json({ error: 'Google sign-in failed' }, { status: 500 })
  }
}
