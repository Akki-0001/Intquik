// Mock database layer using LocalStorage for Intuik client
"use client";

export interface Business {
  id: string;
  name: string;
  logoUrl?: string;
  googleReviewUrl: string;
  yelpReviewUrl?: string;
  primaryColor: string;
  ratingThreshold: number; // e.g. 4 (4-5 go to Google, 1-3 go to internal feedback)
  isActive?: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  businessId: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  status: 'public' | 'private'; // public (4-5 stars), private (1-3 stars feedback)
  createdAt: string;
  reply?: string;
}

export interface Scan {
  id: string;
  businessId: string;
  timestamp: string;
  device: 'mobile' | 'desktop' | 'tablet';
  converted: boolean;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  companyName: string;
  role: 'user' | 'admin';
  subscription?: {
    plan: 'Free' | 'Starter' | 'Professional' | 'Enterprise';
    startDate: string;
    endDate: string;
    status: 'Active' | 'Expired' | 'Cancelled';
  };
  token?: string;
}

const DEFAULT_BUSINESSES: Business[] = [
  {
    id: "biz-1",
    name: "Bella Italia Bistro",
    googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83dQWI",
    yelpReviewUrl: "https://www.yelp.com/biz/bella-italia-bistro",
    primaryColor: "#E11D48", // rose-600
    ratingThreshold: 4,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "biz-2",
    name: "Apex Dental Care",
    googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83dQWI",
    primaryColor: "#0D9488", // teal-600
    ratingThreshold: 4,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "biz-3",
    name: "Vibe Coffee Roasters",
    googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83dQWI",
    yelpReviewUrl: "https://www.yelp.com/biz/vibe-coffee",
    primaryColor: "#D97706", // amber-600
    ratingThreshold: 4,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "rev-1",
    businessId: "biz-1",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.j@example.com",
    rating: 5,
    comment: "Absolutely incredible lasagna! The staff was extremely polite and attentive. Will definitely make this our weekend spot.",
    status: "public",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "rev-2",
    businessId: "biz-1",
    customerName: "Mark Thompson",
    customerEmail: "mthompson@example.com",
    rating: 2,
    comment: "The pasta was cold when served, and it took 45 minutes to get our food. Waitress apologized but overall a frustrating dinner.",
    status: "private",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reply: "Hi Mark, we are sincerely sorry for the delay and cold food. We would love to host you again and make things right. Please contact us directly at contact@bellaitalia.com."
  },
  {
    id: "rev-3",
    businessId: "biz-2",
    customerName: "David Kim",
    customerEmail: "dkim@example.com",
    rating: 5,
    comment: "Dr. Evans and the hygienist were so gentle. I usually have dentist anxiety, but this clinic is top-notch and highly professional.",
    status: "public",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "rev-4",
    businessId: "biz-3",
    customerName: "Chloe Watson",
    customerEmail: "chloe.w@example.com",
    rating: 4,
    comment: "Great pour-over coffee and vibes! The study corner is very cozy. Only downside is the limited parking spaces outside.",
    status: "public",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "rev-5",
    businessId: "biz-2",
    customerName: "Jessica Alva",
    customerEmail: "jess@example.com",
    rating: 3,
    comment: "Billing process was confusing. The cleaning was good, but clear pricing beforehand would be much appreciated.",
    status: "private",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// Generate scans over the last 30 days
const generateDefaultScans = (): Scan[] => {
  const scans: Scan[] = [];
  const devices: ('mobile' | 'desktop' | 'tablet')[] = ['mobile', 'mobile', 'mobile', 'tablet', 'desktop']; // Heavy mobile weight
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    // Random number of scans per day (higher on weekends)
    const dayOfWeek = date.getDay();
    const baseScans = (dayOfWeek === 0 || dayOfWeek === 6) ? 12 : 6;
    const randomCount = Math.floor(Math.random() * 8) + baseScans;
    
    for (let j = 0; j < randomCount; j++) {
      const bizId = `biz-${Math.floor(Math.random() * 3) + 1}`;
      const device = devices[Math.floor(Math.random() * devices.length)];
      // 65% conversion rate
      const converted = Math.random() < 0.65;
      
      // Random hour of day
      const scanDate = new Date(date);
      scanDate.setHours(Math.floor(Math.random() * 14) + 8); // 8 AM to 10 PM
      scanDate.setMinutes(Math.floor(Math.random() * 60));
      
      scans.push({
        id: `scan-${i}-${j}`,
        businessId: bizId,
        timestamp: scanDate.toISOString(),
        device,
        converted,
      });
    }
  }
  return scans;
};

const isLegacyDemoUser = (user: MockUser | null) => {
  return user?.email === "alex@intuik.com" && user?.id === "usr-1";
};

// LocalStorage Helper
const isClient = typeof window !== 'undefined';

export const getDB = () => {
  if (!isClient) {
    return {
      businesses: [],
      reviews: [],
      scans: [],
      user: null as MockUser | null,
    };
  }

  let user = null;
  const userJson = localStorage.getItem('rp_user');
  if (userJson) {
    if (userJson === 'null') {
      user = null;
    } else {
      user = JSON.parse(userJson);
      if (isLegacyDemoUser(user)) {
        user = null;
        localStorage.removeItem('rp_user');
      }
    }
  }

  const suffix = user ? `_${user.id || user._id}` : '';

  const businessesJson = localStorage.getItem(`rp_businesses${suffix}`);
  const reviewsJson = localStorage.getItem(`rp_reviews${suffix}`);
  const scansJson = localStorage.getItem(`rp_scans${suffix}`);

  let businesses = [];
  let reviews = [];
  let scans: Scan[] = [];

  if (businessesJson) {
    businesses = JSON.parse(businessesJson);
  } else {
    // If no user is logged in, show default demo data. If logged in, start with empty data.
    businesses = user ? [] : DEFAULT_BUSINESSES;
    localStorage.setItem(`rp_businesses${suffix}`, JSON.stringify(businesses));
  }

  if (reviewsJson) {
    reviews = JSON.parse(reviewsJson);
  } else {
    reviews = user ? [] : DEFAULT_REVIEWS;
    localStorage.setItem(`rp_reviews${suffix}`, JSON.stringify(reviews));
  }

  if (scansJson) {
    scans = JSON.parse(scansJson);
  } else {
    scans = user ? [] : generateDefaultScans();
    localStorage.setItem(`rp_scans${suffix}`, JSON.stringify(scans));
  }

  return { businesses, reviews, scans, user };
};

export const saveBusinesses = (businesses: Business[]) => {
  if (isClient) {
    const userJson = localStorage.getItem('rp_user');
    const user = userJson && userJson !== 'null' ? JSON.parse(userJson) : null;
    const suffix = user ? `_${user.id || user._id}` : '';
    localStorage.setItem(`rp_businesses${suffix}`, JSON.stringify(businesses));
  }
};

export const saveReviews = (reviews: Review[]) => {
  if (isClient) {
    const userJson = localStorage.getItem('rp_user');
    const user = userJson && userJson !== 'null' ? JSON.parse(userJson) : null;
    const suffix = user ? `_${user.id || user._id}` : '';
    localStorage.setItem(`rp_reviews${suffix}`, JSON.stringify(reviews));
  }
};

export const saveScans = (scans: Scan[]) => {
  if (isClient) {
    const userJson = localStorage.getItem('rp_user');
    const user = userJson && userJson !== 'null' ? JSON.parse(userJson) : null;
    const suffix = user ? `_${user.id || user._id}` : '';
    localStorage.setItem(`rp_scans${suffix}`, JSON.stringify(scans));
  }
};

export const saveUser = (user: MockUser | null) => {
  if (isClient) {
    if (user) {
      localStorage.setItem('rp_user', JSON.stringify(user));
    } else {
      localStorage.setItem('rp_user', 'null');
    }
  }
};
