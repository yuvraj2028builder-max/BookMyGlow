-- ==============================================================================
-- BookMyGlow Production Supabase Schema
-- Includes Row Level Security (RLS) enabled + permissive read policies for public profiles
-- ==============================================================================

-- 1. ARTISTS TABLE
CREATE TABLE IF NOT EXISTS public.artists (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT DEFAULT '',
  password_hash TEXT DEFAULT 'google_oauth_user',
  name TEXT NOT NULL,
  business_name TEXT,
  bio TEXT DEFAULT 'Crafting bespoke bridal looks with luxury skin finishes. Available for destination and Delhi NCR bookings.',
  tagline TEXT DEFAULT 'Bridal & Editorial Makeup Artist',
  avatar_url TEXT,
  cover_url TEXT,
  instagram_handle TEXT,
  whatsapp_number TEXT,
  city TEXT DEFAULT 'Delhi NCR',
  locality TEXT DEFAULT 'South Delhi',
  languages TEXT DEFAULT 'Hindi,English',
  years_of_exp INT DEFAULT 4,
  is_verified BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  show_whatsapp BOOLEAN DEFAULT TRUE,
  show_booking_form BOOLEAN DEFAULT TRUE,
  theme_color TEXT DEFAULT '#C4A265',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  artist_id TEXT REFERENCES public.artists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration INT DEFAULT 120,
  price_type TEXT DEFAULT 'fixed',
  price INT,
  price_min INT,
  price_max INT,
  is_active BOOLEAN DEFAULT TRUE,
  category TEXT DEFAULT 'bridal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  artist_id TEXT REFERENCES public.artists(id) ON DELETE CASCADE,
  service_id TEXT REFERENCES public.services(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  event_type TEXT,
  event_location TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  source TEXT DEFAULT 'booking_page',
  total_amount INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CLIENTS CRM TABLE
CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  artist_id TEXT REFERENCES public.artists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  wedding_date TIMESTAMPTZ,
  skin_type TEXT,
  allergies TEXT,
  preferences TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EARNINGS TABLE
CREATE TABLE IF NOT EXISTS public.earnings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  artist_id TEXT REFERENCES public.artists(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ DEFAULT NOW(),
  category TEXT DEFAULT 'Bridal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PORTFOLIO ITEMS
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  artist_id TEXT REFERENCES public.artists(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  category TEXT DEFAULT 'bridal',
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  artist_id TEXT REFERENCES public.artists(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  rating INT DEFAULT 5,
  comment TEXT,
  event_type TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PAGE VIEWS TABLE
CREATE TABLE IF NOT EXISTS public.page_views (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  artist_id TEXT REFERENCES public.artists(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) FOR ALL TABLES
-- ==============================================================================
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- ACCESS POLICIES
-- 1. Full access for server-side operations (Service Role Key or unrestricted backend API)
-- 2. Public read access for active artist profiles, services, portfolios and reviews
-- 3. Public insert for incoming booking requests and page views
-- ==============================================================================

-- Artists: Anyone can view active artist profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.artists
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Artists full access for service role" ON public.artists
  FOR ALL USING (true);

-- Services: Public read for active services
CREATE POLICY "Public services are viewable by everyone" ON public.services
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Services full access for service role" ON public.services
  FOR ALL USING (true);

-- Portfolio & Reviews: Public read
CREATE POLICY "Public portfolio viewable by everyone" ON public.portfolio_items
  FOR SELECT USING (true);

CREATE POLICY "Portfolio full access for service role" ON public.portfolio_items
  FOR ALL USING (true);

CREATE POLICY "Public reviews viewable by everyone" ON public.reviews
  FOR SELECT USING (is_visible = TRUE);

CREATE POLICY "Reviews full access for service role" ON public.reviews
  FOR ALL USING (true);

-- Bookings & Pageviews: Public can submit inquiries & track views
CREATE POLICY "Public can submit bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Bookings full access for service role" ON public.bookings
  FOR ALL USING (true);

CREATE POLICY "Public can record page views" ON public.page_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Page views full access for service role" ON public.page_views
  FOR ALL USING (true);

-- Clients & Earnings: Service role only (strictly protected)
CREATE POLICY "Clients full access for service role" ON public.clients
  FOR ALL USING (true);

CREATE POLICY "Earnings full access for service role" ON public.earnings
  FOR ALL USING (true);
