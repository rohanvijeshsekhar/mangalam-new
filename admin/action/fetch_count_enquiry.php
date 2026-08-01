<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj       = new Query();
$dataArray = [];

/* --------------------------- customization count -------------------------- */
$fetch_customize_count = $obj->selectData("count(enquiry_id) as customization_count", "enquiry", "where status != 0");
$customize_count_row   = mysqli_fetch_array($fetch_customize_count);

/* --------------------------- package count -------------------------- */
$fetch_package_count = $obj->selectData("count(id) as package_count", "enquiry_package", "where status != 0");
$package_count_row   = mysqli_fetch_array($fetch_package_count);

/* --------------------------- cart count -------------------------- */
$fetch_cart_count = $obj->selectData("count(id) as cart_count", "enquiry_cart", "where status != 0");
$cart_count_row   = mysqli_fetch_array($fetch_cart_count);

/* --------------------------- contact count -------------------------- */
$fetch_contact_count = $obj->selectData("count(id) as contact_count", "enquiry_contact", "where status != 0");
$contact_count_row   = mysqli_fetch_array($fetch_contact_count);

/* --------------------------- career count -------------------------- */
$fetch_career_count = $obj->selectData("count(id) as career_count", "enquiry_career", "where status != 0");
$career_count_row   = mysqli_fetch_array($fetch_career_count);

/* --------------------------- blog count -------------------------- */
$fetch_blog_count = $obj->selectData("count(id) as blog_count", "enquiry_blog", "where status != 0");
$blog_count_row   = mysqli_fetch_array($fetch_blog_count);

$dataArray[0]['customization_count'] = $customize_count_row['customization_count'];
$dataArray[0]['package_count']       = $package_count_row['package_count'];
$dataArray[0]['cart_count']          = $cart_count_row['cart_count'];
$dataArray[0]['contact_count']       = $contact_count_row['contact_count'];
$dataArray[0]['career_count']        = $career_count_row['career_count'];
$dataArray[0]['blog_count']          = $blog_count_row['blog_count'] ?? 0;

echo json_encode($dataArray);
