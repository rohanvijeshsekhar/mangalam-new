const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();
const slugify = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const map = a => ({
  attraction_id:   a.id,
  name:            a.name || a.title || '',
  title:           a.name || a.title || '',
  slug_url:        a.slug_url || (a.name ? slugify(a.name) : ''),
  card_image:      a.card_image || a.image || '',
  banner_image:    a.banner_image || a.card_image || a.image || '',
  experience_type: a.experience_type || 'Cultural',
  duration:        a.duration || '2-3 Hours',
  included:        a.included || 'Entry Ticket & Guide',
  destination_name:a.destination_name || 'Dubai, UAE',
  price:           a.price || a.amount || 0,
  amount:          a.price || a.amount || 0,
  description:     a.description || a.overview || '',
  overview:        a.description || a.overview || '',
  created_at:      a.created_at
});

// Seed default attractions if empty
function ensureSeed() {
  const existing = store.getAll('attractions');
  if (!existing || existing.length === 0) {
    const seeds = [
      {
        name: 'Burj Khalifa Observation Deck & Sky Views',
        card_image: './assets/images/burjkhalifa.webp',
        banner_image: './assets/images/burjkhalifa.webp',
        experience_type: 'Luxury',
        duration: '2-3 Hours',
        included: 'At The Top Level 124 & 125 Entry Pass, Telescope Access, High Speed Elevator, WiFi Access',
        destination_name: 'Dubai, UAE',
        price: 3800,
        description: 'Ascend the world\'s tallest skyscraper, Burj Khalifa, and enjoy breathtaking 360-degree panoramic views of Dubai\'s futuristic skyline, Arabian Gulf, and desert landscapes from the 124th and 125th floors.'
      },
      {
        name: 'Desert Safari with BBQ Dinner & Dune Bashing',
        card_image: './assets/images/activity-1.webp',
        banner_image: './assets/images/activity-1.webp',
        experience_type: 'Adventure',
        duration: '6 Hours',
        included: '4x4 Dune Bashing, Camel Riding, Live Tanoura & Belly Dance Shows, Gourmet BBQ Dinner, Henna Painting',
        destination_name: 'Dubai, UAE',
        price: 2400,
        description: 'Immerse yourself in Arabian culture with an exhilarating 4x4 dune bashing adventure, sunset camel ride, traditional desert camp entertainment, and a delicious barbecue feast under the stars.'
      },
      {
        name: 'Museum of the Future Interactive Experience',
        card_image: './assets/images/museumoffuture.webp',
        banner_image: './assets/images/museumoffuture.webp',
        experience_type: 'Cultural',
        duration: '3 Hours',
        included: 'Timed Entry Ticket, Access to All 5 Futuristic Floor Exhibits, Interactive AI Installations',
        destination_name: 'Dubai, UAE',
        price: 3500,
        description: 'Explore futuristic innovations, space travel simulations, climate sanctuary exhibits, and groundbreaking technological design at the iconic Museum of the Future.'
      },
      {
        name: 'Dubai Marina Luxury Yacht Cruise & Sightseeing',
        card_image: './assets/images/activity-2.webp',
        banner_image: './assets/images/activity-2.webp',
        experience_type: 'Luxury',
        duration: '2 Hours',
        included: 'Luxury Yacht Access, Soft Drinks & Refreshments, Professional Captain & Crew, Live Music',
        destination_name: 'Dubai Marina, UAE',
        price: 2900,
        description: 'Sail through the stunning Dubai Marina canal, JBR skyline, and Atlantis The Palm on a premium private or shared luxury yacht with complimentary refreshments and photography spots.'
      }
    ];
    seeds.forEach(s => {
      store.insert('attractions', {
        ...s,
        slug_url: slugify(s.name)
      });
    });
  }
}

router.get('/', (req, res) => {
  ensureSeed();
  res.json(store.getAll('attractions').map(map));
});

router.get('/:id', (req, res) => {
  ensureSeed();
  const a = store.getOne('attractions', x => x.id === Number(req.params.id) || x.slug_url === req.params.id);
  if (!a) return res.status(404).json({ error: 'Not found' });
  res.json(map(a));
});

router.post('/', verifyToken, (req, res) => {
  const { name, card_image, banner_image, experience_type, duration, included, destination_name, price, description } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const doc = store.insert('attractions', {
    name,
    slug_url: slugify(name),
    card_image: card_image || '',
    banner_image: banner_image || card_image || '',
    experience_type: experience_type || 'Cultural',
    duration: duration || '2-3 Hours',
    included: included || '',
    destination_name: destination_name || '',
    price: Number(price) || 0,
    description: description || ''
  });
  res.status(201).json(map(doc));
});

router.put('/:id', verifyToken, (req, res) => {
  const { name, card_image, banner_image, experience_type, duration, included, destination_name, price, description } = req.body;
  const updates = {
    name,
    card_image,
    banner_image,
    experience_type,
    duration,
    included,
    destination_name,
    price: price !== undefined ? Number(price) : undefined,
    description
  };
  if (name) updates.slug_url = slugify(name);
  const doc = store.update('attractions', req.params.id, updates);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Updated', ...map(doc) });
});

router.delete('/:id', verifyToken, (req, res) => {
  store.remove('attractions', req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
