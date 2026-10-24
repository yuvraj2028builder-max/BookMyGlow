import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const seedArtists = [
  {
    id: 'art_priya_sharma',
    slug: 'priyasharma',
    email: 'priya@example.com',
    phone: '9811223344',
    passwordHash: bcrypt.hashSync('priya123', 10),
    name: 'Priya Sharma',
    businessName: 'Priya Sharma Bridal Studio',
    tagline: 'Celebrity & Bridal Makeup Artist | Luxury Glass Skin',
    bio: 'Specializing in royal North Indian bridal looks, soft glam sangeet styles, and HD airbrush finishes. Over 6 years transforming 400+ brides across Delhi NCR, Udaipur, and Jaipur.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
    instagramHandle: 'priyasharmamua',
    whatsappNumber: '9811223344',
    city: 'Delhi NCR',
    locality: 'South Delhi',
    languages: 'Hindi,English,Punjabi',
    yearsOfExp: 6,
    isVerified: true,
    isActive: true,
    showWhatsapp: true,
    showBookingForm: true,
    themeColor: '#C4A265',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    services: [
      {
        id: 'srv_1',
        name: 'Royal Heritage HD Bridal',
        description: 'Complete HD Airbrush makeup, 3D mink lashes, jewelry setting, dupatta draping, skin prep facial, and bridal touch-up kit.',
        duration: 180,
        priceType: 'fixed',
        price: 28000,
        category: 'bridal',
        isActive: true
      },
      {
        id: 'srv_2',
        name: 'Cocktail & Sangeet Glam',
        description: 'Luminous dewy skin, dramatic eyes, glitter pigment accents, and high-glam Hollywood waves or floral hairdo.',
        duration: 120,
        priceType: 'fixed',
        price: 14000,
        category: 'party',
        isActive: true
      },
      {
        id: 'srv_3',
        name: 'Pre-Wedding / Engagement Look',
        description: 'Soft-focus camera-ready matte or dewy finish tailored to your lehenga color palette.',
        duration: 120,
        priceType: 'range',
        priceMin: 16000,
        priceMax: 20000,
        category: 'engagement',
        isActive: true
      }
    ],
    portfolio: [
      {
        id: 'pf_1',
        imageUrl: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=800&q=80',
        caption: 'Traditional Red Lehenga Bridal Glam — South Delhi Bride',
        category: 'bridal',
        isFeatured: true
      },
      {
        id: 'pf_2',
        imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
        caption: 'Subtle Pastel Pink Reception Look',
        category: 'bridal',
        isFeatured: false
      },
      {
        id: 'pf_3',
        imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        caption: 'Sangeet Night Smokey Eye Drama',
        category: 'party',
        isFeatured: false
      },
      {
        id: 'pf_4',
        imageUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=600&q=80',
        caption: 'Minimal Mehndi Glow',
        category: 'engagement',
        isFeatured: false
      }
    ],
    reviews: [
      {
        id: 'rev_1',
        clientName: 'Aanya Kapoor',
        rating: 5,
        eventType: 'Wedding at ITC Maurya',
        comment: 'Priya made me look like an absolute dream on my wedding day. The makeup didn\'t budge even after 14 hours and emotional pheras!',
        createdAt: new Date().toISOString()
      },
      {
        id: 'rev_2',
        clientName: 'Simran Gujral',
        rating: 5,
        eventType: 'Sangeet at Gurgaon',
        comment: 'Hands down the most professional MUA in Delhi NCR. Booked her directly through her link without any back-and-forth DM stress.',
        createdAt: new Date().toISOString()
      }
    ],
    bookings: [
      {
        id: 'bkg_1',
        clientName: 'Kritika Sen',
        clientPhone: '9899123456',
        eventDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        eventType: 'Bridal Wedding',
        eventLocation: 'The Leela Palace, Chanakyapuri, Delhi',
        notes: 'Bride prefers matte finish. Allergies to heavy fragrance.',
        status: 'pending',
        totalAmount: 28000,
        createdAt: new Date().toISOString()
      },
      {
        id: 'bkg_2',
        clientName: 'Mehak Verma',
        clientPhone: '9988776655',
        eventDate: new Date(Date.now() + 86400000 * 12).toISOString(),
        eventType: 'Sangeet Ceremony',
        eventLocation: 'Taj City Centre, Gurgaon',
        notes: 'Needs 2 extra bridesmaids light party makeup.',
        status: 'confirmed',
        totalAmount: 22000,
        createdAt: new Date().toISOString()
      }
    ],
    clients: [
      {
        id: 'clt_1',
        name: 'Kritika Sen',
        phone: '9899123456',
        weddingDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        skinType: 'Combination - Sensitive',
        allergies: 'Fragrance',
        notes: 'Warm undertone lehenga'
      }
    ],
    earnings: [
      {
        id: 'ern_1',
        amount: 28000,
        description: 'Bridal Makeup - Radhika Wedding',
        date: new Date().toISOString(),
        category: 'Bridal'
      },
      {
        id: 'ern_2',
        amount: 14000,
        description: 'Cocktail Glam - Shreya Reception',
        date: new Date(Date.now() - 86400000 * 7).toISOString(),
        category: 'Party'
      }
    ],
    pageViews: Array.from({ length: 148 }, () => ({
      id: Math.random().toString(),
      createdAt: new Date().toISOString()
    }))
  },
  {
    id: 'art_tanya_noida',
    slug: 'tanyamakeup',
    email: 'tanya@example.com',
    phone: '9876543210',
    passwordHash: bcrypt.hashSync('tanya123', 10),
    name: 'Tanya Mehra',
    businessName: 'Artistry by Tanya',
    tagline: 'Modern Editorial & Contemporary Bridal Looks',
    bio: 'Noida & East Delhi based bridal artist. Trained from London School of Makeup. Master of clean girl aesthetics and featherweight airbrush.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    instagramHandle: 'artistrybytanya',
    whatsappNumber: '9876543210',
    city: 'Delhi NCR',
    locality: 'Noida',
    yearsOfExp: 4,
    isVerified: true,
    isActive: true,
    showWhatsapp: true,
    showBookingForm: true,
    services: [
      {
        id: 'srv_t1',
        name: 'Editorial Bridal Package',
        duration: 150,
        priceType: 'fixed',
        price: 22000,
        category: 'bridal',
        isActive: true
      }
    ],
    portfolio: [
      {
        id: 'pf_t1',
        imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        caption: 'Dewy Modern Bride',
        category: 'bridal',
        isFeatured: true
      }
    ],
    reviews: [
      {
        id: 'rev_t1',
        clientName: 'Nisha B.',
        rating: 5,
        comment: 'So smooth and gorgeous. Highly recommend Tanya for modern brides.',
        createdAt: new Date().toISOString()
      }
    ],
    bookings: [],
    clients: [],
    earnings: [],
    pageViews: Array.from({ length: 82 }, () => ({ id: Math.random().toString(), createdAt: new Date().toISOString() }))
  }
]

fs.writeFileSync(path.join(dataDir, 'artists.json'), JSON.stringify(seedArtists, null, 2), 'utf-8')
console.log('Database seeded with top Delhi NCR makeup artists!')
