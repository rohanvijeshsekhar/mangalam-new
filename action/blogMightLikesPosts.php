<?php
require_once '../_class/query.php';
$obj       = new Query();
$dataArray = [];
$blog_id   = $_GET['id'];

$fetchBlogs = $obj->selectData("blog_id,title,date,description,slug_url", "blogs", "where status != 0 and blog_id != $blog_id limit 4");
if (mysqli_num_rows($fetchBlogs) > 0) {
    $i = 0;
    while ($blogRow = mysqli_fetch_array($fetchBlogs)) {
        $blogId = $blogRow['blog_id'];
        /* ---------------------------- fetch blog images --------------------------- */
        $fetchImages = $obj->selectData("file_name", "blog_images", "where blog_id = $blogId and status != 0 order by blog_image_id desc limit 1");

        if (mysqli_num_rows($fetchImages) > 0) {
            while ($imageRow = mysqli_fetch_array($fetchImages)) {
                $dataArray[$i]['image'] = $imageRow['file_name'];
            }
        }
        $date                         = $blogRow['date'];
        $formatedDate                 = date("F d-Y", strtotime($date));
        $dataArray[$i]['blog_id']     = $blogRow['blog_id'];
        $dataArray[$i]['title']       = $blogRow['title'];
        $dataArray[$i]['slugUrl']    = $blogRow['slug_url'];
        $dataArray[$i]['date']        = $formatedDate;
        $i++;
    }
}
echo json_encode(utf8ize($dataArray));

function utf8ize($d)
{
    if (is_array($d)) {
        foreach ($d as $k => $v) {
            $d[$k] = utf8ize($v);
        }
    } else if (is_string($d)) {
        return utf8_encode($d);
    }
    return $d;
}