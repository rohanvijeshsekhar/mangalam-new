const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e5);
    cb(null, 'resume-' + unique + path.extname(file.originalname).toLowerCase());
  }
});
const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

const map = e => ({
  enquiry_id:      e.id,
  enquiry_type:    e.enquiry_type || (e.package_name ? 'Package' : (e.destination_name || e.destination ? 'Destination' : 'General')),
  package_name:    e.package_name || '',
  package_id:      e.package_id || null,
  destination:     e.destination || '',
  destination_name:e.destination_name || e.destination || e.package_name || 'Custom Trip',
  start_date:      e.start_date || '',
  end_date:        e.end_date || '',
  duration_days:   e.duration_days ? Number(e.duration_days) : null,
  adults:          (e.adults !== null && e.adults !== undefined && e.adults !== '') ? Number(e.adults) : null,
  children:        (e.children !== null && e.children !== undefined && e.children !== '') ? Number(e.children) : null,
  children_ages:   Array.isArray(e.children_ages) ? e.children_ages : [],
  hotel_rating:    e.hotel_rating || '',
  places_to_visit: Array.isArray(e.places_to_visit) ? e.places_to_visit : [],
  name:            e.name || '',
  email:           e.email || '',
  phone:           e.phone || '',
  notes:           e.notes || '',
  status:          e.status || 'New',
  created_at:      e.created_at || new Date().toISOString()
});

// GET all enquiries (Admin)
router.get('/', async (req, res) => {
  try {
    const all = await store.getAll('enquiries', '', [], 'ORDER BY id DESC');
    res.json(all.map(map));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

// GET single enquiry
router.get('/:id', async (req, res) => {
  try {
    const item = await store.getById('enquiries', req.params.id);
    if (!item) return res.status(404).json({ error: 'Enquiry not found' });
    res.json(map(item));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch enquiry' });
  }
});

const sanitizeText = (v, maxLen = 2000) =>
  String(v === null || v === undefined ? '' : v)
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLen);

function isValidPhone(raw) {
  const s = String(raw || '').trim();
  if (!/^[+\d][\d\s\-().]{5,24}$/.test(s)) return false;
  const digits = s.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

const enquiryRateMap = new Map();
function checkEnquiryRateLimit(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const entries = (enquiryRateMap.get(ip) || []).filter(ts => now - ts < windowMs);
  if (entries.length >= 30) return false;
  entries.push(now);
  enquiryRateMap.set(ip, entries);
  return true;
}

// Helper to extract and insert enquiry
async function createEnquiryDoc(body, defaultType = 'General') {
  const name = sanitizeText(body.name || body.customer_name || body.fullname || body.applicant_name || 'Anonymous', 200) || 'Anonymous';
  const phone = sanitizeText(body.phone || body.customer_phone || body.mobile || body.contact || '', 40);
  const email = sanitizeText(body.email || body.customer_email || '', 200);
  const packageName = sanitizeText(body.package_name || body.package_title || body.package || '', 240);
  const position = sanitizeText(body.position || body.job_title || body.role || '', 200);
  const destinationRaw = sanitizeText(body.destination || '', 240);
  const destinationName = sanitizeText(
    body.destination_name || body.destination || body.target_location || (position ? `Career: ${position}` : packageName) || (defaultType === 'Career Application' ? 'Career Application' : 'Custom Trip'),
    240
  );
  const resolvedType = sanitizeText(body.enquiry_type || (position || defaultType === 'Career Application' ? 'Career Application' : (packageName ? 'Package' : (body.destination_name || body.destination ? 'Destination' : defaultType))), 80);

  let notes = sanitizeText(body.notes || body.message || body.special_requests || body.comments || '', 3000);
  const budget = sanitizeText(body.approximate_budget || body.budget || '', 120);
  if (budget && !notes.includes('Approximate Budget')) {
    notes = `Approximate Budget (INR): ${budget}${notes ? '\n' + notes : ''}`;
  }
  if (position && !notes.includes('Position Applied')) {
    notes = `Position Applied: ${position}\n${notes}`.trim();
  }
  if (body.resume_url || body.resume) {
    notes = `${notes}\nResume: ${sanitizeText(body.resume_url || body.resume, 500)}`.trim();
  }

  return await store.insert('enquiries', {
    enquiry_type: resolvedType,
    package_name: packageName,
    package_id: body.package_id || null,
    destination: destinationRaw,
    destination_name: destinationName,
    start_date: sanitizeText(body.start_date || body.travel_date || '', 50),
    end_date: sanitizeText(body.end_date || '', 50),
    duration_days: (body.duration_days || body.duration || body.days) ? Number(body.duration_days || body.duration || body.days) : null,
    adults: (body.adults !== undefined && body.adults !== null && body.adults !== '') ? Number(body.adults) : ((body.adult_count || body.passengers) ? Number(body.adult_count || body.passengers) : null),
    children: (body.children !== undefined && body.children !== null && body.children !== '') ? Number(body.children) : ((body.child_count) ? Number(body.child_count) : null),
    children_ages: Array.isArray(body.children_ages) ? body.children_ages : [],
    hotel_rating: sanitizeText(body.hotel_rating || body.hotel_preference || '', 50),
    places_to_visit: Array.isArray(body.places_to_visit) ? body.places_to_visit : [],
    name,
    email,
    phone,
    notes,
    status: sanitizeText(body.status || 'New', 40) || 'New'
  });
}

// POST submit new enquiry
router.post('/', uploadResume.single('resume'), async (req, res) => {
  try {
    const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    if (!checkEnquiryRateLimit(clientIp)) {
      return res.status(429).json({ error: 'Too many requests. Please wait a few minutes and try again.' });
    }

    const body = { ...req.body };
    if (body._hp && String(body._hp).trim() !== '') {
      return res.status(400).json({ error: 'Invalid submission.' });
    }

    if (req.file) {
      body.resume_url = `/uploads/${req.file.filename}`;
      body.resume = req.file.originalname;
    }
    const name = sanitizeText(body.name || body.customer_name || body.fullname, 200);
    const phone = sanitizeText(body.phone || body.customer_phone || body.mobile, 40);

    if (!name && !phone) {
      return res.status(400).json({ error: 'Name and phone number are required.' });
    }
    if (body.source === 'landing-trivandrum') {
      if (!name || name.length < 2) {
        return res.status(400).json({ error: 'Please enter your name.' });
      }
      if (!phone || !isValidPhone(phone)) {
        return res.status(400).json({ error: 'Please enter a valid phone or WhatsApp number.' });
      }
      const destVal = sanitizeText(body.destination || body.destination_name, 240);
      if (!destVal || destVal.length < 2) {
        return res.status(400).json({ error: 'Please enter your preferred destination.' });
      }
      if (body.adults !== undefined && body.adults !== null && body.adults !== '') {
        const numTrav = Number(body.adults);
        if (!Number.isFinite(numTrav) || numTrav < 1) {
          return res.status(400).json({ error: 'Number of travellers must be at least 1.' });
        }
      }
      if (body.consent !== true && body.consent !== 'true' && body.consent !== 'on') {
        return res.status(400).json({ error: 'Please confirm your consent to be contacted about this enquiry.' });
      }
    } else if (phone && !isValidPhone(phone)) {
      return res.status(400).json({ error: 'Please enter a valid phone number.' });
    }

    const doc = await createEnquiryDoc(body);
    res.status(201).json({ success: true, message: 'Enquiry submitted successfully!', enquiry: map(doc) });
  } catch (e) {
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
});

// POST /contact
router.post('/contact', async (req, res) => {
  try {
    const doc = await createEnquiryDoc(req.body, 'Contact Message');
    res.status(201).json({ success: true, message: 'Thank you for reaching out! We will contact you shortly.', enquiry: map(doc) });
  } catch (e) {
    res.status(500).json({ error: 'Failed to submit contact message' });
  }
});

// POST /cart
router.post('/cart', async (req, res) => {
  try {
    const doc = await createEnquiryDoc(req.body, 'Cart / Activity Booking');
    res.status(201).json({ success: true, message: 'Booking enquiry submitted successfully!', enquiry: map(doc) });
  } catch (e) {
    res.status(500).json({ error: 'Failed to submit booking' });
  }
});

// POST /career
router.post('/career', uploadResume.single('resume'), async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file) {
      body.resume_url = `/uploads/${req.file.filename}`;
      body.resume = req.file.originalname;
    }
    const doc = await createEnquiryDoc(body, 'Career Application');
    if (req.headers['accept']?.includes('text/html') || req.headers['content-type']?.includes('multipart/form-data')) {
      return res.redirect('/thankyou.html');
    }
    res.status(201).json({ success: true, message: 'Application submitted successfully!', enquiry: map(doc) });
  } catch (e) {
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// PUT update status & details (Admin)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updates = {};
    if (req.body.status !== undefined) updates.status = req.body.status;
    if (req.body.enquiry_type !== undefined) updates.enquiry_type = req.body.enquiry_type;
    if (req.body.destination_name !== undefined) updates.destination_name = req.body.destination_name;
    if (req.body.package_name !== undefined) updates.package_name = req.body.package_name;
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.phone !== undefined) updates.phone = req.body.phone;
    if (req.body.email !== undefined) updates.email = req.body.email;
    if (req.body.hotel_rating !== undefined) updates.hotel_rating = req.body.hotel_rating;
    if (req.body.start_date !== undefined) updates.start_date = req.body.start_date;
    if (req.body.end_date !== undefined) updates.end_date = req.body.end_date;
    if (req.body.adults !== undefined) updates.adults = Number(req.body.adults);
    if (req.body.children !== undefined) updates.children = Number(req.body.children);
    if (req.body.duration_days !== undefined) updates.duration_days = Number(req.body.duration_days);
    if (req.body.notes !== undefined) updates.notes = req.body.notes;

    const doc = await store.update('enquiries', req.params.id, updates);
    if (!doc) return res.status(404).json({ error: 'Enquiry not found' });
    res.json({ success: true, message: 'Enquiry updated', enquiry: map(doc) });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update enquiry' });
  }
});

// DELETE enquiry (Admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await store.remove('enquiries', req.params.id);
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

router.createEnquiryDoc = createEnquiryDoc;
router.uploadResume = uploadResume;

module.exports = router;
