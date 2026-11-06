export interface CityOption {
  name: string;
  region: string;
}

// Curated locations keep this browser-only practice checkout deterministic.
const citiesByCountry: Record<string, CityOption[]> = {
  Australia: [
    { name: "Adelaide", region: "South Australia" },
    { name: "Brisbane", region: "Queensland" },
    { name: "Melbourne", region: "Victoria" },
    { name: "Perth", region: "Western Australia" },
    { name: "Sydney", region: "New South Wales" },
  ],
  Canada: [
    { name: "Calgary", region: "Alberta" },
    { name: "Montreal", region: "Quebec" },
    { name: "Ottawa", region: "Ontario" },
    { name: "Toronto", region: "Ontario" },
    { name: "Vancouver", region: "British Columbia" },
  ],
  France: [
    { name: "Lyon", region: "Auvergne-Rhône-Alpes" },
    { name: "Marseille", region: "Provence-Alpes-Côte d'Azur" },
    { name: "Paris", region: "Île-de-France" },
  ],
  Germany: [
    { name: "Berlin", region: "Berlin" },
    { name: "Frankfurt", region: "Hesse" },
    { name: "Hamburg", region: "Hamburg" },
    { name: "Munich", region: "Bavaria" },
  ],
  India: [
    { name: "Bengaluru", region: "Karnataka" },
    { name: "Chennai", region: "Tamil Nadu" },
    { name: "Delhi", region: "Delhi" },
    { name: "Mumbai", region: "Maharashtra" },
  ],
  Japan: [
    { name: "Kyoto", region: "Kyoto" },
    { name: "Osaka", region: "Osaka" },
    { name: "Tokyo", region: "Tokyo" },
    { name: "Yokohama", region: "Kanagawa" },
  ],
  Singapore: [{ name: "Singapore", region: "Singapore" }],
  "United Kingdom": [
    { name: "Birmingham", region: "England" },
    { name: "Cardiff", region: "Wales" },
    { name: "Edinburgh", region: "Scotland" },
    { name: "London", region: "England" },
    { name: "Manchester", region: "England" },
  ],
  "United States": [
    { name: "Austin", region: "Texas" },
    { name: "Boston", region: "Massachusetts" },
    { name: "Chicago", region: "Illinois" },
    { name: "Los Angeles", region: "California" },
    { name: "Miami", region: "Florida" },
    { name: "New York", region: "New York" },
    { name: "San Francisco", region: "California" },
    { name: "Seattle", region: "Washington" },
  ],
  Vietnam: [
    { name: "Can Tho", region: "Can Tho" },
    { name: "Da Nang", region: "Da Nang" },
    { name: "Hai Phong", region: "Hai Phong" },
    { name: "Hanoi", region: "Hanoi" },
    { name: "Ho Chi Minh City", region: "Ho Chi Minh City" },
  ],
};

export const countries = Object.keys(citiesByCountry);
export const citiesForCountry = (country: string) =>
  citiesByCountry[country] || [];
export const regionForCity = (country: string, city: string) =>
  citiesForCountry(country).find((option) => option.name === city)?.region ||
  "";
