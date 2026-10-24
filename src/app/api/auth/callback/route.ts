import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { db } from '@/lib/db'
import { signToken } from '@/lib/auth'
import { generateSlug } from '@/lib/utils'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  // Exchange code for session
  const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.exchangeCodeForSession(code)

  if (sessionError || !sessionData?.user) {
    console.error('OAuth callback error:', sessionError)
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
  }

  const user = sessionData.user
  const email = user.email!
  const name = user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0]
  const picture = user.user_metadata?.avatar_url || user.user_metadata?.picture || null

  try {
    // Find or create artist in our DB
    let artist = await db.artist.findFirst({ where: { OR: [{ email }] } })

    if (!artist) {
      const baseSlug = generateSlug(name)
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
          name,
          businessName: `${name} Studio`,
          slug,
          avatarUrl: picture,
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
              }
            ]
          }
        }
      })
    }

    const token = signToken({ artistId: artist.id })
    const res = NextResponse.redirect(`${origin}/dashboard`)

    res.cookies.set('bmg_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })

    return res
  } catch (error) {
    console.error('Callback DB error:', error)
    return NextResponse.redirect(`${origin}/login?error=db_error`)
  }
}
