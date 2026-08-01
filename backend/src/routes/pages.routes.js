const express = require('express');
const router = express.Router();
const inMemoryStore = require('../data/inMemoryStore');

// Helper to resolve image paths for EJS views
const resolvePublicImgUrl = (imgStr, defaultFolder = 'destinations') => {
  if (!imgStr) return '';
  if (imgStr.startsWith('http://') || imgStr.startsWith('https://') || imgStr.startsWith('data:') || imgStr.startsWith('blob:')) {
    return imgStr;
  }
  if (imgStr.startsWith('uploads/') || imgStr.startsWith('assets/')) {
    return `./${imgStr}`;
  }
  if (imgStr.startsWith('/')) {
    return imgStr;
  }
  return `./admin/files/${defaultFolder}/${imgStr}`;
};

// Helper to assemble standard page view data for EJS templates
const getBasePageData = (req, extraData = {}) => {
  return {
    destinations: inMemoryStore.destinations.filter(d => d.status === 1),
    packages: inMemoryStore.packages.filter(p => p.status === 1),
    tickets: inMemoryStore.tickets.filter(t => t.status === 1),
    activities: inMemoryStore.activities.filter(a => a.status === 1),
    blogs: inMemoryStore.blogs.filter(b => b.status === 1),
    testimonials: inMemoryStore.testimonials.filter(t => t.status === 1),
    posters: inMemoryStore.posters.filter(p => p.status === 1),
    partners: inMemoryStore.partners.filter(p => p.status === 1),
    latestNotice: (inMemoryStore.notices.find(n => n.status === 1) || { data: '' }).data,
    resolveImgUrl: resolvePublicImgUrl,
    req,
    ...extraData
  };
};

// Core Pages
router.get(['/', '/index.php', '/index'], (req, res) => res.render('index', getBasePageData(req)));
router.get(['/about.php', '/about'], (req, res) => res.render('about', getBasePageData(req)));
router.get(['/contact.php', '/contact'], (req, res) => res.render('contact', getBasePageData(req)));
router.get(['/cart.php', '/cart'], (req, res) => res.render('cart', getBasePageData(req)));
router.get(['/thankyou.php', '/thankyou'], (req, res) => res.render('thankyou', getBasePageData(req)));
router.get(['/career.php', '/career'], (req, res) => res.render('career', getBasePageData(req)));
router.get('/privacy-policy.php', (req, res) => res.render('privacy-policy', getBasePageData(req)));
router.get('/terms-and-conditions.php', (req, res) => res.render('terms-and-conditions', getBasePageData(req)));

// Catalog Pages
router.get(['/package.php', '/package'], (req, res) => {
  const slug = req.query.slug || 'dubai';
  const type = req.query.type || 'package';
  const destObj = inMemoryStore.destinations.find(d => d.slug_url === slug && d.status === 1) || inMemoryStore.destinations.find(d => d.status === 1) || {};
  const destId = destObj.destination_id;
  
  let dataList = [];
  if (type === 'ticket' || type === 'tickets') {
    dataList = inMemoryStore.tickets.filter(t => (t.status === 1 || t.status === undefined) && (!destId || t.destination_id == destId));
    if (dataList.length === 0) {
      dataList = inMemoryStore.tickets.filter(t => t.status === 1 || t.status === undefined);
    }
  } else if (type === 'activity' || type === 'activities') {
    dataList = inMemoryStore.activities.filter(a => (a.status === 1 || a.status === undefined) && (!destId || a.destination_id == destId));
    if (dataList.length === 0) {
      dataList = inMemoryStore.activities.filter(a => a.status === 1 || a.status === undefined);
    }
  } else {
    dataList = inMemoryStore.packages.filter(p => (p.status === 1 || p.status === undefined) && (!destId || p.destination_id == destId));
    if (dataList.length === 0) {
      dataList = inMemoryStore.packages.filter(p => p.status === 1 || p.status === undefined);
    }
  }

  return res.render('package', getBasePageData(req, {
    slug,
    type,
    destinationName: destObj.destination_name || 'Destination',
    cover: destObj.card_image || destObj.Inner_image || destObj.inner_image || '',
    description: destObj.discription || '',
    data: dataList
  }));
});

router.get(['/package-details.php', '/package-details'], (req, res) => {
  const id = req.query.id || req.query.slug;
  let pkgData = id ? inMemoryStore.packages.find(p => (p.package_id == id || p.slug_url === id) && (p.status === 1 || p.status === undefined)) : null;
  if (!pkgData && inMemoryStore.packages.length > 0) {
    pkgData = inMemoryStore.packages[0];
  }
  return res.render('package-details', getBasePageData(req, { pkgData }));
});

router.get(['/tickets.php', '/tickets'], (req, res) => res.render('tickets', getBasePageData(req)));

router.get(['/tickets-details.php', '/tickets-details'], (req, res) => {
  const id = req.query.id || req.query.slug;
  let ticketData = id ? inMemoryStore.tickets.find(t => (t.ticket_id == id || t.slug_url === id) && (t.status === 1 || t.status === undefined)) : null;
  if (!ticketData && inMemoryStore.tickets.length > 0) {
    ticketData = inMemoryStore.tickets[0];
  }
  return res.render('tickets-details', getBasePageData(req, { ticketData }));
});

router.get(['/activity-details.php', '/activity-details'], (req, res) => {
  const id = req.query.id || req.query.slug;
  let activityData = id ? inMemoryStore.activities.find(a => (a.activity_id == id || a.slug_url === id) && (a.status === 1 || a.status === undefined)) : null;
  if (!activityData && inMemoryStore.activities.length > 0) {
    activityData = inMemoryStore.activities[0];
  }
  return res.render('activity-details', getBasePageData(req, { activityData }));
});

// Blog Pages
router.get(['/blog.php', '/blog'], (req, res) => res.redirect('/'));

router.get(['/blog-details.php', '/blog-details'], (req, res) => {
  const id = req.query.id || req.query.slug;
  let blogData = id ? inMemoryStore.blogs.find(b => (b.blog_id == id || b.slug_url === id) && (b.status === 1 || b.status === undefined)) : null;
  if (!blogData && inMemoryStore.blogs.length > 0) {
    blogData = inMemoryStore.blogs[0];
  }
  const latestPosts = inMemoryStore.blogs.filter(b => (b.status === 1 || b.status === undefined)).slice(0, 5);
  const mightLikePosts = inMemoryStore.blogs.filter(b => (b.status === 1 || b.status === undefined) && b.blog_id != (blogData ? blogData.blog_id : 0)).slice(0, 3);
  return res.render('blog-details', getBasePageData(req, { blogData, latestPosts, mightLikePosts }));
});

// Specialty Pages
router.get('/global-visa-services.php', (req, res) => res.render('global-visa-services', getBasePageData(req)));
router.get('/mice-tourism.php', (req, res) => res.render('mice-tourism', getBasePageData(req)));
router.get('/honeymoon-packages.php', (req, res) => res.render('honeymoon-packages', getBasePageData(req)));
router.get('/curated-itineraries.php', (req, res) => res.render('curated-itineraries', getBasePageData(req)));
router.get('/holiday-package.php', (req, res) => res.render('holiday-package', getBasePageData(req)));
router.get('/travel-insurance.php', (req, res) => res.render('travel-insurance', getBasePageData(req)));
router.get('/flight-tickets.php', (req, res) => res.render('flight-tickets', getBasePageData(req)));
router.get('/cruises.php', (req, res) => res.render('cruises', getBasePageData(req)));
router.get('/miscellaneous.php', (req, res) => res.render('miscellaneous', getBasePageData(req)));
router.get('/attraction.php', (req, res) => res.render('attraction', getBasePageData(req)));
router.get('/fixed-departures.php', (req, res) => {
  const pkgs = inMemoryStore.packages.filter(p => p.status === 1 && (p.category === 'Fixed Departure' || p.category === 'fixed_departures' || p.featured === 1));
  return res.render('fixed-departures', getBasePageData(req, { packages: pkgs }));
});
router.get('/fixed-departure-details.php', (req, res) => res.render('fixed-departure-details', getBasePageData(req)));

module.exports = router;
