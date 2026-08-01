<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj       = new Query();
$dataArray = [];

$fetchBlogs = $obj->selectData("blog_id,title,date,description", "blogs", "where status != 0 order by blog_id desc");
if (mysqli_num_rows($fetchBlogs) > 0) {
    $i = 0;
    while ($blogRow = mysqli_fetch_array($fetchBlogs)) {
        $blogId                   = $blogRow['blog_id'];
        $dataArray[$i]['blog_id'] = $blogRow['blog_id'];
        $dataArray[$i]['title']   = $blogRow['title'];
        $dataArray[$i]['date']    = $blogRow['date'];
        $i++;
    }
}
echo json_encode($dataArray);
