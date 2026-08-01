<?php
require_once '../_class/query.php';
$obj       = new Query();
$dataArray = [];

$fetchBlogs = $obj->selectData("blog_id,title,date,description,slug_url", "blogs", "where status != 0 order by blog_id desc");
if (mysqli_num_rows($fetchBlogs) > 0) {
    $i = 0;
    while ($blogRow = mysqli_fetch_array($fetchBlogs)) {
        $blogId = $blogRow['blog_id'];
        /* ---------------------------- fetch blog images --------------------------- */
        $fetchImages = $obj->selectData("file_name", "blog_images", "where blog_id = $blogId and status !=  0");
        if (mysqli_num_rows($fetchImages) > 0) {
            $x = 0;
            while ($imageRow = mysqli_fetch_array($fetchImages)) {
                $dataArray[$i]['images'][$x]['name'] = $imageRow['file_name'];
                $x++;
            }
        }
        $date                         = $blogRow['date'];
        $formatedDate                 = date("F d-Y", strtotime($date));
        $dataArray[$i]['blog_id']     = $blogRow['blog_id'];
        $dataArray[$i]['title']       = $blogRow['title'];
        $dataArray[$i]['slug_url']    = $blogRow['slug_url'];
        $dataArray[$i]['date']        = $formatedDate;
        $dataArray[$i]['description'] = $blogRow['description'];
        $i++;
    }
}
echo json_encode($dataArray);
