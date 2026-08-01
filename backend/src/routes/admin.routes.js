const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const adminController = require('../controllers/admin.controller');
const { authenticateToken } = require('../middleware/sessionAuth');
const upload = require('../middleware/upload');

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────
router.all('/loginAction.php', (req, res) => authController.loginAction(req, res));
router.all('/checkLoginAdmin.php', (req, res) => authController.checkLoginAdmin(req, res));
router.all('/logout.php', (req, res) => authController.logout(req, res));
router.all('/changePassword.php', authenticateToken, (req, res) => authController.changePassword(req, res));

// ─────────────────────────────────────────────
// DASHBOARD & METRICS
// ─────────────────────────────────────────────
router.all('/dashboard.php', authenticateToken, (req, res) => adminController.getDashboard(req, res));
router.all('/fetch_count_enquiry.php', authenticateToken, (req, res) => adminController.getEnquiryCounts(req, res));

// ─────────────────────────────────────────────
// DESTINATIONS
// ─────────────────────────────────────────────
router.all('/destinations.php', authenticateToken, (req, res) => adminController.listDestinations(req, res));
router.all('/fetchEditDestination.php', authenticateToken, (req, res) => adminController.fetchDestinationEdit(req, res));
router.all('/addDestination.php', authenticateToken, upload.any(), (req, res) => adminController.createDestination(req, res));
router.all('/editDestination.php', authenticateToken, upload.any(), (req, res) => adminController.editDestination(req, res));
router.all('/deleteDestination.php', authenticateToken, (req, res) => adminController.deleteDestination(req, res));

// ─────────────────────────────────────────────
// PLACES & COLLECTIONS
// ─────────────────────────────────────────────
router.all('/places.php', authenticateToken, (req, res) => adminController.listPlaces(req, res));
router.all('/fetchPlaceEdit.php', authenticateToken, (req, res) => adminController.fetchPlaceEdit(req, res));
router.all('/addPlace.php', authenticateToken, upload.any(), (req, res) => adminController.createPlace(req, res));
router.all('/editPlace.php', authenticateToken, upload.any(), (req, res) => adminController.editPlace(req, res));
router.all('/deletePlace.php', authenticateToken, (req, res) => adminController.deletePlace(req, res));

router.all('/collections.php', authenticateToken, (req, res) => adminController.listCollections(req, res));
router.all('/createCollection.php', authenticateToken, (req, res) => adminController.createCollection(req, res));
router.all('/addCollection.php', authenticateToken, (req, res) => adminController.createCollection(req, res));
router.all('/fetchCollectonEdit.php', authenticateToken, (req, res) => adminController.fetchCollectionEdit(req, res));
router.all('/editCollection.php', authenticateToken, (req, res) => adminController.editCollection(req, res));
router.all('/deleteCollection.php', authenticateToken, (req, res) => adminController.deleteCollection(req, res));

// ─────────────────────────────────────────────
// PACKAGES
// ─────────────────────────────────────────────
router.all('/packages.php', authenticateToken, (req, res) => adminController.listPackages(req, res));
router.all('/fetchPackageEdit.php', authenticateToken, (req, res) => adminController.fetchPackageEdit(req, res));
router.all('/createPackage.php', authenticateToken, upload.any(), (req, res) => adminController.createPackage(req, res));
router.all('/addPackage.php', authenticateToken, upload.any(), (req, res) => adminController.createPackage(req, res));
router.all('/editPackage.php', authenticateToken, upload.any(), (req, res) => adminController.editPackage(req, res));
router.all('/deletePackage.php', authenticateToken, (req, res) => adminController.deletePackage(req, res));
router.all('/deleteItinary.php', authenticateToken, (req, res) => adminController.deleteItinary(req, res));

// ─────────────────────────────────────────────
// ACTIVITIES
// ─────────────────────────────────────────────
router.all('/activities.php', authenticateToken, (req, res) => adminController.listActivities(req, res));
router.all('/fetchActivityEdit.php', authenticateToken, (req, res) => adminController.fetchActivityEdit(req, res));
router.all('/createActivity.php', authenticateToken, upload.any(), (req, res) => adminController.createActivity(req, res));
router.all('/editActivity.php', authenticateToken, upload.any(), (req, res) => adminController.editActivity(req, res));
router.all('/deleteActivity.php', authenticateToken, (req, res) => adminController.deleteActivity(req, res));

// ─────────────────────────────────────────────
// TICKETS
// ─────────────────────────────────────────────
router.all('/tickets.php', authenticateToken, (req, res) => adminController.listTickets(req, res));
router.all('/fetchTicketEdit.php', authenticateToken, (req, res) => adminController.fetchTicketEdit(req, res));
router.all('/createTicket.php', authenticateToken, upload.any(), (req, res) => adminController.createTicket(req, res));
router.all('/editTicket.php', authenticateToken, upload.any(), (req, res) => adminController.editTicket(req, res));
router.all('/deleteTicket.php', authenticateToken, (req, res) => adminController.deleteTicket(req, res));

// ─────────────────────────────────────────────
// BLOGS
// ─────────────────────────────────────────────
router.all('/blogs.php', authenticateToken, (req, res) => adminController.listBlogs(req, res));
router.all('/fetchBlogEdit.php', authenticateToken, (req, res) => adminController.fetchBlogEdit(req, res));
router.all('/createBlog.php', authenticateToken, upload.any(), (req, res) => adminController.createBlog(req, res));
router.all('/editBlog.php', authenticateToken, upload.any(), (req, res) => adminController.editBlog(req, res));
router.all('/deleteBlog.php', authenticateToken, (req, res) => adminController.deleteBlog(req, res));

// ─────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────
router.all('/testimonials.php', authenticateToken, (req, res) => adminController.getTestimonials(req, res));
router.all('/fetchEditTestimonials.php', authenticateToken, (req, res) => adminController.fetchTestimonialEdit(req, res));
router.all('/addTestimonials.php', authenticateToken, upload.any(), (req, res) => adminController.addTestimonial(req, res));
router.all('/editTestimonials.php', authenticateToken, upload.any(), (req, res) => adminController.editTestimonials(req, res));
router.all('/deleteTestimonial.php', authenticateToken, (req, res) => adminController.deleteTestimonial(req, res));

// ─────────────────────────────────────────────
// PARTNERS, POSTERS, NOTICES & MARKETING
// ─────────────────────────────────────────────
router.all('/list_partners.php', authenticateToken, (req, res) => adminController.listPartners(req, res));
router.all('/add_partner.php', authenticateToken, upload.any(), (req, res) => adminController.addPartner(req, res));
router.all('/deletePartner.php', authenticateToken, (req, res) => adminController.deletePartner(req, res));

router.all('/posters.php', authenticateToken, (req, res) => adminController.listPosters(req, res));
router.all('/addPoster.php', authenticateToken, upload.any(), (req, res) => adminController.addPoster(req, res));
router.all('/deletePoster.php', authenticateToken, (req, res) => adminController.deletePoster(req, res));

router.all('/notice.php', authenticateToken, (req, res) => adminController.listNotices(req, res));
router.all('/addNotice.php', authenticateToken, (req, res) => adminController.addNotice(req, res));
router.all('/deleteNotice.php', authenticateToken, (req, res) => adminController.deleteNotice(req, res));

router.all('/list_marketing.php', authenticateToken, (req, res) => adminController.listMarketing(req, res));
router.all('/addMarketingImages.php', authenticateToken, (req, res) => adminController.addMarketing(req, res));
router.all('/deleteDestinationMarketing.php', authenticateToken, (req, res) => adminController.deleteMarketing(req, res));

// ─────────────────────────────────────────────
// ENQUIRY LISTS & DETAILS
// ─────────────────────────────────────────────
router.all('/enquiryCartList.php', authenticateToken, (req, res) => adminController.getCartEnquiryList(req, res));
router.all('/cartEnquiryDetails.php', authenticateToken, (req, res) => adminController.getCartEnquiryDetails(req, res));
router.all('/deleteCartEnq.php', authenticateToken, (req, res) => adminController.deleteCartEnquiry(req, res));

router.all('/enquiryContactList.php', authenticateToken, (req, res) => adminController.getContactEnquiryList(req, res));
router.all('/contactEnquiryDetails.php', authenticateToken, (req, res) => adminController.getContactEnquiryDetails(req, res));
router.all('/deleteContactEnq.php', authenticateToken, (req, res) => adminController.deleteContactEnquiry(req, res));

router.all('/enquiryCareerList.php', authenticateToken, (req, res) => adminController.getCareerEnquiryList(req, res));
router.all('/careerEnquiryDetails.php', authenticateToken, (req, res) => adminController.getCareerEnquiryDetails(req, res));
router.all('/deleteCareerEnq.php', authenticateToken, (req, res) => adminController.deleteCareerEnquiry(req, res));

router.all('/enquiryCustomizationList.php', authenticateToken, (req, res) => adminController.getCustomizeEnquiryList(req, res));
router.all('/customizeEnquiryDetails.php', authenticateToken, (req, res) => adminController.getCustomizeEnquiryDetails(req, res));
router.all('/deleteCustomizeEnq.php', authenticateToken, (req, res) => adminController.deleteCustomizeEnquiry(req, res));

router.all('/enquiryPackageList.php', authenticateToken, (req, res) => adminController.getCartEnquiryList(req, res));
router.all('/packageEnquiryDetails.php', authenticateToken, (req, res) => adminController.getCartEnquiryDetails(req, res));
router.all('/deletePackageEnq.php', authenticateToken, (req, res) => adminController.deleteCartEnquiry(req, res));

router.all('/enquiryBlogList.php', authenticateToken, (req, res) => adminController.getContactEnquiryList(req, res));
router.all('/blogEnquiryDetails.php', authenticateToken, (req, res) => adminController.getContactEnquiryDetails(req, res));
router.all('/deleteBlogEnq.php', authenticateToken, (req, res) => adminController.deleteContactEnquiry(req, res));

module.exports = router;
