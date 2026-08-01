const inMemoryStore = require('../data/inMemoryStore');

class EnquiryController {
  // Contact Form Submission
  submitContactEnquiry(req, res) {
    const { name, email, phone, message } = req.body;
    const newEnquiry = {
      id: inMemoryStore.getNextId(inMemoryStore.contactEnquiries),
      name: name || '',
      email: email || '',
      phone: phone || '',
      message: message || '',
      status: 1,
      created_at: new Date().toISOString()
    };
    inMemoryStore.contactEnquiries.push(newEnquiry);
    console.log('[In-Memory Store] Contact Enquiry Saved:', newEnquiry);
    return res.send('1');
  }

  // Package Detail Form Submission
  submitPackageEnquiry(req, res) {
    const { name, email, phone, date, guests, package_id, package_title } = req.body;
    const newCartEnquiry = {
      id: inMemoryStore.getNextId(inMemoryStore.enquiryCart),
      name: name || '',
      email: email || '',
      phone: phone || '',
      status: 1,
      created_at: new Date().toISOString()
    };
    inMemoryStore.enquiryCart.push(newCartEnquiry);

    if (package_id) {
      inMemoryStore.enquiryActivities.push({
        id: inMemoryStore.getNextId(inMemoryStore.enquiryActivities),
        enquiry_cart_id: newCartEnquiry.id,
        activity_id: Number(package_id),
        date: date || '',
        adult_count: Number(guests) || 1,
        children_count: 0,
        status: 1,
        created_at: new Date().toISOString()
      });
    }

    console.log('[In-Memory Store] Package Enquiry Saved:', newCartEnquiry);
    return res.send('1');
  }

  // Customization Form Submission
  submitCustomizationEnquiry(req, res) {
    const { name, email, phone, destinations, travel_date, adults, children, details } = req.body;
    const newCustomEnquiry = {
      id: inMemoryStore.getNextId(inMemoryStore.customizationEnquiries),
      name: name || '',
      email: email || '',
      phone: phone || '',
      destinations: typeof destinations === 'object' ? JSON.stringify(destinations) : (destinations || ''),
      travel_date: travel_date || '',
      adults: Number(adults) || 1,
      children: Number(children) || 0,
      details: details || '',
      status: 1,
      created_at: new Date().toISOString()
    };
    inMemoryStore.customizationEnquiries.push(newCustomEnquiry);
    console.log('[In-Memory Store] Customization Enquiry Saved:', newCustomEnquiry);
    return res.send('1');
  }

  // Career Form Submission with Resume File Upload
  submitCareerEnquiry(req, res) {
    const { name, email, phone, position } = req.body;
    const resumePath = req.file ? `uploads/${req.file.filename}` : '';

    const newCareerEnquiry = {
      id: inMemoryStore.getNextId(inMemoryStore.careerEnquiries),
      name: name || '',
      email: email || '',
      phone: phone || '',
      position: position || '',
      resume: resumePath,
      status: 1,
      created_at: new Date().toISOString()
    };
    inMemoryStore.careerEnquiries.push(newCareerEnquiry);
    console.log('[In-Memory Store] Career Enquiry Saved:', newCareerEnquiry);
    return res.send('1');
  }

  // Cart Enquiry Submission (Multi-Item Cart)
  submitCartEnquiry(req, res) {
    const { name, email, phone, cartItems, items } = req.body;
    const cartData = cartItems || items || [];

    const newEnquiryCart = {
      id: inMemoryStore.getNextId(inMemoryStore.enquiryCart),
      name: name || '',
      email: email || '',
      phone: phone || '',
      status: 1,
      created_at: new Date().toISOString()
    };
    inMemoryStore.enquiryCart.push(newEnquiryCart);

    if (Array.isArray(cartData)) {
      cartData.forEach(item => {
        const itemType = (item.type || '').toLowerCase();
        const itemId = parseInt(String(item.id).replace(/\D/g, '')) || 0;

        if (itemType.includes('activity')) {
          const actId = inMemoryStore.getNextId(inMemoryStore.enquiryActivities);
          inMemoryStore.enquiryActivities.push({
            id: actId,
            enquiry_cart_id: newEnquiryCart.id,
            activity_id: itemId,
            date: item.date || '',
            adult_count: Number(item.adults) || 1,
            children_count: Number(item.children) || 0,
            status: 1,
            created_at: new Date().toISOString()
          });
          if (Array.isArray(item.age)) {
            item.age.forEach(a => {
              inMemoryStore.enquiryActivityAge.push({
                id: inMemoryStore.getNextId(inMemoryStore.enquiryActivityAge),
                enquiry_activity_id: actId,
                age: Number(a)
              });
            });
          }
        } else {
          // Ticket item
          const ticketId = inMemoryStore.getNextId(inMemoryStore.enquiryTickets);
          inMemoryStore.enquiryTickets.push({
            id: ticketId,
            enquiry_cart_id: newEnquiryCart.id,
            ticket_id: itemId,
            date: item.date || '',
            adult_count: Number(item.adults) || 1,
            children_count: Number(item.children) || 0,
            status: 1,
            created_at: new Date().toISOString()
          });
          if (Array.isArray(item.age)) {
            item.age.forEach(a => {
              inMemoryStore.enquiryTicketAge.push({
                id: inMemoryStore.getNextId(inMemoryStore.enquiryTicketAge),
                enquiry_ticket_id: ticketId,
                age: Number(a)
              });
            });
          }
        }
      });
    }

    console.log('[In-Memory Store] Multi-Item Cart Enquiry Saved:', newEnquiryCart);
    return res.send('1');
  }

  // Central Email API Endpoint Handler (emailApi.php)
  emailApi(req, res) {
    const { action, name, email, phone } = req.body;

    if (name || email || phone) {
      this.submitCartEnquiry(req, res);
    } else {
      return res.send('1');
    }
  }
}

module.exports = new EnquiryController();
