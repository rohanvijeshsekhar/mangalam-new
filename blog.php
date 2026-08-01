<!DOCTYPE html>
<html lang="en">
<?php 
// Meta tags for Blog Page
$pageTitle = 'Blog - Mangalam Travel & Tours | Travel Tips, Guides & Destinations';
$pageDescription = 'Read our latest travel blogs, destination guides, and travel tips from Mangalam Travel & Tours. Stay updated with travel news, insights, and inspiration for your next adventure.';
$pageKeywords = 'travel blog, travel tips, destination guides, travel news, travel insights, travel inspiration, Mangalam Tours blog';
$pageImage = '';
$pageUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

include './head.php'; 
require_once './action/blogs.php';

// Fetch blogs data
$blogsJson = allBlogs();
$blogs = json_decode($blogsJson, true);
?>
<body class="font-dm-sans bg-white">
    <!-- Header -->
    <?php include './components/header.php'; ?>

    <main>

        <!-- Blog Posts Section -->
        <section class="py-20 bg-white" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <!-- Section Heading -->
                <div class="text-left mb-16" data-aos="fade-up" data-aos-delay="100">
                    <h1 class="text-3xl lg:text-5xl font-medium text-gray-900 font-[Quicksand] mb-2" data-aos="fade-up" data-aos-delay="150">
                        Travel <span class="font-bold">Blog</span>
                    </h1>
                    <p class="text-base text-gray-600 font-dm-sans" data-aos="fade-up" data-aos-delay="200">
                        Discover amazing destinations, travel tips, and insider insights
                    </p>
                </div>
                <?php if ($blogs && count($blogs) > 0): ?>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <?php $blogDelay = 0; ?>
                        <?php foreach ($blogs as $blog): ?>
                            <a href="blog-details.php?slug=<?php echo urlencode($blog['slug_url']); ?>" class="group" data-aos="zoom-in" data-aos-delay="<?php echo $blogDelay; ?>">
                                <div class="bg-white rounded-2xl overflow-hidden  transition-shadow duration-300 border border-gray-200">
                                    <!-- Blog Image -->
                                    <div class="relative overflow-hidden h-64">
                                        <?php if (isset($blog['images']) && count($blog['images']) > 0): ?>
                                            <img src="./admin/files/blog/<?php echo htmlspecialchars($blog['images'][0]['name']); ?>" 
                                                 alt="<?php echo htmlspecialchars($blog['title']); ?>" 
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
                                            <span class="font-dm-sans"><?php echo htmlspecialchars($blog['date']); ?></span>
                                        </div>
                                        
                                        <h3 class="text-xl font-bold text-gray-900 font-dm-sans mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                                            <?php echo htmlspecialchars($blog['title']); ?>
                                        </h3>
                                        
                                        <?php if (!empty($blog['description'])): ?>
                                            <p class="text-gray-600 font-dm-sans line-clamp-3 mb-4">
                                                <?php echo htmlspecialchars(strip_tags(html_entity_decode($blog['description'], ENT_QUOTES | ENT_HTML5))); ?>
                                            </p>
                                        <?php endif; ?>
                                        
                                        <div class="flex items-center text-red-600 font-dm-sans font-semibold">
                                            <span>Read More</span>
                                            <i class="fi fi-rr-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            <?php $blogDelay += 120; ?>
                        <?php endforeach; ?>
                    </div>
                <?php else: ?>
                    <div class="text-center py-20" data-aos="fade-up" data-aos-delay="150">
                        <div class="max-w-md mx-auto">
                            <i class="fi fi-rr-document text-gray-300 text-6xl mb-4"></i>
                            <h3 class="text-2xl font-bold text-gray-900 font-[Quicksand] mb-3">No Blog Posts Yet</h3>
                            <p class="text-gray-600 font-dm-sans">Check back soon for exciting travel stories and tips!</p>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        </section>

    </main>
    
    <?php include './components/footer.php'; ?>
    <?php include './components/Customize.php'; ?>
    <?php include './script.php'; ?>
    <?php 
    include './components/MobileNav.php';
    responsiveMenu('blog'); // Set 'blog' as active page
    ?>
</body>
</html>

