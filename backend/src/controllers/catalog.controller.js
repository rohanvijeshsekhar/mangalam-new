const inMemoryStore = require('../data/inMemoryStore');

class CatalogController {
  // Get all active destinations
  getDestinations(req, res) {
    const active = inMemoryStore.destinations.filter(d => d.status === 1);
    return res.json(active);
  }

  // Get destination ID by URL slug
  getDestinationIdBySlug(req, res) {
    const slug = req.query.slug || req.body.slug;
    const dest = inMemoryStore.destinations.find(d => d.slug_url === slug && d.status === 1);
    if (dest) {
      return res.json([{ destination_id: dest.destination_id }]);
    }
    return res.json([]);
  }

  // Get all tickets
  getTickets(req, res) {
    const destId = req.query.destination_id || req.body.destination_id;
    let list = inMemoryStore.tickets.filter(t => t.status === 1);
    if (destId) {
      list = list.filter(t => t.destination_id == destId);
    }
    return res.json(list);
  }

  // Get all activities
  getActivities(req, res) {
    const destId = req.query.destination_id || req.body.destination_id;
    let list = inMemoryStore.activities.filter(a => a.status === 1);
    if (destId) {
      list = list.filter(a => a.destination_id == destId);
    }
    return res.json(list);
  }

  // Package Details by ID or slug
  getPackageDetails(req, res) {
    const id = req.query.id || req.body.id || req.params.id;
    const pkg = inMemoryStore.packages.find(p => p.package_id == id || p.slug_url === id);
    if (!pkg) {
      return res.status(404).json({ error: "Package not found" });
    }
    return res.json(pkg);
  }

  // Activity Details by ID or slug
  getActivityDetails(req, res) {
    const id = req.query.id || req.body.id || req.params.id;
    const act = inMemoryStore.activities.find(a => a.activity_id == id || a.slug_url === id);
    if (!act) {
      return res.status(404).json({ error: "Activity not found" });
    }
    return res.json(act);
  }

  // Ticket Details by ID or slug
  getTicketDetails(req, res) {
    const id = req.query.id || req.body.id || req.params.id;
    const ticket = inMemoryStore.tickets.find(t => t.ticket_id == id || t.slug_url === id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    return res.json(ticket);
  }

  // Get blogs
  getBlogs(req, res) {
    const active = inMemoryStore.blogs.filter(b => b.status === 1);
    return res.json(active);
  }

  // Get single blog data
  getBlogData(req, res) {
    const id = req.query.id || req.body.id;
    const blog = inMemoryStore.blogs.find(b => b.blog_id == id || b.slug_url === id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    return res.json(blog);
  }

  // Get latest blog posts
  getBlogLatestPosts(req, res) {
    const limit = Number(req.query.limit) || 5;
    const sorted = [...inMemoryStore.blogs]
      .filter(b => b.status === 1)
      .sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at))
      .slice(0, limit);
    return res.json(sorted);
  }

  // Get recommended blog posts
  getBlogMightLikePosts(req, res) {
    const currentId = req.query.id || req.body.id;
    const limit = Number(req.query.limit) || 3;
    const filtered = inMemoryStore.blogs
      .filter(b => b.status === 1 && b.blog_id != currentId)
      .slice(0, limit);
    return res.json(filtered);
  }

  // Get testimonials
  getTestimonials(req, res) {
    const active = inMemoryStore.testimonials.filter(t => t.status === 1);
    return res.json(active);
  }

  // Get partners
  getPartners(req, res) {
    const active = inMemoryStore.partners.filter(p => p.status === 1);
    return res.json(active);
  }

  // Get posters
  getPosters(req, res) {
    const active = inMemoryStore.posters.filter(p => p.status === 1);
    return res.json(active);
  }

  // Get latest notice
  getNotice(req, res) {
    const active = inMemoryStore.notices.filter(n => n.status === 1);
    const latest = active.length > 0 ? active[active.length - 1] : { data: "" };
    return res.json(latest);
  }

  // Destination PTA (Packages, Tickets, Activities for a destination)
  getDestinationPTA(req, res) {
    const destId = req.query.id || req.query.destination_id || req.body.destination_id;
    const pkgs = inMemoryStore.packages.filter(p => p.destination_id == destId && p.status === 1);
    const acts = inMemoryStore.activities.filter(a => a.destination_id == destId && a.status === 1);
    const tkts = inMemoryStore.tickets.filter(t => t.destination_id == destId && t.status === 1);
    return res.json({
      packages: pkgs,
      activities: acts,
      tickets: tkts
    });
  }

  // Featured Tickets
  getFeaturedTickets(req, res) {
    const featured = inMemoryStore.tickets.filter(t => t.featured === 1 && t.status === 1);
    return res.json(featured);
  }

  // Featured Activities
  getFeaturedActivities(req, res) {
    const featured = inMemoryStore.activities.filter(a => a.featured === 1 && a.status === 1);
    return res.json(featured);
  }

  // Random Activity
  getRandomActivity(req, res) {
    const active = inMemoryStore.activities.filter(a => a.status === 1);
    if (active.length === 0) return res.json(null);
    const randomItem = active[Math.floor(Math.random() * active.length)];
    return res.json(randomItem);
  }

  // Currency Converter utility endpoint
  converter(req, res) {
    const amount = Number(req.query.amount || req.body.amount || 1);
    const rate = 3.67; // AED to USD approximate
    return res.json({ original: amount, converted: (amount / rate).toFixed(2) });
  }
}

module.exports = new CatalogController();
