export const countryConversions: Record<string, string> = {
  GB: "United Kingdom",
};

export function getCountryDisplayName(code?: string): string {
  if (!code) {
    return "";
  }
  return countryConversions[code] ?? code;
} 