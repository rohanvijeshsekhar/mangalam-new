<?php
require_once __DIR__ . '/../_class/query.php';

function blogData($slug_url)
{
    $obj       = new Query();
    $dataArray = [];


    $fetch_blog_data = $obj->selectData("title,description,blog_id,date,meta", "blogs", "where slug_url = '$slug_url' and status != 0");
    if (mysqli_num_rows($fetch_blog_data) > 0) {
        $blog_row = mysqli_fetch_array($fetch_blog_data);
        $blog_id  = $blog_row['blog_id'];
        /* ---------------------------- fetch blog images --------------------------- */
        $fetch_blog_image = $obj->selectData("file_name", "blog_images", "where blog_id = $blog_id and status != 0 order by blog_image_id desc limit 1");
        $blog_image_row   = mysqli_num_rows($fetch_blog_image) > 0 ? mysqli_fetch_array($fetch_blog_image) : null;

        $date                        = $blog_row['date'];
        $formatedDate                = date("F d-Y", strtotime($date));
        $dataArray[0]['title']       = $blog_row['title'];
        $dataArray[0]['blog_id']     = $blog_id;
        $dataArray[0]['description'] = $blog_row['description'];
        $dataArray[0]['date']        = $formatedDate;
        $dataArray[0]['image']       = $blog_image_row ? $blog_image_row['file_name'] : '';
        $dataArray[0]['meta']        = $blog_row['meta'];

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
