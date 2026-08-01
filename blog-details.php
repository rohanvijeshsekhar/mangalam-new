<?php
// Get slug from URL parameter
$slug = isset($_GET['slug']) ? $_GET['slug'] : '';

// Include the blog details function
include './action/blogData.php';

// Fetch blog data
$blogData = null;
if ($slug) {
    $blogJson = blogData($slug);
    $blogArray = json_decode($blogJson, true);
    
    if (!empty($blogArray)) {
        $blogData = $blogArray[0];
    }
}

// Set default values if no data found
$title = isset($blogData['title']) ? $blogData['title'] : 'Blog Post';
$description = isset($blogData['description']) ? $blogData['description'] : '';
$date = isset($blogData['date']) ? $blogData['date'] : '';
$image = isset($blogData['image']) ? $blogData['image'] : '';

// Helper to safely render HTML content from database (handles double-encoding)
function renderSafeOverview($rawHtml)
{
    if (!is_string($rawHtml)) {
        return '';
    }
    $decoded = $rawHtml;
    // Decode entities multiple times to handle double-encoding like &amp;lt; p &amp;gt;
    for ($i = 0; $i < 3; $i++) {
        $newDecoded = html_entity_decode($decoded, ENT_QUOTES | ENT_HTML5);
        if ($newDecoded === $decoded) {
            break;
        }
        $decoded = $newDecoded;
    }
    // Render decoded HTML from rich text editor as-is
    return $decoded;
}

// Meta tags for Blog Details Page
$pageTitle = $title . ' - Mangalam Travel & Tours | Blog';
$pageDescription = !empty($description)
    ? $description
    : 'Read this travel blog post from Mangalam Travel & Tours. Get the latest travel tips, destination guides, and inspiring stories.';
$pageKeywords = $title . ', travel blog, travel tips, destination guide, travel insights, Mangalam Tours blog';
$pageImage = !empty($image) ? './admin/files/blog/' . $image : '';
$pageUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$pageType = 'article';
?>

<!DOCTYPE html>
<html lang="en">
<?php include './head.php'; ?>
<body class="font-dm-sans bg-white">
    <!-- Header -->
    <?php include './components/header.php'; ?>
    
    <main>
        <!-- Hero Banner Section -->
        <?php if (!empty($image)): ?>
        <section class="relative  h-[400px] overflow-hidden" data-aos="fade-up">
            <div class="absolute inset-0">
                <img src="./admin/files/blog/<?php echo htmlspecialchars($image); ?>" 
                     alt="<?php echo htmlspecialchars($title); ?>" 
                     class="w-full h-full object-cover rounded-br-[150px]" data-aos="zoom-in" data-aos-delay="100">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 rounded-br-[150px]" data-aos="fade-up" data-aos-delay="120"></div>
            </div>
            
            <!-- Hero Content Overlay -->
            <div class="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12" data-aos="fade-up" data-aos-delay="180">
                <div class="max-w-4xl mx-auto text-white">
                    <div class="flex items-center mb-4" data-aos="fade-up" data-aos-delay="200">
                        <div class="flex items-center mr-6">
                            <i class="fi fi-rr-calendar mr-2"></i>
                            <span class="font-dm-sans"><?php echo htmlspecialchars($date); ?></span>
                        </div>
                        <div class="flex items-center">
                            <i class="fi fi-rr-user mr-2"></i>
                            <span class="font-dm-sans">Mangalam Tours</span>
                        </div>
                    </div>
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold font-[Quicksand] mb-6 leading-tight" data-aos="fade-up" data-aos-delay="220">
                        <?php echo htmlspecialchars($title); ?>
                    </h1>
                </div>
            </div>
        </section>
        <?php endif; ?>
        
        <!-- Blog Content Section -->
        <section class="py-10 bg-white">
            <div class="container mx-auto px-4">
                <div class="max-w-4xl mx-auto">
                    
                    <?php if (empty($image)): ?>
                    <!-- Title without hero image -->
                    <div class="mb-12">
                        <div class="flex items-center text-gray-600 mb-4">
                            <div class="flex items-center mr-6">
                                <i class="fi fi-rr-calendar mr-2"></i>
                                <span class="font-dm-sans"><?php echo htmlspecialchars($date); ?></span>
                            </div>
                            <div class="flex items-center">
                                <i class="fi fi-rr-user mr-2"></i>
                                <span class="font-dm-sans">Mangalam Tours</span>
                            </div>
                        </div>
                        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 font-[Quicksand] leading-tight">
                            <?php echo htmlspecialchars($title); ?>
                        </h1>
                    </div>
                    <?php endif; ?>
                    
                    <!-- Blog Content -->
                    <div class="prose prose-lg max-w-none mb-12" data-aos="fade-up" data-aos-delay="100">
                        <div class="text-gray-700 font-dm-sans leading-relaxed text-lg">
                            <?php 
                            // Output HTML description properly decoded and rendered
                            echo renderSafeOverview($description);
                            ?>
                        </div>
                    </div>
                    
                    <!-- Share Section -->
                    <div class="mt-16 pt-12 border-t border-gray-200" data-aos="fade-up" data-aos-delay="150">
                        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div class="flex items-center" data-aos="fade-up" data-aos-delay="170">
                                <span class="text-gray-600 font-dm-sans font-semibold mr-4 text-lg">Share this post:</span>
                                <div class="flex space-x-3" data-aos="fade-up" data-aos-delay="190">
                                    <a href="https://www.facebook.com/sharer/sharer.php?u=<?php echo urlencode($pageUrl); ?>" 
                                       target="_blank" 
                                       class="w-11 h-11 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
                                        <i class="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="https://twitter.com/intent/tweet?url=<?php echo urlencode($pageUrl); ?>&text=<?php echo urlencode($title); ?>" 
                                       target="_blank" 
                                       class="w-11 h-11 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors shadow-md hover:shadow-lg">
                                        <i class="fab fa-twitter"></i>
                                    </a>
                                    <a href="https://www.linkedin.com/shareArticle?mini=true&url=<?php echo urlencode($pageUrl); ?>&title=<?php echo urlencode($title); ?>" 
                                       target="_blank" 
                                       class="w-11 h-11 bg-blue-800 text-white rounded-full flex items-center justify-center hover:bg-blue-900 transition-colors shadow-md hover:shadow-lg">
                                        <i class="fab fa-linkedin-in"></i>
                                    </a>
                                    <a href="https://api.whatsapp.com/send?text=<?php echo urlencode($title . ' ' . $pageUrl); ?>" 
                                       target="_blank" 
                                       class="w-11 h-11 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-md hover:shadow-lg">
                                        <i class="fab fa-whatsapp"></i>
                                    </a>
                                </div>
                            </div>
                            
                            <!-- Back to Blog Button -->
                            <a href="blog.php" class="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors font-dm-sans" data-aos="fade-up" data-aos-delay="210">
                                <i class="fi fi-rr-arrow-left mr-2"></i>
                                Back to Blog
                            </a>
                        </div>
                    </div>

                    <!-- Blog Enquiry Form -->
                    <div class="mt-16 p-8 bg-gray-50 rounded-3xl border border-gray-100" data-aos="fade-up">
                        <h3 class="text-2xl font-bold text-gray-900 font-[Quicksand] mb-2">Interested in this destination?</h3>
                        <p class="text-gray-600 font-dm-sans mb-6">Share your details and our travel experts will get back to you.</p>
                        <form id="blogEnquiryForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2" for="blog_enq_name">Name</label>
                                <input type="text" id="blog_enq_name" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Your name">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2" for="blog_enq_email">Email</label>
                                <input type="email" id="blog_enq_email" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="you@email.com">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2" for="blog_enq_phone">Phone</label>
                                <input type="tel" id="blog_enq_phone" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Phone number">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2" for="blog_enq_destination">Destination</label>
                                <select id="blog_enq_destination" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                                    <option value="0">Other / Not sure</option>
                                    <?php
                                    include_once './action/allDestinations.php';
                                    $blogDestinations = json_decode(allDestinations(''), true) ?: [];
                                    foreach ($blogDestinations as $dest) {
                                        $destId = (int) ($dest['destination_id'] ?? 0);
                                        $destName = htmlspecialchars($dest['title'] ?? $dest['destination_name'] ?? '');
                                        if ($destId > 0 && $destName !== '') {
                                            echo '<option value="' . $destId . '">' . $destName . '</option>';
                                        }
                                    }
                                    ?>
                                </select>
                            </div>
                            <div class="md:col-span-2">
                                <button type="submit" id="blog_enq_submit" class="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors font-dm-sans">
                                    Send Enquiry
                                </button>
                                <p id="blog_enq_msg" class="mt-3 text-sm font-dm-sans hidden"></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Related Blog Posts Section -->
        <section class="py-20 bg-gray-50" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <!-- Section Header -->
                <div class="text-center mb-12" data-aos="fade-up" data-aos-delay="100">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-800 font-[Quicksand] mb-4" data-aos="fade-up" data-aos-delay="130">
                        Related Posts
                    </h2>
                    <p class="text-gray-600 font-dm-sans max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="160">
                        Explore more travel insights and stories
                    </p>
                </div>
                
                <!-- Related Posts Carousel -->
                <?php
                // Include blogs function and fetch related posts
                include './action/blogs.php';
                $relatedBlogsJson = allBlogs();
                $relatedBlogs = json_decode($relatedBlogsJson, true);
                
                // Filter out current blog and limit to 3
                if ($relatedBlogs && count($relatedBlogs) > 0):
                    $currentSlug = $slug;
                    $filteredBlogs = array_filter($relatedBlogs, function($blog) use ($currentSlug) {
                        return isset($blog['slug_url']) && $blog['slug_url'] !== $currentSlug;
                    });
                    $relatedPosts = array_slice($filteredBlogs, 0, 3);
                ?>
                    <?php if (count($relatedPosts) > 0): ?>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            <?php $relatedDelay = 0; ?>
                            <?php foreach ($relatedPosts as $post): ?>
                                <a href="blog-details.php?slug=<?php echo urlencode($post['slug_url']); ?>" class="group block" data-aos="zoom-in" data-aos-delay="<?php echo $relatedDelay; ?>">
                                    <div class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                                        <!-- Blog Image -->
                                        <div class="relative overflow-hidden h-64">
                                            <?php if (isset($post['images']) && count($post['images']) > 0): ?>
                                                <img src="./admin/files/blog/<?php echo htmlspecialchars($post['images'][0]['name']); ?>" 
                                                     alt="<?php echo htmlspecialchars($post['title']); ?>" 
                                                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                                            <?php else: ?>
                                                <div class="w-full h-full bg-gray-100"></div>
                                            <?php endif; ?>
                                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        </div>
                                        
                                        <!-- Blog Content -->
                                        <div class="p-6">
                                            <div class="flex items-center text-gray-500 text-sm mb-3">
                                                <i class="fi fi-rr-calendar mr-2"></i>
                                                <span class="font-dm-sans"><?php echo htmlspecialchars($post['date']); ?></span>
                                            </div>
                                            
                                            <h3 class="text-xl font-bold text-gray-900 font-dm-sans mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                                                <?php echo htmlspecialchars($post['title']); ?>
                                            </h3>
                                            
                                            <div class="flex items-center text-red-600 font-dm-sans font-semibold">
                                                <span>Read More</span>
                                                <i class="fi fi-rr-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                                <?php $relatedDelay += 120; ?>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                <?php endif; ?>
            </div>
        </section>
        
    </main>
    
    <?php include './components/footer.php'; ?>
    <?php include './components/Customize.php'; ?>
    <?php include './script.php'; ?>
    <?php 
    include './components/MobileNav.php';
    responsiveMenu('blog-details'); // Set 'blog-details' as active page
    ?>
    <script>
    (function () {
        const form = document.getElementById('blogEnquiryForm');
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = document.getElementById('blog_enq_submit');
            const msg = document.getElementById('blog_enq_msg');
            const payload = {
                name: document.getElementById('blog_enq_name').value.trim(),
                email: document.getElementById('blog_enq_email').value.trim(),
                phone: document.getElementById('blog_enq_phone').value.trim(),
                destinationId: parseInt(document.getElementById('blog_enq_destination').value, 10) || 0
            };
            btn.disabled = true;
            btn.textContent = 'Sending...';
            msg.classList.add('hidden');
            fetch('./action/enqBlog.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(function (r) { return r.text(); })
            .then(function (data) {
                btn.disabled = false;
                btn.textContent = 'Send Enquiry';
                msg.classList.remove('hidden');
                if (String(data).trim() === '1') {
                    msg.className = 'mt-3 text-sm font-dm-sans text-green-600';
                    msg.textContent = 'Thank you! We will contact you shortly.';
                    form.reset();
                } else {
                    msg.className = 'mt-3 text-sm font-dm-sans text-red-600';
                    msg.textContent = 'Could not send enquiry. Please try again.';
                }
            })
            .catch(function () {
                btn.disabled = false;
                btn.textContent = 'Send Enquiry';
                msg.classList.remove('hidden');
                msg.className = 'mt-3 text-sm font-dm-sans text-red-600';
                msg.textContent = 'Could not send enquiry. Please try again.';
            });
        });
    })();
    </script>
    
</body>
</html>

