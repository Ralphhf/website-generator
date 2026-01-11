import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

// Format address for display
export function formatAddress(address: string, city: string, state: string, zip: string): string {
  return `${address}, ${city}, ${state} ${zip}`
}

// Slugify a string
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Truncate text with ellipsis
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

// Delay utility for animations
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Format currency
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 10 || cleaned.length === 11
}

// Validate URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Convert hex to rgba
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Business type to readable name mapping
export const businessTypeNames: Record<string, string> = {
  restaurant: 'Restaurant',
  cafe: 'Café',
  bar: 'Bar',
  bakery: 'Bakery',
  gym: 'Gym & Fitness',
  spa: 'Spa & Wellness',
  salon: 'Hair Salon',
  dentist: 'Dental Practice',
  doctor: 'Medical Practice',
  lawyer: 'Law Firm',
  accountant: 'Accounting Firm',
  real_estate_agency: 'Real Estate Agency',
  car_dealer: 'Car Dealership',
  car_repair: 'Auto Repair',
  plumber: 'Plumbing Service',
  electrician: 'Electrical Service',
  roofing_contractor: 'Roofing Contractor',
  general_contractor: 'General Contractor',
  painter: 'Painting Service',
  landscaping: 'Landscaping Service',
  cleaning_service: 'Cleaning Service',
  pet_store: 'Pet Store',
  veterinary_care: 'Veterinary Clinic',
  florist: 'Florist',
  jewelry_store: 'Jewelry Store',
  clothing_store: 'Clothing Store',
  furniture_store: 'Furniture Store',
  hardware_store: 'Hardware Store',
  pharmacy: 'Pharmacy',
  lodging: 'Hotel & Lodging',
}

// Get readable business type
export function getBusinessTypeName(type: string): string {
  return businessTypeNames[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Generate SEO-friendly title
export function generateSeoTitle(businessName: string, city: string, businessType: string): string {
  const typeName = getBusinessTypeName(businessType)
  return `${businessName} | ${typeName} in ${city}`
}

// Generate SEO description
export function generateSeoDescription(businessName: string, city: string, state: string, services: string[]): string {
  const serviceList = services.slice(0, 3).join(', ')
  return `${businessName} provides quality ${serviceList} services in ${city}, ${state}. Contact us today for a free consultation.`
}
