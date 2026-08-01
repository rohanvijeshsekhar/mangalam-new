<?php
function getParamValues($index) {
    $uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
    $uri = parse_url($uri, PHP_URL_PATH);
    $segments = explode('/', trim($uri, '/'));
    
    // Remove empty segments
    $segments = array_filter($segments, function($segment) {
        return !empty($segment);
    });
    
    // Re-index array
    $segments = array_values($segments);
    
    // Debug: print the segments to understand the structure
    // echo "<!-- Debug segments: " . print_r($segments, true) . " -->";
    
    // Return the segment at the requested index (0-based)
    if (isset($segments[$index])) {
        return $segments[$index];
    }
    
    return null;
}
?>

