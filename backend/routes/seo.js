const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();

const map = s => ({
  id:               s.id,
  page_route:       s.page_route || '/',
  page_name:        s.page_name || 'Home Page',
  meta_title:       s.meta_title || '',
  meta_description: s.meta_description || '',
  meta_keywords:    s.meta_keywords || '',
  canonical_url:    s.canonical_url || '',
  og_image:         s.og_image || '',
  robots:           s.robots || 'index, follow',
  status:           s.status || 'Active',
  created_at:       s.created_at || new Date().toISOString()
});

// Seed default site pages if empty
function ensureSeedData() {
  const all = store.getAll('seo');
  if (all.length > 0) return;

  const defaultPages = [
    {
      page_route: '/',
      page_name: 'Home Page',
      meta_title: 'Mangalam Travel & Tours — Best International & Domestic Holiday Packages',
      meta_description: 'Explore curated holiday packages, flight bookings, visa assistance, and stress-free EMI vacation packages with Mangalam Travel & Tours.',
      meta_keywords: 'travel agency kerala, holiday packages, dubai packages from trivandrum, emi holiday tours, visa services trivandrum, flights booking',
      canonical_url: 'https://mangalamtravel.com/',
      og_image: './assets/images/banner-img.webp',
      robots: 'index, follow',
      status: 'Active'
    },
    {
      page_route: '/holiday-package.html',
      page_name: 'Holiday Packages',
      meta_title: 'Holiday Packages — International & Domestic Tour Itineraries | Mangalam',
      meta_description: 'Discover all-inclusive holiday packages tailored for families, couples, and adventurers. Best prices with easy EMI payment options.',
      meta_keywords: 'international tour packages, domestic holiday packages, honeymoon trip, dubai tour, europe tour, bali package',
      canonical_url: 'https://mangalamtravel.com/holiday-package.html',
      og_image: './assets/images/package-1.webp',
      robots: 'index, follow',
      status: 'Active'
    },
    {
      page_route: '/packages.html',
      page_name: 'All Packages Listing',
      meta_title: 'Explore All Travel Packages | Mangalam Travel & Tours',
      meta_description: 'Browse through our full catalog of holiday packages, fixed departures, and tailored itineraries.',
      meta_keywords: 'tour packages list, best holiday deals, budget tours, luxury holiday packages',
      canonical_url: 'https://mangalamtravel.com/packages.html',
      og_image: './assets/images/package-2.webp',
      robots: 'index, follow',
      status: 'Active'
    },
    {
      page_route: '/attraction.html',
      page_name: 'Attractions & Experiences',
      meta_title: 'Top Attractions & World Sightseeing Tours | Mangalam Travel',
      meta_description: 'Book skip-the-line attraction tickets, desert safaris, theme parks, museum passes, and iconic sightseeing experiences worldwide.',
      meta_keywords: 'burj khalifa tickets, desert safari dubai, attraction passes, theme park tickets, city tours',
      canonical_url: 'https://mangalamtravel.com/attraction.html',
      og_image: './assets/images/destination-1.webp',
      robots: 'index, follow',
      status: 'Active'
    },
    {
      page_route: '/blog.html',
      page_name: 'Travel Blog & Guides',
      meta_title: 'Travel Journal, Destination Guides & Tips | Mangalam Travel',
      meta_description: 'Read the latest travel tips, itinerary inspirations, visa guidelines, and destination recommendations from our travel experts.',
      meta_keywords: 'travel blog, best places to visit, travel tips, dubai guide, travel packing checklist',
      canonical_url: 'https://mangalamtravel.com/blog.html',
      og_image: './assets/images/banner-img.webp',
      robots: 'index, follow',
      status: 'Active'
    },
    {
      page_route: '/about.html',
      page_name: 'About Us',
      meta_title: 'About Mangalam Travel & Tours — Trusted Travel Experts',
      meta_description: 'Learn about Mangalam Travel & Tours, our legacy, team, and commitment to creating memorable journeys worldwide.',
      meta_keywords: 'about mangalam travel, tour operators kerala, trusted travel agency trivandrum',
      canonical_url: 'https://mangalamtravel.com/about.html',
      og_image: './assets/images/abt-img-1.webp',
      robots: 'index, follow',
      status: 'Active'
    },
    {
      page_route: '/contact.html',
      page_name: 'Contact & Support',
      meta_title: 'Contact Us — 24/7 Travel Assistance | Mangalam Travel',
      meta_description: 'Get in touch with our travel advisors for package bookings, custom trips, visa queries, and emergency flight support.',
      meta_keywords: 'contact mangalam travels, travel agency phone number, vellayambalam office trivandrum',
      canonical_url: 'https://mangalamtravel.com/contact.html',
      og_image: './assets/images/logo-color.png',
      robots: 'index, follow',
      status: 'Active'
    },
    {
      page_route: '/global-visa-services.html',
      page_name: 'Global Visa Services',
      meta_title: 'Global Visa Assistance & Processing | Mangalam Travel',
      meta_description: 'Hassle-free tourist and business visa processing for Schengen, UK, USA, Dubai, Singapore, and 50+ countries.',
      meta_keywords: 'visa assistance trivandrum, dubai tourist visa, schengen visa agent, fast visa processing',
      canonical_url: 'https://mangalamtravel.com/global-visa-services.html',
      og_image: './assets/images/tourist-visa.webp',
      robots: 'index, follow',
      status: 'Active'
    },
    {
      page_route: '/flight-tickets.html',
      page_name: 'Flight Tickets',
      meta_title: 'Flight Ticket Booking & Special Airfares | Mangalam Travel',
      meta_description: 'Book domestic and international flights at competitive fares with 24/7 ticketing support and flexible rescheduling.',
      meta_keywords: 'cheap flight tickets, international air tickets, gulf flights booking, trivandrum airline tickets',
      canonical_url: 'https://mangalamtravel.com/flight-tickets.html',
      og_image: './assets/images/plane.png',
      robots: 'index, follow',
      status: 'Active'
    },
    {
      page_route: '/travel-insurance.html',
      page_name: 'Travel Insurance',
      meta_title: 'Comprehensive Travel & Medical Insurance | Mangalam Travel',
      meta_description: 'Protect your overseas trips with medical coverage, trip cancellation protection, and baggage loss insurance.',
      meta_keywords: 'international travel insurance, overseas medical insurance, schengen travel insurance',
      canonical_url: 'https://mangalamtravel.com/travel-insurance.html',
      og_image: './assets/images/Insurance.webp',
      robots: 'index, follow',
      status: 'Active'
    },
    {
      page_route: '/mice-tourism.html',
      page_name: 'MICE Tourism',
      meta_title: 'Corporate MICE Tourism & Conferences | Mangalam Travel',
      meta_description: 'End-to-end corporate travel management, incentive group trips, global conferences, and executive retreats.',
      meta_keywords: 'corporate travel management, MICE tourism, company offsite trip, corporate incentive tours',
      canonical_url: 'https://mangalamtravel.com/mice-tourism.html',
      og_image: './assets/images/mice-tourism.webp',
      robots: 'index, follow',
      status: 'Active'
    },
    {
      page_route: '/cruises.html',
      page_name: 'Luxury Cruises',
      meta_title: 'Luxury Cruise Packages & Ocean Voyages | Mangalam Travel',
      meta_description: 'Book unforgettable cruise vacations across the Mediterranean, Caribbean, Dubai, Singapore, and Alaska.',
      meta_keywords: 'cruise packages, luxury cruise booking, cordelia cruise, royal caribbean deals',
      canonical_url: 'https://mangalamtravel.com/cruises.html',
      og_image: './assets/images/cruise.webp',
      robots: 'index, follow',
      status: 'Active'
    },
    {
      page_route: '/customize-trip.html',
      page_name: 'Customize Your Trip',
      meta_title: 'Tailormade Trip Planner — Design Your Dream Vacation | Mangalam',
      meta_description: 'Plan custom itineraries, select hotels, choose sightseeing places, and receive instant personalized travel quotations.',
      meta_keywords: 'custom trip planner, customize holiday, personalized tour itinerary, private tour booking',
      canonical_url: 'https://mangalamtravel.com/customize-trip.html',
      og_image: './assets/images/travel-doodle-bg.jpg',
      robots: 'index, follow',
      status: 'Active'
    }
  ];

  defaultPages.forEach(p => store.insert('seo', p));
}

// GET all SEO entries (Admin)
router.get('/', (req, res) => {
  ensureSeedData();
  const all = store.getAll('seo').map(map);
  res.json(all);
});

// GET SEO for specific page path (Frontend dynamic meta injection)
router.get('/match', (req, res) => {
  ensureSeedData();
  const route = (req.query.route || req.query.path || '/').toLowerCase().trim();
  const normalizedRoute = route.startsWith('/') ? route : `/${route}`;

  const all = store.getAll('seo').map(map);
  
  // Find exact match or normalized match
  let matched = all.find(s => s.page_route.toLowerCase() === normalizedRoute);
  if (!matched && (normalizedRoute === '' || normalizedRoute === '/index.html' || normalizedRoute === '/index.php')) {
    matched = all.find(s => s.page_route === '/' || s.page_route === '/index.html');
  }
  if (!matched) {
    // Strip trailing .html or match prefix
    const base = normalizedRoute.replace(/\.html$/i, '');
    matched = all.find(s => s.page_route.replace(/\.html$/i, '').toLowerCase() === base);
  }

  if (!matched) {
    // Fallback to Home SEO
    matched = all.find(s => s.page_route === '/') || all[0] || null;
  }

  res.json(matched || {});
});

// GET single SEO entry by ID
router.get('/:id', (req, res) => {
  ensureSeedData();
  const item = store.getOne('seo', x => x.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'SEO record not found' });
  res.json(map(item));
});

// POST create new SEO entry (Admin)
router.post('/', verifyToken, (req, res) => {
  const { page_route, page_name, meta_title, meta_description, meta_keywords, canonical_url, og_image, robots, status } = req.body;
  if (!page_route || !meta_title) {
    return res.status(400).json({ error: 'Page Route and Meta Title are required.' });
  }

  const doc = store.insert('seo', {
    page_route: page_route.startsWith('/') ? page_route.trim() : `/${page_route.trim()}`,
    page_name: page_name || 'Custom Page',
    meta_title: meta_title.trim(),
    meta_description: meta_description?.trim() || '',
    meta_keywords: meta_keywords?.trim() || '',
    canonical_url: canonical_url?.trim() || '',
    og_image: og_image?.trim() || '',
    robots: robots || 'index, follow',
    status: status || 'Active'
  });

  res.status(201).json({ success: true, message: 'SEO configuration added!', seo: map(doc) });
});

// PUT update SEO entry (Admin)
router.put('/:id', verifyToken, (req, res) => {
  const { page_route, page_name, meta_title, meta_description, meta_keywords, canonical_url, og_image, robots, status } = req.body;

  const updates = {};
  if (page_route !== undefined) updates.page_route = page_route.startsWith('/') ? page_route.trim() : `/${page_route.trim()}`;
  if (page_name !== undefined) updates.page_name = page_name.trim();
  if (meta_title !== undefined) updates.meta_title = meta_title.trim();
  if (meta_description !== undefined) updates.meta_description = meta_description.trim();
  if (meta_keywords !== undefined) updates.meta_keywords = meta_keywords.trim();
  if (canonical_url !== undefined) updates.canonical_url = canonical_url.trim();
  if (og_image !== undefined) updates.og_image = og_image.trim();
  if (robots !== undefined) updates.robots = robots.trim();
  if (status !== undefined) updates.status = status;

  const doc = store.update('seo', req.params.id, updates);
  if (!doc) return res.status(404).json({ error: 'SEO record not found' });
  res.json({ success: true, message: 'SEO configuration updated!', seo: map(doc) });
});

// DELETE SEO entry (Admin)
router.delete('/:id', verifyToken, (req, res) => {
  store.remove('seo', req.params.id);
  res.json({ success: true, message: 'SEO record deleted!' });
});

module.exports = router;
