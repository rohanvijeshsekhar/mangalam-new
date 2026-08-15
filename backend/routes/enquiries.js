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

// Map enquiry store object to standard API schema
const map = e => ({
  enquiry_id:      e.id,
  enquiry_type:    e.enquiry_type || (e.package_name ? 'Package' : (e.destination_name || e.destination ? 'Destination' : 'General')),
  package_name:    e.package_name || '',
  package_id:      e.package_id || null,
  destination:     e.destination || '',
  destination_name:e.destination_name || e.destination || e.package_name || 'Custom Trip',
  start_date:      e.start_date || '',
  end_date:        e.end_date || '',
  duration_days:   e.duration_days || 0,
  adults:          e.adults || 1,
  children:        e.children || 0,
  children_ages:   e.children_ages || [],
  hotel_rating:    e.hotel_rating || '3-Star',
  places_to_visit: e.places_to_visit || [],
  name:            e.name || '',
  email:           e.email || '',
  phone:           e.phone || '',
  notes:           e.notes || '',
  status:          e.status || 'New',
  created_at:      e.created_at || new Date().toISOString()
});

// GET all enquiries (Admin)
router.get('/', (req, res) => {
  const all = store.getAll('enquiries').map(map);
  // Return newest first
  all.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  res.json(all);
});

// GET single enquiry
router.get('/:id', (req, res) => {
  const item = store.getOne('enquiries', x => x.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Enquiry not found' });
  res.json(map(item));
});

// Helper to extract and insert enquiry
function createEnquiryDoc(body, defaultType = 'General') {
  const name = body.name || body.customer_name || body.fullname || body.applicant_name || 'Anonymous';
  const phone = body.phone || body.customer_phone || body.mobile || body.contact || '';
  const email = body.email || body.customer_email || '';
  const packageName = body.package_name || body.package_title || body.package || '';
  const position = body.position || body.job_title || body.role || '';
  const destinationName = body.destination_name || body.destination || body.target_location || (position ? `Career: ${position}` : packageName) || (defaultType === 'Career Application' ? 'Career Application' : 'Custom Trip');
  const resolvedType = body.enquiry_type || (position || defaultType === 'Career Application' ? 'Career Application' : (packageName ? 'Package' : (body.destination_name || body.destination ? 'Destination' : defaultType)));

  let notes = body.notes || body.message || body.special_requests || body.comments || '';
  if (position && !notes.includes('Position Applied')) {
    notes = `Position Applied: ${position}\n${notes}`.trim();
  }
  if (body.resume_url || body.resume) {
    notes = `${notes}\nResume: ${body.resume_url || body.resume}`.trim();
  }

  return store.insert('enquiries', {
    enquiry_type: resolvedType,
    package_name: packageName,
    package_id: body.package_id || null,
    destination: body.destination || '',
    destination_name: destinationName,
    start_date: body.start_date || body.travel_date || '',
    end_date: body.end_date || '',
    duration_days: Number(body.duration_days || body.duration || body.days) || 0,
    adults: Number(body.adults || body.adult_count || body.passengers) || 1,
    children: Number(body.children || body.child_count) || 0,
    children_ages: Array.isArray(body.children_ages) ? body.children_ages : [],
    hotel_rating: body.hotel_rating || body.hotel_preference || '3-Star',
    places_to_visit: Array.isArray(body.places_to_visit) ? body.places_to_visit : [],
    name,
    email,
    phone,
    notes,
    status: body.status || 'New'
  });
}

// POST submit new enquiry (Public or Admin)
router.post('/', uploadResume.single('resume'), (req, res) => {
  const body = { ...req.body };
  if (req.file) {
    body.resume_url = `/uploads/${req.file.filename}`;
    body.resume = req.file.originalname;
  }
  const name = body.name || body.customer_name || body.fullname;
  const phone = body.phone || body.customer_phone || body.mobile;

  if (!name && !phone) {
    return res.status(400).json({ error: 'Name or phone number is required.' });
  }

  const doc = createEnquiryDoc(body);
  res.status(201).json({ success: true, message: 'Enquiry submitted successfully!', enquiry: map(doc) });
});

// POST /contact
router.post('/contact', (req, res) => {
  const doc = createEnquiryDoc(req.body, 'Contact Message');
  res.status(201).json({ success: true, message: 'Thank you for reaching out! We will contact you shortly.', enquiry: map(doc) });
});

// POST /cart
router.post('/cart', (req, res) => {
  const doc = createEnquiryDoc(req.body, 'Cart / Activity Booking');
  res.status(201).json({ success: true, message: 'Booking enquiry submitted successfully!', enquiry: map(doc) });
});

// POST /career
router.post('/career', uploadResume.single('resume'), (req, res) => {
  const body = { ...req.body };
  if (req.file) {
    body.resume_url = `/uploads/${req.file.filename}`;
    body.resume = req.file.originalname;
  }
  const doc = createEnquiryDoc(body, 'Career Application');
  if (req.headers['accept']?.includes('text/html') || req.headers['content-type']?.includes('multipart/form-data')) {
    return res.redirect('/thankyou.html');
  }
  res.status(201).json({ success: true, message: 'Application submitted successfully!', enquiry: map(doc) });
});

// PUT update status & details (Admin)
router.put('/:id', verifyToken, (req, res) => {
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

  const doc = store.update('enquiries', req.params.id, updates);
  if (!doc) return res.status(404).json({ error: 'Enquiry not found' });
  res.json({ success: true, message: 'Enquiry updated', enquiry: map(doc) });
});

// DELETE enquiry (Admin)
router.delete('/:id', verifyToken, (req, res) => {
  store.remove('enquiries', req.params.id);
  res.json({ success: true, message: 'Enquiry deleted' });
});

router.createEnquiryDoc = createEnquiryDoc;
router.uploadResume = uploadResume;

module.exports = router;
