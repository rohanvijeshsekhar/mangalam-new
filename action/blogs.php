<?php
require_once __DIR__ . '/../_class/query.php';

function allBlogs()
{
    $obj = new Query();
    $dataArray = [];

    $fetchBlogs = $obj->selectData("blog_id,title,date,description,slug_url", "blogs", "where status != 0 order by blog_id desc");

    if ($fetchBlogs && safe_mysqli_num_rows($fetchBlogs) > 0) {
        $i = 0;
        while ($blogRow = safe_mysqli_fetch_array($fetchBlogs)) {
            $blogId = $blogRow['blog_id'];
            $fetchImages = $obj->selectData("file_name", "blog_images", "where blog_id = $blogId and status != 0 order by blog_image_id desc limit 3");
            if ($fetchImages && safe_mysqli_num_rows($fetchImages) > 0) {
                $x = 0;
                while ($imageRow = safe_mysqli_fetch_array($fetchImages)) {
                    $dataArray[$i]['images'][$x]['name'] = $imageRow['file_name'];
                    $x++;
                }
            }
            $date         = $blogRow['date'];
            $formatedDate = date("F d-Y", strtotime($date));
            $dataArray[$i]['blog_id']     = $blogRow['blog_id'];
            $dataArray[$i]['title']       = $blogRow['title'];
            $dataArray[$i]['slug_url']    = $blogRow['slug_url'];
            $dataArray[$i]['date']        = $formatedDate;
            $dataArray[$i]['description'] = $blogRow['description'];
            $i++;
        }
    }
    if (!function_exists('utf8ize')) {
        function utf8ize($d)
        {
            if (is_array($d)) {
                foreach ($d as $k => $v) {
                    $d[$k] = utf8ize($v);
                }
            } else if (is_string($d)) {
                return mb_convert_encoding($d, 'UTF-8', 'ISO-8859-1');
            }
            return $d;
        }
    }
    return json_encode(utf8ize($dataArray));
}
