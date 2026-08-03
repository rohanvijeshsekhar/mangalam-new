const inMemoryStore = require('../data/inMemoryStore');

const getUploadedFile = (req) => {
  if (req.file) return req.file;
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    return req.files[0];
  }
  return null;
};

const extractId = (req) => {
  if (req.query && (req.query.id || req.query.destination_id || req.query.package_id || req.query.activity_id || req.query.ticket_id)) {
    return req.query.id || req.query.destination_id || req.query.package_id || req.query.activity_id || req.query.ticket_id;
  }
  if (req.body) {
    if (req.body.id || req.body.destination_id || req.body.package_id || req.body.activity_id || req.body.ticket_id) {
      return req.body.id || req.body.destination_id || req.body.package_id || req.body.activity_id || req.body.ticket_id;
    }
    if (typeof req.body === 'object') {
      const keys = Object.keys(req.body);
      if (keys.length > 0) {
        try {
          const parsed = JSON.parse(keys[0]);
          if (parsed && (parsed.id || parsed.destination_id || parsed.package_id || parsed.activity_id || parsed.ticket_id)) {
            return parsed.id || parsed.destination_id || parsed.package_id || parsed.activity_id || parsed.ticket_id;
          }
        } catch (e) {}
      }
    }
  }
  return null;
};

const getNextId = (arr, idKey = 'id') => {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return 1;
  const max = Math.max(...arr.map(item => Number(item[idKey] || item.id || 0)));
  return (isFinite(max) && max > 0) ? max + 1 : 1;
};

class AdminController {
  // ─── DASHBOARD & METRICS ───
  getDashboard(req, res) {
    return res.json({
      destinations_count: (inMemoryStore.destinations || []).length,
      packages_count: (inMemoryStore.packages || []).length,
      activities_count: (inMemoryStore.activities || []).length,
      tickets_count: (inMemoryStore.tickets || []).length,
      blogs_count: (inMemoryStore.blogs || []).length,
      cart_enquiry_count: (inMemoryStore.cartEnquiries || inMemoryStore.enquiryCart || []).length,
      contact_enquiry_count: (inMemoryStore.enquiries || inMemoryStore.contactEnquiries || []).length,
      career_enquiry_count: (inMemoryStore.careerApplications || inMemoryStore.careerEnquiries || []).length,
      customize_enquiry_count: (inMemoryStore.customizeRequests || inMemoryStore.customizationEnquiries || []).length
    });
  }

  getEnquiryCounts(req, res) {
    const cart = (inMemoryStore.cartEnquiries || inMemoryStore.enquiryCart || []).length;
    const contact = (inMemoryStore.enquiries || inMemoryStore.contactEnquiries || []).length;
    const career = (inMemoryStore.careerApplications || inMemoryStore.careerEnquiries || []).length;
    const customize = (inMemoryStore.customizeRequests || inMemoryStore.customizationEnquiries || []).length;
    return res.json({
      cart,
      contact,
      career,
      customize,
      package: cart,
      blog: 0
    });
  }

  // ─── DESTINATIONS CRUD ───
  listDestinations(req, res) {
    return res.json(inMemoryStore.destinations);
  }

  fetchDestinationEdit(req, res) {
    const id = extractId(req);
    const dest = inMemoryStore.destinations.find(d => d.destination_id == id || d.id == id);
    return res.json(dest ? [dest] : []);
  }

  createDestination(req, res) {
    const destinationName = req.body.destinationName || req.body.destination_name || '';
    const featured = req.body.featured !== undefined ? Number(req.body.featured) : 0;
    const slug_url = req.body.slug_url || (destinationName ? destinationName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : '');
    const meta = req.body.meta || '';
    const discription = req.body.discription || req.body.description || '';
    
    let card_image = 'assets/images/destinations/default.jpg';
    let icon_image = 'd-icon-1.png';
    let inner_image = '';

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const cardFile = req.files.find(f => f.fieldname === 'destinationCardImage' || f.fieldname === 'card_image') || req.files[0];
      if (cardFile) card_image = `uploads/${cardFile.filename}`;
      
      const iconFile = req.files.find(f => f.fieldname === 'destinationIcon' || f.fieldname === 'icon');
      if (iconFile) icon_image = `uploads/${iconFile.filename}`;

      const innerFile = req.files.find(f => f.fieldname === 'destinationInnerImage' || f.fieldname === 'inner_image');
      if (innerFile) inner_image = `uploads/${innerFile.filename}`;
    } else if (req.file) {
      card_image = `uploads/${req.file.filename}`;
    }

    const newDest = {
      destination_id: getNextId(inMemoryStore.destinations, 'destination_id'),
      destination_name: destinationName,
      card_image: card_image,
      icon: icon_image,
      inner_image: inner_image || card_image,
      Inner_image: inner_image || card_image,
      featured: featured,
      slug_url: slug_url,
      meta: meta,
      discription: discription,
      status: 1,
      created_at: new Date().toISOString()
    };
    inMemoryStore.destinations.push(newDest);
    inMemoryStore.syncDestination(newDest);
    return res.json([{ status: 1, msg: "Destination Created Successfully" }]);
  }

  editDestination(req, res) {
    const id = extractId(req);
    const index = inMemoryStore.destinations.findIndex(d => d.destination_id == id || d.id == id);
    if (index !== -1) {
      const dest = inMemoryStore.destinations[index];
      dest.destination_name = req.body.destinationName || req.body.destination_name || dest.destination_name;
      dest.featured = req.body.featured !== undefined ? Number(req.body.featured) : dest.featured;
      dest.slug_url = req.body.slug_url || (dest.destination_name ? dest.destination_name.toLowerCase().replace(/\s+/g, '-') : dest.slug_url);
      dest.meta = req.body.meta || dest.meta;
      dest.discription = req.body.discription || req.body.description || dest.discription;

      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const cardFile = req.files.find(f => f.fieldname === 'destinationCardImage' || f.fieldname === 'card_image');
        if (cardFile) {
          dest.card_image = `uploads/${cardFile.filename}`;
        }

        const iconFile = req.files.find(f => f.fieldname === 'destinationIcon' || f.fieldname === 'icon');
        if (iconFile) {
          dest.icon = `uploads/${iconFile.filename}`;
        }

        const innerFile = req.files.find(f => f.fieldname === 'destinationInnerImage' || f.fieldname === 'inner_image' || f.fieldname === 'Inner_image');
        if (innerFile) {
          dest.inner_image = `uploads/${innerFile.filename}`;
          dest.Inner_image = `uploads/${innerFile.filename}`;
        }
      } else if (req.file) {
        dest.card_image = `uploads/${req.file.filename}`;
      }

      inMemoryStore.syncDestination(dest);
    }
    return res.json([{ status: 1, msg: "Destination Updated Successfully" }]);
  }

  deleteDestination(req, res) {
    const id = extractId(req);
    if (id !== null) {
      inMemoryStore.deleteDestination(id);
    }
    return res.send('1');
  }

  // ─── PLACES CRUD ───
  listPlaces(req, res) {
    return res.json(inMemoryStore.places);
  }
  fetchPlaceEdit(req, res) {
    const id = extractId(req);
    const p = inMemoryStore.places.find(item => item.id == id || item.place_id == id);
    return res.json(p ? [p] : []);
  }
  createPlace(req, res) {
    const uploadedFile = getUploadedFile(req);
    const fileName = uploadedFile ? `uploads/${uploadedFile.filename}` : 'default.jpg';
    const newPlace = {
      id: getNextId(inMemoryStore.places),
      place_id: getNextId(inMemoryStore.places, 'place_id'),
      destination_id: Number(req.body.destination) || Number(req.body.destination_id) || 1,
      place_name: req.body.place_name || '',
      meta: req.body.meta || '',
      card_image: fileName,
      status: 1
    };
    inMemoryStore.places.push(newPlace);
    inMemoryStore.syncPlace(newPlace);
    return res.json([{ status: 1, msg: "Place Created Successfully" }]);
  }
  editPlace(req, res) {
    const id = extractId(req);
    const p = inMemoryStore.places.find(item => item.id == id || item.place_id == id);
    if (p) {
      p.destination_id = Number(req.body.destination) || Number(req.body.destination_id) || p.destination_id;
      p.place_name = req.body.place_name || p.place_name;
      p.meta = req.body.meta || p.meta;
      const uploadedFile = getUploadedFile(req);
      if (uploadedFile) {
        p.card_image = `uploads/${uploadedFile.filename}`;
      }
      inMemoryStore.syncPlace(p);
    }
    return res.json([{ status: 1, msg: "Place Updated Successfully" }]);
  }
  deletePlace(req, res) {
    const id = extractId(req);
    if (id !== null) {
      inMemoryStore.deletePlace(id);
    }
    return res.send('1');
  }

  // ─── COLLECTIONS CRUD ───
  listCollections(req, res) { return res.json(inMemoryStore.collections); }
  createCollection(req, res) {
    const name = req.body.collectionName || req.body.title || '';
    const destinations = req.body.destinations || [];
    const newCol = {
      id: getNextId(inMemoryStore.collections),
      collection_name: name,
      title: name,
      destinations: destinations,
      status: 1,
      created_at: new Date().toISOString()
    };
    inMemoryStore.collections.push(newCol);
    inMemoryStore.syncCollection(newCol);
    return res.json([{ status: 1, msg: "Collection Created Successfully" }]);
  }
  fetchCollectionEdit(req, res) {
    const id = extractId(req);
    const c = inMemoryStore.collections.find(item => item.id == id);
    return res.json(c ? [c] : []);
  }
  editCollection(req, res) {
    const id = extractId(req);
    const c = inMemoryStore.collections.find(item => item.id == id);
    if (c) {
      const name = req.body.collectionName || req.body.title || c.title;
      c.collection_name = name;
      c.title = name;
      if (req.body.destinations) c.destinations = req.body.destinations;
      inMemoryStore.syncCollection(c);
    }
    return res.json([{ status: 1, msg: "Collection Updated Successfully" }]);
  }
  deleteCollection(req, res) {
    const id = extractId(req);
    if (id !== null) {
      inMemoryStore.deleteCollection(id);
    }
    return res.send('1');
  }

  listPackages(req, res) {
    const pkgs = (inMemoryStore.packages || []).map(p => {
      const dt = p.created_at ? new Date(p.created_at) : new Date();
      return {
        ...p,
        package_id: p.package_id || p.id || 1,
        id: p.package_id || p.id || 1,
        package_title: p.package_title || p.title || 'Untitled Package',
        createdDate: p.createdDate || dt.toISOString().split('T')[0],
        createdTime: p.createdTime || dt.toTimeString().split(' ')[0]
      };
    });
    return res.json(pkgs);
  }
  fetchPackageEdit(req, res) {
    const id = extractId(req);
    const pkg = inMemoryStore.packages.find(p => p.package_id == id || p.id == id);
    if (!pkg) return res.json([]);
    const resPkg = {
      ...pkg,
      destination_id: pkg.destination_id || 1,
      title: pkg.title || pkg.package_title || '',
      packageTitle: pkg.package_title || pkg.title || '',
      duration: pkg.duration || '',
      hotel_type: pkg.hotel_type || '',
      amount: pkg.amount || 0,
      description: pkg.description || pkg.discription || '',
      cancellation: pkg.cancellation || '',
      transportation: pkg.transportation || '',
      no_of_activites: pkg.no_of_activites || pkg.no_of_activities || 0,
      meta: pkg.meta || '',
      featured: pkg.featured || 0,
      card_image: pkg.card_image || '',
      package_images: pkg.images || [],
      highlights: pkg.highlights || [],
      includes: pkg.includes || [],
      excludes: pkg.excludes || [],
      itineary: pkg.itineraries || pkg.itineary || [],
      faq: pkg.faqs || pkg.faq || []
    };
    return res.json([resPkg]);
  }
  createPackage(req, res) {
    let card_image = 'assets/images/packages/default.jpg';
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const cardFile = req.files.find(f => f.fieldname === 'image_card' || f.fieldname === 'card_image') || req.files[0];
      if (cardFile) card_image = `uploads/${cardFile.filename}`;
    } else if (req.file) {
      card_image = `uploads/${req.file.filename}`;
    }

    const title = req.body.packageTitle || req.body.title || '';
    const destId = Number(req.body.destination) || Number(req.body.destination_id) || 1;

    let highlights = [], includes = [], excludes = [], thinksToKnow = [], faqs = [];
    try { if (req.body.highlights) highlights = typeof req.body.highlights === 'string' ? JSON.parse(req.body.highlights) : req.body.highlights; } catch(e){}
    try { if (req.body.includes) includes = typeof req.body.includes === 'string' ? JSON.parse(req.body.includes) : req.body.includes; } catch(e){}
    try { if (req.body.excludes) excludes = typeof req.body.excludes === 'string' ? JSON.parse(req.body.excludes) : req.body.excludes; } catch(e){}
    try { if (req.body.thinks_to_know) thinksToKnow = typeof req.body.thinks_to_know === 'string' ? JSON.parse(req.body.thinks_to_know) : req.body.thinks_to_know; } catch(e){}
    try { if (req.body.faq) faqs = typeof req.body.faq === 'string' ? JSON.parse(req.body.faq) : req.body.faq; } catch(e){}

    const newPkg = {
      package_id: getNextId(inMemoryStore.packages, 'package_id'),
      package_title: title,
      title: title,
      destination_id: destId,
      card_image: card_image,
      duration: req.body.duration || '',
      hotel_type: req.body.hotel_type || '',
      amount: Number(req.body.amount) || 0,
      no_of_activites: Number(req.body.activities) || Number(req.body.no_of_activites) || 0,
      cancellation: req.body.cancellation || '',
      transportation: req.body.transportation || '',
      featured: Number(req.body.featured) || 0,
      slug_url: req.body.slug_url || (title ? title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : ''),
      description: req.body.description || req.body.discription || '',
      meta: req.body.meta || '',
      category: req.body.category || 'Holiday Package',
      fixed_departure_date: req.body.fixed_departure_date || '',
      status: 1,
      created_at: new Date().toISOString(),
      images: [],
      highlights: highlights,
      includes: includes,
      excludes: excludes,
      thinksToKnow: thinksToKnow,
      itineraries: [],
      faqs: faqs
    };
    inMemoryStore.packages.push(newPkg);
    inMemoryStore.syncPackage(newPkg);
    return res.json([{ status: 1, msg: "Package Created Successfully" }]);
  }
  editPackage(req, res) {
    const id = extractId(req);
    const pkg = inMemoryStore.packages.find(p => p.package_id == id || p.id == id);
    if (pkg) {
      const title = req.body.packageTitle || req.body.title || pkg.title;
      Object.assign(pkg, {
        title: title,
        package_title: title,
        destination_id: Number(req.body.destination) || Number(req.body.destination_id) || pkg.destination_id,
        duration: req.body.duration !== undefined ? req.body.duration : pkg.duration,
        hotel_type: req.body.hotel_type !== undefined ? req.body.hotel_type : pkg.hotel_type,
        amount: (req.body.amount !== undefined && req.body.amount !== '') ? Number(req.body.amount) : pkg.amount,
        description: req.body.description || req.body.discription || pkg.description,
        meta: req.body.meta || pkg.meta,
        featured: req.body.featured !== undefined ? Number(req.body.featured) : pkg.featured
      });

      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const cardFile = req.files.find(f => f.fieldname === 'image_card' || f.fieldname === 'card_image') || req.files[0];
        if (cardFile) pkg.card_image = `uploads/${cardFile.filename}`;
      } else if (req.file) {
        pkg.card_image = `uploads/${req.file.filename}`;
      }

      inMemoryStore.syncPackage(pkg);
    }
    return res.json([{ status: 1, msg: "Package Updated Successfully" }]);
  }
  deletePackage(req, res) {
    const id = extractId(req);
    if (id !== null) {
      inMemoryStore.deletePackage(id);
    }
    return res.send('1');
  }
  deleteItinary(req, res) {
    const id = extractId(req);
    inMemoryStore.packages.forEach(p => {
      if (p.itineraries) p.itineraries = p.itineraries.filter(it => it.itineary_id != id && it.id != id);
    });
    return res.send('1');
  }

  // ─── ACTIVITIES CRUD ───
  listActivities(req, res) { return res.json(inMemoryStore.activities); }
  fetchActivityEdit(req, res) {
    const id = extractId(req);
    const act = inMemoryStore.activities.find(a => a.activity_id == id || a.id == id);
    if (!act) return res.json([]);
    const resAct = {
      ...act,
      destination_id: act.destination_id || 1,
      title: act.title || act.short_title || '',
      short_title: act.short_title || act.title || '',
      duration: act.duration || '',
      display_amount: act.display_amount || 0,
      child_amount: act.child_amount || 0,
      discount_amount: act.discount_amount || 0,
      description: act.description || act.discription || '',
      meta: act.meta || '',
      featured: act.featured || 0,
      card_image: act.card_image || '',
      activity_images: act.images || [],
      highlights: act.highlights || [],
      includes: act.includes || [],
      excludes: act.excludes || [],
      faq: act.faqs || act.faq || []
    };
    return res.json([resAct]);
  }
  createActivity(req, res) {
    const uploadedFile = getUploadedFile(req);
    const card_image = uploadedFile ? `uploads/${uploadedFile.filename}` : 'assets/images/activities/default.jpg';
    const title = req.body.title || req.body.activityTitle || '';
    const newAct = {
      activity_id: getNextId(inMemoryStore.activities, 'activity_id'),
      destination_id: Number(req.body.destination) || Number(req.body.destination_id) || 1,
      title: title,
      short_title: title,
      card_image: card_image,
      display_amount: Number(req.body.display_amount) || 0,
      child_amount: Number(req.body.child_amount) || 0,
      discount_amount: Number(req.body.discount_amount) || 0,
      duration: req.body.duration || '',
      featured: Number(req.body.featured) || 0,
      slug_url: req.body.slug_url || (title ? title.toLowerCase().replace(/\s+/g, '-') : ''),
      description: req.body.discription || req.body.description || '',
      meta: req.body.meta || '',
      status: 1,
      created_at: new Date().toISOString(),
      images: [], highlights: [], includes: [], excludes: [], thinksToKnow: [], faqs: []
    };
    inMemoryStore.activities.push(newAct);
    return res.json([{ status: 1, msg: "Activity Created Successfully" }]);
  }
  editActivity(req, res) {
    const id = extractId(req);
    const act = inMemoryStore.activities.find(a => a.activity_id == id || a.id == id);
    if (act) {
      const title = req.body.title || req.body.activityTitle || act.title;
      Object.assign(act, {
        title: title,
        short_title: title,
        display_amount: (req.body.display_amount !== undefined && req.body.display_amount !== '') ? Number(req.body.display_amount) : act.display_amount,
        child_amount: (req.body.child_amount !== undefined && req.body.child_amount !== '') ? Number(req.body.child_amount) : act.child_amount,
        description: req.body.discription || req.body.description || act.description,
        meta: req.body.meta || act.meta
      });
      const uploadedFile = getUploadedFile(req);
      if (uploadedFile) act.card_image = `uploads/${uploadedFile.filename}`;
    }
    return res.json([{ status: 1, msg: "Activity Updated Successfully" }]);
  }
  deleteActivity(req, res) {
    const id = extractId(req);
    if (id !== null) {
      inMemoryStore.activities = inMemoryStore.activities.filter(a => a.activity_id != id && a.id != id);
    }
    return res.send('1');
  }

  // ─── TICKETS CRUD ───
  listTickets(req, res) { return res.json(inMemoryStore.tickets); }
  fetchTicketEdit(req, res) {
    const id = extractId(req);
    const tkt = inMemoryStore.tickets.find(t => t.ticket_id == id || t.id == id);
    if (!tkt) return res.json([]);

    const responseTkt = {
      ...tkt,
      destination_id: tkt.destination_id || 1,
      title: tkt.title || tkt.short_title || '',
      short_title: tkt.short_title || tkt.title || '',
      duration: tkt.duration || '',
      hotel_type: tkt.hotel_type || '',
      description: tkt.description || tkt.discription || '',
      adult_msg: tkt.adult_msg || '',
      children_msg: tkt.children_msg || '',
      no_of_activities: tkt.no_of_activities || tkt.activities || 0,
      cancellation: tkt.cancellation || '',
      transportation: tkt.transportation || '',
      discount_amount: tkt.discount_amount || 0,
      display_amount: tkt.display_amount || tkt.amount || 0,
      child_amount: tkt.child_amount || tkt.children_amount || 0,
      validity: tkt.validity || tkt.Validity || '',
      required_age: tkt.required_age || '',
      meta: tkt.meta || '',
      featured: tkt.featured || 0,
      card_image: tkt.card_image || '',
      ticket_images: tkt.images || tkt.ticket_images || [],
      highlights: tkt.highlights || [],
      ticket_thinks_to_know: tkt.thinksToKnow || tkt.ticket_thinks_to_know || tkt.thinks_to_know || [],
      includes: tkt.includes || [],
      excludes: tkt.excludes || [],
      faq: tkt.faqs || tkt.faq || []
    };

    return res.json([responseTkt]);
  }
  createTicket(req, res) {
    let card_image = 'assets/images/tickets/default.jpg';
    let images = [];

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const cardFile = req.files.find(f => f.fieldname === 'card_image' || f.fieldname === 'image_card');
      if (cardFile) {
        card_image = `uploads/${cardFile.filename}`;
      } else {
        card_image = `uploads/${req.files[0].filename}`;
      }

      const imgFiles = req.files.filter(f => f.fieldname === 'images[]' || f.fieldname === 'images');
      if (imgFiles.length > 0) {
        images = imgFiles.map((f, i) => ({ ticket_image_id: i + 1, file_name: `uploads/${f.filename}`, status: 1 }));
      }
    } else if (req.file) {
      card_image = `uploads/${req.file.filename}`;
    }

    const parseJson = (val) => {
      if (!val) return [];
      if (typeof val === 'object') return val;
      try { return JSON.parse(val); } catch (e) { return []; }
    };

    const title = req.body.title || req.body.ticketTitle || '';
    const newTkt = {
      ticket_id: getNextId(inMemoryStore.tickets, 'ticket_id'),
      destination_id: Number(req.body.destination) || Number(req.body.destination_id) || 1,
      title: title,
      short_title: req.body.short_title || title,
      card_image: card_image,
      display_amount: Number(req.body.display_amount) || 0,
      child_amount: Number(req.body.children_amount || req.body.child_amount) || 0,
      discount_amount: Number(req.body.discount_amount) || 0,
      duration: req.body.duration || '',
      hotel_type: req.body.hotel_type || '',
      cancellation: req.body.cancellation || '',
      transportation: req.body.transportation || '',
      no_of_activities: Number(req.body.activities) || 0,
      required_age: req.body.required_age || '',
      validity: req.body.Validity || req.body.validity || '',
      adult_msg: req.body.adult_msg || '',
      children_msg: req.body.children_msg || '',
      featured: Number(req.body.featured) || 0,
      slug_url: req.body.slug_url || (title ? title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : `ticket-${Date.now()}`),
      description: req.body.discription || req.body.description || '',
      meta: req.body.meta || '',
      status: 1,
      created_at: new Date().toISOString(),
      images: images,
      highlights: parseJson(req.body.highlights),
      includes: parseJson(req.body.includes),
      excludes: parseJson(req.body.excludes),
      thinksToKnow: parseJson(req.body.thinks_to_know),
      faqs: parseJson(req.body.faq)
    };
    inMemoryStore.tickets.push(newTkt);
    inMemoryStore.syncTicket(newTkt);
    return res.json([{ status: 1, msg: "Ticket Created Successfully" }]);
  }
  editTicket(req, res) {
    const id = extractId(req);
    const tkt = inMemoryStore.tickets.find(t => t.ticket_id == id || t.id == id);
    if (tkt) {
      const parseJson = (val) => {
        if (!val) return [];
        if (typeof val === 'object') return val;
        try { return JSON.parse(val); } catch (e) { return []; }
      };
      const title = req.body.title || req.body.ticketTitle || tkt.title;
      const short_title = req.body.short_title || req.body.shortTitle || title;
      Object.assign(tkt, {
        title: title,
        short_title: short_title,
        destination_id: Number(req.body.destination) || Number(req.body.destination_id) || tkt.destination_id,
        display_amount: (req.body.display_amount !== undefined && req.body.display_amount !== '') ? Number(req.body.display_amount) : tkt.display_amount,
        child_amount: (req.body.children_amount !== undefined && req.body.children_amount !== '') ? Number(req.body.children_amount) : (req.body.child_amount !== undefined ? Number(req.body.child_amount) : tkt.child_amount),
        discount_amount: (req.body.discount_amount !== undefined && req.body.discount_amount !== '') ? Number(req.body.discount_amount) : tkt.discount_amount,
        duration: req.body.duration !== undefined ? req.body.duration : tkt.duration,
        hotel_type: req.body.hotel_type !== undefined ? req.body.hotel_type : tkt.hotel_type,
        cancellation: req.body.cancellation !== undefined ? req.body.cancellation : tkt.cancellation,
        transportation: req.body.transportation !== undefined ? req.body.transportation : tkt.transportation,
        no_of_activities: req.body.activities !== undefined ? Number(req.body.activities) : tkt.no_of_activities,
        required_age: req.body.required_age !== undefined ? req.body.required_age : tkt.required_age,
        validity: (req.body.validity || req.body.Validity) !== undefined ? (req.body.validity || req.body.Validity) : tkt.validity,
        adult_msg: req.body.adult_msg !== undefined ? req.body.adult_msg : tkt.adult_msg,
        children_msg: req.body.children_msg !== undefined ? req.body.children_msg : tkt.children_msg,
        description: req.body.discription || req.body.description || tkt.description,
        meta: req.body.meta || tkt.meta,
        featured: req.body.featured !== undefined ? Number(req.body.featured) : tkt.featured,
        slug_url: tkt.slug_url || (title ? title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : '')
      });

      if (req.body.highlights) tkt.highlights = parseJson(req.body.highlights);
      if (req.body.includes) tkt.includes = parseJson(req.body.includes);
      if (req.body.excludes) tkt.excludes = parseJson(req.body.excludes);
      if (req.body.thinks_to_know) tkt.thinksToKnow = parseJson(req.body.thinks_to_know);
      if (req.body.faq) tkt.faqs = parseJson(req.body.faq);

      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const cardFile = req.files.find(f => f.fieldname === 'card_image' || f.fieldname === 'image_card');
        if (cardFile) {
          tkt.card_image = `uploads/${cardFile.filename}`;
        }
        const imgFiles = req.files.filter(f => f.fieldname === 'images[]' || f.fieldname === 'images');
        if (imgFiles.length > 0) {
          tkt.images = imgFiles.map((f, i) => ({ ticket_image_id: i + 1, file_name: `uploads/${f.filename}`, status: 1 }));
        }
      } else if (req.file) {
        tkt.card_image = `uploads/${req.file.filename}`;
      }

      inMemoryStore.syncTicket(tkt);
    }
    return res.json([{ status: 1, msg: "Ticket Updated Successfully" }]);
  }
  deleteTicket(req, res) {
    const id = extractId(req);
    if (id !== null) {
      inMemoryStore.deleteTicket(id);
    }
    return res.send('1');
  }

  // ─── BLOGS CRUD ───
  listBlogs(req, res) { return res.json(inMemoryStore.blogs); }
  fetchBlogEdit(req, res) {
    const id = extractId(req);
    const blog = inMemoryStore.blogs.find(b => b.blog_id == id || b.id == id);
    if (!blog) return res.json([]);
    const cardImg = blog.card_image || (blog.images && blog.images.length > 0 ? (typeof blog.images[0] === 'object' ? (blog.images[0].file_name || blog.images[0].name || blog.images[0].image) : blog.images[0]) : '');
    return res.json([{
      ...blog,
      blog_title: blog.title || '',
      blog_image: cardImg,
      card_image: cardImg,
      images: blog.images && blog.images.length > 0 ? blog.images : [{ blog_image_id: 1, file_name: cardImg, name: cardImg, image: cardImg, status: 1 }]
    }]);
  }
  createBlog(req, res) {
    const uploadedFile = getUploadedFile(req);
    const fileName = uploadedFile ? `uploads/${uploadedFile.filename}` : 'assets/images/blogs/default.jpg';
    const title = req.body.title || req.body.blog_title || '';
    const newBlog = {
      blog_id: getNextId(inMemoryStore.blogs, 'blog_id'),
      title: title,
      date: req.body.date || new Date().toISOString().split('T')[0],
      description: req.body.description || req.body.discription || '',
      card_image: fileName,
      slug_url: req.body.slug_url || (title ? title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : `blog-${Date.now()}`),
      status: 1,
      created_at: new Date().toISOString(),
      images: [{ blog_image_id: 1, file_name: fileName, name: fileName, image: fileName, status: 1 }]
    };
    inMemoryStore.blogs.push(newBlog);
    inMemoryStore.syncBlog(newBlog);
    return res.json([{ status: 1, msg: "Blog Created Successfully" }]);
  }
  editBlog(req, res) {
    const id = extractId(req);
    const blog = inMemoryStore.blogs.find(b => b.blog_id == id || b.id == id);
    if (blog) {
      blog.title = req.body.title || req.body.blog_title || blog.title;
      blog.description = req.body.description || req.body.discription || blog.description;
      if (req.body.date) blog.date = req.body.date;
      blog.slug_url = blog.slug_url || (blog.title ? blog.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : '');

      const uploadedFile = getUploadedFile(req);
      if (uploadedFile) {
        const fileName = `uploads/${uploadedFile.filename}`;
        blog.card_image = fileName;
        blog.images = [{ blog_image_id: 1, file_name: fileName, name: fileName, image: fileName, status: 1 }];
      }

      inMemoryStore.syncBlog(blog);
    }
    return res.json([{ status: 1, msg: "Blog Updated Successfully" }]);
  }
  deleteBlog(req, res) {
    const id = extractId(req);
    if (id !== null) {
      inMemoryStore.deleteBlog(id);
    }
    return res.send('1');
  }

  // ─── TESTIMONIALS CRUD ───
  getTestimonials(req, res) { return res.json(inMemoryStore.testimonials); }
  fetchTestimonialEdit(req, res) {
    const id = extractId(req);
    const t = inMemoryStore.testimonials.find(item => item.id == id);
    return res.json(t ? [t] : []);
  }
  addTestimonial(req, res) {
    const uploadedFile = getUploadedFile(req);
    const avatar = uploadedFile ? `uploads/${uploadedFile.filename}` : 'assets/images/testimonials/default.jpg';
    inMemoryStore.testimonials.push({
      id: getNextId(inMemoryStore.testimonials),
      name: req.body.name || '',
      role: req.body.role || req.body.designation || '',
      description: req.body.description || req.body.discription || '',
      image: avatar,
      status: 1,
      created_at: new Date().toISOString()
    });
    return res.json([{ status: "success", msg: "Testimonial Added Successfully" }]);
  }
  editTestimonials(req, res) {
    const id = extractId(req);
    const item = inMemoryStore.testimonials.find(t => t.id == id);
    if (item) {
      item.name = req.body.name || item.name;
      item.role = req.body.role || item.role;
      item.description = req.body.description || req.body.discription || item.description;
      const uploadedFile = getUploadedFile(req);
      if (uploadedFile) item.image = `uploads/${uploadedFile.filename}`;
    }
    return res.json([{ status: "success", msg: "Testimonial Updated Successfully" }]);
  }
  deleteTestimonial(req, res) {
    const id = extractId(req);
    if (id !== null) {
      inMemoryStore.testimonials = inMemoryStore.testimonials.filter(t => t.id != id);
    }
    return res.send('1');
  }

  // ─── PARTNERS ───
  listPartners(req, res) { return res.json(inMemoryStore.partners); }
  addPartner(req, res) {
    const uploadedFile = getUploadedFile(req);
    const logo = uploadedFile ? `uploads/${uploadedFile.filename}` : 'assets/images/partners/default.png';
    inMemoryStore.partners.push({
      partners_id: getNextId(inMemoryStore.partners, 'partners_id'),
      name: req.body.name || '',
      logo: logo,
      status: 1,
      created_at: new Date().toISOString()
    });
    return res.json([{ status: "success", msg: "Partner Added Successfully" }]);
  }
  deletePartner(req, res) {
    const id = extractId(req);
    if (id !== null) {
      inMemoryStore.partners = inMemoryStore.partners.filter(p => p.partners_id != id && p.id != id);
    }
    return res.send('1');
  }

  // ─── POSTERS ───
  listPosters(req, res) { return res.json(inMemoryStore.posters); }
  addPoster(req, res) {
    const uploadedFile = getUploadedFile(req);
    const image = uploadedFile ? `uploads/${uploadedFile.filename}` : 'assets/images/posters/default.jpg';
    inMemoryStore.posters.push({
      id: getNextId(inMemoryStore.posters),
      title: req.body.title || '',
      image: image,
      link: req.body.link || '',
      status: 1,
      created_at: new Date().toISOString()
    });
    return res.json([{ status: 1, msg: "Poster Added Successfully" }]);
  }
  deletePoster(req, res) {
    const id = extractId(req);
    if (id !== null) {
      inMemoryStore.posters = inMemoryStore.posters.filter(p => p.id != id);
    }
    return res.send('1');
  }

  // ─── NOTICES ───
  listNotices(req, res) { return res.json(inMemoryStore.notices); }
  addNotice(req, res) {
    inMemoryStore.notices.push({
      notice_id: getNextId(inMemoryStore.notices, 'notice_id'),
      data: req.body.data || '',
      status: 1,
      created_at: new Date().toISOString()
    });
    return res.json([{ status: "success", msg: "Notice Added Successfully" }]);
  }
  deleteNotice(req, res) {
    const id = extractId(req);
    if (id !== null) {
      inMemoryStore.notices = inMemoryStore.notices.filter(n => n.notice_id != id && n.id != id);
    }
    return res.send('1');
  }

  // ─── MARKETING ───
  listMarketing(req, res) { return res.json([]); }
  addMarketing(req, res) { return res.json([{ status: 1, msg: "Marketing Image Added" }]); }
  deleteMarketing(req, res) { return res.send('1'); }

  // ─── ENQUIRY LISTS & DETAILS ───
  getCartEnquiryList(req, res) { return res.json(inMemoryStore.enquiryCart); }
  getCartEnquiryDetails(req, res) {
    const id = extractId(req);
    const cart = inMemoryStore.enquiryCart.find(c => c.id == id);
    const activities = inMemoryStore.enquiryActivities.filter(a => a.enquiry_cart_id == id);
    const tickets = inMemoryStore.enquiryTickets.filter(t => t.enquiry_cart_id == id);
    return res.json({
      cart: cart || {},
      activities: activities,
      tickets: tickets,
      activity_ages: inMemoryStore.enquiryActivityAge,
      ticket_ages: inMemoryStore.enquiryTicketAge
    });
  }
  deleteCartEnquiry(req, res) {
    const id = extractId(req);
    if (id !== null) {
      inMemoryStore.enquiryCart = inMemoryStore.enquiryCart.filter(c => c.id != id);
    }
    return res.send('1');
  }

  getContactEnquiryList(req, res) { return res.json(inMemoryStore.contactEnquiries); }
  getContactEnquiryDetails(req, res) {
    const id = extractId(req);
    return res.json(inMemoryStore.contactEnquiries.find(c => c.id == id) || {});
  }
  deleteContactEnquiry(req, res) {
    const id = extractId(req);
    if (id !== null) {
      inMemoryStore.contactEnquiries = inMemoryStore.contactEnquiries.filter(c => c.id != id);
    }
    return res.send('1');
  }

  getCareerEnquiryList(req, res) { return res.json(inMemoryStore.careerEnquiries); }
  getCareerEnquiryDetails(req, res) {
    const id = extractId(req);
    return res.json(inMemoryStore.careerEnquiries.find(c => c.id == id) || {});
  }
  deleteCareerEnquiry(req, res) {
    const id = extractId(req);
    if (id !== null) {
      inMemoryStore.careerEnquiries = inMemoryStore.careerEnquiries.filter(c => c.id != id);
    }
    return res.send('1');
  }

  getCustomizeEnquiryList(req, res) { return res.json(inMemoryStore.customizationEnquiries); }
  getCustomizeEnquiryDetails(req, res) {
    const id = extractId(req);
    return res.json(inMemoryStore.customizationEnquiries.find(c => c.id == id) || {});
  }
  deleteCustomizeEnquiry(req, res) {
    const id = extractId(req);
    if (id !== null) {
      inMemoryStore.customizationEnquiries = inMemoryStore.customizationEnquiries.filter(c => c.id != id);
    }
    return res.send('1');
  }
}

module.exports = new AdminController();
