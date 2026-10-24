import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Dual DB engine:
// 1. If SUPABASE credentials are provided in .env -> uses live cloud Postgres on Supabase
// 2. If not yet provided -> automatically falls back to zero-crash local file store

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null

const DB_PATH = path.join(process.cwd(), 'data')
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true })
}

function getTableFile(table: string) {
  const filePath = path.join(DB_PATH, `${table}.json`)
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]), 'utf-8')
  }
  return filePath
}

function readTable<T = any>(table: string): T[] {
  try {
    const file = getTableFile(table)
    const content = fs.readFileSync(file, 'utf-8')
    return JSON.parse(content || '[]')
  } catch (err) {
    return []
  }
}

function writeTable<T = any>(table: string, data: T[]): void {
  const file = getTableFile(table)
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8')
}

export const db = {
  artist: {
    findUnique: async ({ where, select, include }: { where: { id?: string; slug?: string; email?: string }; select?: any; include?: any }) => {
      if (supabase) {
        let query = supabase.from('artists').select('*, services(*), portfolio:portfolio_items(*), bookings(*), reviews(*), clients(*), earnings(*)')
        if (where.id) query = query.eq('id', where.id)
        if (where.slug) query = query.eq('slug', where.slug)
        if (where.email) query = query.eq('email', where.email)
        const { data } = await query.maybeSingle()
        if (data) return data
      }
      const all = readTable('artists')
      return all.find(a => (where.id && a.id === where.id) || (where.slug && a.slug === where.slug) || (where.email && a.email === where.email)) || null
    },
    findFirst: async ({ where, select, include }: { where: any; select?: any; include?: any }) => {
      if (supabase && where.OR) {
        for (const cond of where.OR) {
          let q = supabase.from('artists').select('*')
          if (cond.email) q = q.eq('email', cond.email)
          if (cond.phone) q = q.eq('phone', cond.phone)
          const { data } = await q.maybeSingle()
          if (data) return data
        }
      }
      const all = readTable('artists')
      if (where.OR) {
        return all.find(a => where.OR.some((cond: any) => 
          (cond.email && a.email === cond.email) || 
          (cond.phone && a.phone === cond.phone)
        )) || null
      }
      return all[0] || null
    },
    findMany: async ({ where, select, include }: { where?: any; select?: any; include?: any } = {}) => {
      if (supabase) {
        let q = supabase.from('artists').select('*, services(*), reviews(*), portfolio:portfolio_items(*)')
        if (where?.locality && where.locality !== 'all') {
          q = q.eq('locality', where.locality)
        }
        const { data } = await q
        if (data && data.length > 0) return data
      }
      let all = readTable('artists')
      if (where?.locality && where.locality !== 'all') {
        all = all.filter(a => a.locality === where.locality)
      }
      return all
    },
    create: async ({ data }: { data: any }) => {
      const id = 'art_' + Math.random().toString(36).substring(2, 9)
      const newArtist = {
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isVerified: true,
        isActive: true,
        showWhatsapp: true,
        showBookingForm: true,
        yearsOfExp: 4,
        services: [],
        portfolio: [],
        bookings: [],
        reviews: [],
        earnings: [],
        clients: [],
        auditResults: [],
        pageViews: [],
        ...data
      }
      if (data.services?.create) {
        newArtist.services = data.services.create.map((s: any) => ({
          id: 'srv_' + Math.random().toString(36).substring(2, 9),
          artistId: id,
          ...s
        }))
      }

      if (supabase) {
        try {
          await supabase.from('artists').insert([{
            id,
            slug: newArtist.slug,
            email: newArtist.email,
            phone: newArtist.phone || '',
            password_hash: newArtist.passwordHash,
            name: newArtist.name,
            business_name: newArtist.businessName,
            bio: newArtist.bio,
            tagline: newArtist.tagline,
            avatar_url: newArtist.avatarUrl,
            city: newArtist.city,
            locality: newArtist.locality
          }])
        } catch (e) {
          console.warn('Supabase insert warning:', e)
        }
      }

      const all = readTable('artists')
      all.push(newArtist)
      writeTable('artists', all)
      return newArtist
    },
    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      if (supabase) {
        try {
          await supabase.from('artists').update(data).eq('id', where.id)
        } catch (e) {
          console.warn(e)
        }
      }
      const all = readTable('artists')
      const idx = all.findIndex(a => a.id === where.id)
      if (idx === -1) throw new Error('Not found')
      all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() }
      writeTable('artists', all)
      return all[idx]
    }
  },

  service: {
    create: async ({ data }: { data: any }) => {
      const allArtists = readTable('artists')
      const artist = allArtists.find(a => a.id === data.artistId)
      const service = {
        id: 'srv_' + Math.random().toString(36).substring(2, 9),
        ...data,
        createdAt: new Date().toISOString()
      }
      if (artist) {
        artist.services = artist.services || []
        artist.services.push(service)
        writeTable('artists', allArtists)
      }
      return service
    },
    delete: async ({ where }: { where: { id: string; artistId: string } }) => {
      const allArtists = readTable('artists')
      const artist = allArtists.find(a => a.id === where.artistId)
      if (artist && artist.services) {
        artist.services = artist.services.filter((s: any) => s.id !== where.id)
        writeTable('artists', allArtists)
      }
      return true
    }
  },

  booking: {
    create: async ({ data }: { data: any }) => {
      const allArtists = readTable('artists')
      const artist = allArtists.find(a => a.id === data.artistId)
      const booking = {
        id: 'bkg_' + Math.random().toString(36).substring(2, 9),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      if (artist) {
        artist.bookings = artist.bookings || []
        artist.bookings.unshift(booking)
        writeTable('artists', allArtists)
      }
      return booking
    },
    update: async ({ where, data }: { where: { id: string; artistId: string }; data: any }) => {
      const allArtists = readTable('artists')
      const artist = allArtists.find(a => a.id === where.artistId)
      if (artist && artist.bookings) {
        const b = artist.bookings.find((item: any) => item.id === where.id)
        if (b) {
          Object.assign(b, data, { updatedAt: new Date().toISOString() })
          writeTable('artists', allArtists)
          return b
        }
      }
      return null
    }
  },

  client: {
    create: async ({ data }: { data: any }) => {
      const allArtists = readTable('artists')
      const artist = allArtists.find(a => a.id === data.artistId)
      const client = {
        id: 'clt_' + Math.random().toString(36).substring(2, 9),
        ...data,
        createdAt: new Date().toISOString()
      }
      if (artist) {
        artist.clients = artist.clients || []
        artist.clients.unshift(client)
        writeTable('artists', allArtists)
      }
      return client
    }
  },

  earning: {
    create: async ({ data }: { data: any }) => {
      const allArtists = readTable('artists')
      const artist = allArtists.find(a => a.id === data.artistId)
      const earning = {
        id: 'ern_' + Math.random().toString(36).substring(2, 9),
        ...data,
        createdAt: new Date().toISOString()
      }
      if (artist) {
        artist.earnings = artist.earnings || []
        artist.earnings.unshift(earning)
        writeTable('artists', allArtists)
      }
      return earning
    }
  },

  portfolioItem: {
    create: async ({ data }: { data: any }) => {
      const allArtists = readTable('artists')
      const artist = allArtists.find(a => a.id === data.artistId)
      const item = {
        id: 'pf_' + Math.random().toString(36).substring(2, 9),
        ...data,
        createdAt: new Date().toISOString()
      }
      if (artist) {
        artist.portfolio = artist.portfolio || []
        artist.portfolio.push(item)
        writeTable('artists', allArtists)
      }
      return item
    }
  },

  auditResult: {
    create: async ({ data }: { data: any }) => {
      const allArtists = readTable('artists')
      const artist = allArtists.find(a => a.id === data.artistId)
      const res = {
        id: 'adt_' + Math.random().toString(36).substring(2, 9),
        ...data,
        createdAt: new Date().toISOString()
      }
      if (artist) {
        artist.auditResults = artist.auditResults || []
        artist.auditResults.unshift(res)
        writeTable('artists', allArtists)
      }
      return res
    }
  },

  pageView: {
    create: async ({ data }: { data: any }) => {
      const allArtists = readTable('artists')
      const artist = allArtists.find(a => a.id === data.artistId)
      if (artist) {
        artist.pageViews = artist.pageViews || []
        artist.pageViews.push({
          id: 'pv_' + Math.random().toString(36).substring(2, 9),
          createdAt: new Date().toISOString(),
          ...data
        })
        writeTable('artists', allArtists)
      }
      return true
    }
  }
}
