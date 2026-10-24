export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}

export const LOCALITIES = [
  'South Delhi',
  'Central Delhi',
  'North Delhi',
  'West Delhi',
  'East Delhi',
  'Noida',
  'Gurgaon',
  'Faridabad',
  'Ghaziabad'
]

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatPriceDisplay(
  priceType: 'fixed' | 'range' | 'hidden' | string,
  price?: number | null,
  priceMin?: number | null,
  priceMax?: number | null
): string {
  if (priceType === 'hidden') return 'Price on request'
  if (priceType === 'range' && priceMin != null && priceMax != null) {
    return `${formatPrice(priceMin)} - ${formatPrice(priceMax)}`
  }
  if (price != null) return formatPrice(price)
  return 'Price on request'
}

export function getWhatsAppUrl(phone: string, message: string = ''): string {
  const cleanPhone = phone.replace(/[^\d]/g, '')
  const validPhone = cleanPhone.startsWith('91') || cleanPhone.length > 10 ? cleanPhone : `91${cleanPhone}`
  return `https://wa.me/${validPhone}?text=${encodeURIComponent(message)}`
}

export function getInstagramUrl(handle: string | null | undefined): string {
  if (!handle) return '#'
  if (handle.startsWith('http://') || handle.startsWith('https://')) return handle
  const cleanHandle = handle.replace(/^@/, '').trim()
  return `https://instagram.com/${cleanHandle}`
}

export function getInitials(name: string): string {
  if (!name) return 'A'
  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
