import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as British currency with thousands separation
 * @param amount - Amount in pence or pounds
 * @param fromPence - Whether the amount is in pence (default: false)
 * @returns Formatted currency string (e.g., "£1,234.56" or "£1,234")
 */
export function formatCurrency(amount: number, fromPence: boolean = false, showSymbol: boolean = true): string {
  const pounds = fromPence ? amount : amount;
  
  if (!showSymbol) {
    // Format as plain number with thousands separation
    const formatted = new Intl.NumberFormat('en-GB', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(pounds);
    
    // Remove .00 if it's a whole number
    return formatted.replace(/\.00$/, '');
  }
  
  // Format with currency symbol
  const formatted = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(pounds);
  
  // Remove .00 if it's a whole number
  return formatted.replace(/\.00$/, '');
}

