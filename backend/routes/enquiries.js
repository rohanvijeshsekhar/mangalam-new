const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();

// Map enquiry store object to standard API schema
const map = e => ({
  enquiry_id:      e.id,
  destination:     e.destination || '',
  destination_name:e.destination_name || e.destination || '',
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
  created_at:      e.created_at
});

// GET all enquiries (Admin)
router.get('/', (req, res) => {
  res.json(store.getAll('enquiries').map(map));
});

// GET single enquiry
router.get('/:id', (req, res) => {
  const item = store.getOne('enquiries', x => x.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Enquiry not found' });
  res.json(map(item));
});

// POST submit new enquiry (Public)
router.post('/', (req, res) => {
  const { destination, destination_name, start_date, end_date, duration_days, adults, children, children_ages, hotel_rating, places_to_visit, name, email, phone, notes } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone number are required.' });
  }

  const doc = store.insert('enquiries', {
    destination: destination || '',
    destination_name: destination_name || destination || 'Custom Trip',
    start_date: start_date || '',
    end_date: end_date || '',
    duration_days: Number(duration_days) || 0,
    adults: Number(adults) || 1,
    children: Number(children) || 0,
    children_ages: Array.isArray(children_ages) ? children_ages : [],
    hotel_rating: hotel_rating || '3-Star',
    places_to_visit: Array.isArray(places_to_visit) ? places_to_visit : [],
    name,
    email: email || '',
    phone,
    notes: notes || '',
    status: 'New'
  });

  res.status(201).json({ success: true, message: 'Enquiry submitted successfully!', enquiry: map(doc) });
});

// PUT update status (Admin)
router.put('/:id', verifyToken, (req, res) => {
  const { status } = req.body;
  const doc = store.update('enquiries', req.params.id, { status: status || 'New' });
  if (!doc) return res.status(404).json({ error: 'Enquiry not found' });
  res.json({ success: true, message: 'Status updated', enquiry: map(doc) });
});

// DELETE enquiry (Admin)
router.delete('/:id', verifyToken, (req, res) => {
  store.remove('enquiries', req.params.id);
  res.json({ success: true, message: 'Enquiry deleted' });
});

module.exports = router;
