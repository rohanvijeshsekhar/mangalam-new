const express = require('express');
const router = express.Router();

const catalogController = require('../controllers/catalog.controller');
const enquiryController = require('../controllers/enquiry.controller');
const otpController = require('../controllers/otp.controller');
const upload = require('../middleware/upload');

// ─────────────────────────────────────────────
// CATALOG & PUBLIC DATA ENDPOINTS
// ─────────────────────────────────────────────
router.all('/allDestinations.php', (req, res) => catalogController.getDestinations(req, res));
router.all('/allTickets.php', (req, res) => catalogController.getTickets(req, res));
router.all('/allActivities.php', (req, res) => catalogController.getActivities(req, res));
router.all('/blogs.php', (req, res) => catalogController.getBlogs(req, res));
router.all('/allTestimonials.php', (req, res) => catalogController.getTestimonials(req, res));
router.all('/fetch_testimonials.php', (req, res) => catalogController.getTestimonials(req, res));
router.all('/posters.php', (req, res) => catalogController.getPosters(req, res));
router.all('/fetch_partners.php', (req, res) => catalogController.getPartners(req, res));
router.all('/notice.php', (req, res) => catalogController.getNotice(req, res));
router.all('/getDestinationId.php', (req, res) => catalogController.getDestinationIdBySlug(req, res));
router.all('/converter.php', (req, res) => catalogController.converter(req, res));

// Details endpoints
router.all('/packageDetails.php', (req, res) => catalogController.getPackageDetails(req, res));
router.all('/activitytDetails.php', (req, res) => catalogController.getActivityDetails(req, res));
router.all('/ticketDetails.php', (req, res) => catalogController.getTicketDetails(req, res));
router.all('/blogData.php', (req, res) => catalogController.getBlogData(req, res));
router.all('/blogLatestPosts.php', (req, res) => catalogController.getBlogLatestPosts(req, res));
router.all('/blogMightLikesPosts.php', (req, res) => catalogController.getBlogMightLikePosts(req, res));

// Filter & Popup endpoints
router.all('/allDestinationFilter.php', (req, res) => catalogController.getDestinations(req, res));
router.all('/destitnationPTA.php', (req, res) => catalogController.getDestinationPTA(req, res));
router.all('/destinationsEnq.php', (req, res) => catalogController.getDestinations(req, res));
router.all('/featuredTickets.php', (req, res) => catalogController.getFeaturedTickets(req, res));
router.all('/fetchFeaturedActivities.php', (req, res) => catalogController.getFeaturedActivities(req, res));
router.all('/fetchRandomActivity.php', (req, res) => catalogController.getRandomActivity(req, res));
router.all('/fetchDestinationPopup.php', (req, res) => catalogController.getDestinations(req, res));
router.all('/fetchPlacesPopup.php', (req, res) => catalogController.getDestinations(req, res));

// ─────────────────────────────────────────────
// OTP ENDPOINTS
// ─────────────────────────────────────────────
router.all('/sendOTP.php', (req, res) => otpController.sendOTP(req, res));
router.all('/verifyOTP.php', (req, res) => otpController.verifyOTP(req, res));

// ─────────────────────────────────────────────
// ENQUIRY & FORM SUBMISSION ENDPOINTS
// ─────────────────────────────────────────────
router.all('/submitContactEnquiry.php', (req, res) => enquiryController.submitContactEnquiry(req, res));
router.all('/submitPackageEnquiry.php', (req, res) => enquiryController.submitPackageEnquiry(req, res));
router.all('/submitCustomizeEnquiry.php', (req, res) => enquiryController.submitCustomizationEnquiry(req, res));
router.all('/submitCareerEnquiry.php', upload.single('resume'), (req, res) => enquiryController.submitCareerEnquiry(req, res));
router.all('/submitOtherLocationEnquiry.php', (req, res) => enquiryController.submitContactEnquiry(req, res));
router.all('/submitEnquiryCart.php', (req, res) => enquiryController.submitCartEnquiry(req, res));
router.all('/submit_enquiry.php', (req, res) => enquiryController.submitCartEnquiry(req, res));
router.all('/enqBlog.php', (req, res) => enquiryController.submitContactEnquiry(req, res));
router.all('/emailApi.php', (req, res) => enquiryController.emailApi(req, res));

module.exports = router;
