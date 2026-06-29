export interface SiteSettings {
  announcementText: string;
  announcementPhone: string;

  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;

  contactPhone: string;
  contactEmail: string;
  contactAddress: string;

  artistName: string;
  artistBio1: string;
  artistBio2: string;
  artistYears: string;
  artistWorksCount: string;
  artistCustomersCount: string;
  artistCountries: string;

  easypaisaNumber: string;
  easypaisaName: string;
  jazzcashNumber: string;
  jazzcashName: string;
  bankName: string;
  bankAccount: string;
  bankTitle: string;
  bankIban: string;
  codFee: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  announcementText: "Free Shipping on Orders Over PKR 5,000  |  Custom Artworks Available",
  announcementPhone: "+92 300 123 4567",

  instagramUrl: "https://instagram.com",
  facebookUrl: "https://facebook.com",
  youtubeUrl: "https://youtube.com",

  contactPhone: "+92 300 123 4567",
  contactEmail: "mahi@paintbymahi.com",
  contactAddress: "Lahore, Punjab, Pakistan",

  artistName: "Mahi",
  artistBio1:
    "My name is Mahi, and I've been painting since I was a child in Lahore, captivated by the rich colors of Pakistani culture, the geometric beauty of Islamic art, and the raw landscapes of my homeland.",
  artistBio2:
    "Over five years ago, I turned my lifelong passion into a professional practice, creating original handmade works that bridge tradition and contemporary expression.",
  artistYears: "5+",
  artistWorksCount: "200+",
  artistCustomersCount: "500+",
  artistCountries: "4",

  easypaisaNumber: "0300-1234567",
  easypaisaName: "Paint by Mahi",
  jazzcashNumber: "0300-1234567",
  jazzcashName: "Paint by Mahi",
  bankName: "Meezan Bank",
  bankAccount: "01234567890",
  bankTitle: "Paint by Mahi",
  bankIban: "PK00MEZN0001234567890000",
  codFee: "200",
};
