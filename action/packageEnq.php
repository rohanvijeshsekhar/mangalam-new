<?php
require_once '../_class/query.php';
require './mailer.php';
$obj = new query();
header('Content-Type: application/json; charset=utf-8');
$data = json_decode(file_get_contents('php://input'), true);

$name           = $data[0]['name'];
$phone          = $data[0]['phone'];
$email          = $data[0]['email'];
$adults_count   = $data[0]['adults'];
$cheldren_count = $data[0]['children'];
$age_array      = $data[0]['age'];
$date           = $data[0]['date'];
$destination_id = $data[0]['destinationId'];
$packageId      = $data[0]['packageId'];

/* --------------------------- insert enquiry -------------------------- */
$infoEnq = [
	'name'           => $name,
	'email'          => $email,
	'phone'          => $phone,
	'date'           => $date,
	'adults_count'   => $adults_count,
	'children_count' => $cheldren_count,
];
$insertEnq = $obj->insertData("enquiry_package", $infoEnq);

/* ---------------------------- fetch enquiry_id ---------------------------- */
$sql_fetch_enq_id = $obj->selectData("id", "enquiry_package", "where status != 0 order by id desc limit 1");
$enq_id_row       = mysqli_fetch_array($sql_fetch_enq_id);
$enq_id           = $enq_id_row['id'];
/* ------------------------- inserting cheldren age ------------------------- */
for ($i = 0; $i < sizeof($age_array); $i++) {
	$info_age = [
		'enquiry_package_id' => $enq_id,
		'age'                => $age_array[$i],
	];
	$sql_age = $obj->insertData("enquiry_packge_age", $info_age);
}
/* ------------------------- fetch destination name ------------------------- */
$fetch_destination_name = $obj->selectData("destination_name,inner_image", "destinations", "where destination_id = $destination_id");
$destination_name_row   = mysqli_fetch_array($fetch_destination_name);
$destination_name       = $destination_name_row['destination_name'];
$destination_image       = $destination_name_row['inner_image'];

/* ------------------------- fetch package name ------------------------- */
$fetch_package_name = $obj->selectData("title", "packages", "where package_id  = $packageId");
$package_name_row   = mysqli_fetch_array($fetch_package_name);
$package_name       = $package_name_row['title'];




$template2 = '<!DOCTYPE html>

<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">

<head>
	<title></title>
	<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
	<meta content="width=device-width, initial-scale=1.0" name="viewport" />
	<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		.image_block img+div {
			display: none;
		}

		@media (max-width:620px) {

			.desktop_hide table.icons-inner,
			.social_block.desktop_hide .social-table {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.image_block img.big,
			.row-7 .column-2 .block-1.button_block .alignment a,
			.row-7 .column-2 .block-1.button_block .alignment div,
			.row-content {
				width: 100% !important;
			}

			.mobile_hide {
				display: none;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}

			.row-3 .column-1 .block-2.paragraph_block td.pad>div {
				font-size: 14px !important;
			}

			.row-3 .column-1 .block-2.paragraph_block td.pad {
				padding: 0 10px 20px !important;
			}

			.row-3 .column-1 .block-1.heading_block td.pad {
				padding: 15px !important;
			}

			.row-3 .column-1 .block-1.heading_block h1 {
				font-size: 25px !important;
			}

			.row-4 .column-2 .block-3.text_block td.pad,
			.row-4 .column-3 .block-3.text_block td.pad,
			.row-5 .column-1 .block-3.text_block td.pad,
			.row-5 .column-2 .block-3.text_block td.pad,
			.row-5 .column-3 .block-3.text_block td.pad,
			.row-6 .column-2 .block-3.text_block td.pad,
			.row-6 .column-3 .block-3.text_block td.pad {
				padding: 0 0 20px !important;
			}

			.row-6 .column-1 .block-3.text_block td.pad {
				padding: 0 !important;
			}

			.row-7 .column-2 .block-1.button_block a span,
			.row-7 .column-2 .block-1.button_block div,
			.row-7 .column-2 .block-1.button_block div span {
				line-height: 2 !important;
			}
		}

	</style>
</head>

<body style="margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none; background-color: #ffffff;">
	<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" width="100%">
		<tbody>
			<tr>
				<td>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; border-radius: 0; color: #000000; width: 600px;"
										width="600">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="image_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad"
																style="width:100%;padding-right:0px;padding-left:0px;">
																<div align="center" class="alignment"
																	style="line-height:10px"><img
																		src="http://mangalamtravel.com/assets/images/logo/logo-color.png"
																		style="display: block; height: auto; border: 0; width: 150px; max-width: 100%;"
																		width="150" /></div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; border-radius: 5px; width: 600px;"
										width="600">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="10" cellspacing="0"
														class="image_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad">
																<div align="center" class="alignment"
																	style="line-height:10px"><img alt="image of dubai"
																		class="big"
																		src="http://mangalamtravel.com/admin/files/destinations/' . $destination_image . '"
																		style="display: block; height: auto; border: 0; width: 580px; max-width: 100%;"
																		title="image of dubai" width="580" /></div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px;"
										width="600">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="10" cellspacing="0"
														class="heading_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad">
																<h1
																	style="margin: 0; color: #080808; direction: ltr; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 30px; font-weight: 700; letter-spacing: -1px; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;">
																	<span class="tinyMce-placeholder">Hi, Your
																		Itinerary Looks Amazing ' . ucwords($name) . '</span>
																</h1>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="paragraph_block block-2" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad"
																style="padding-bottom:30px;padding-left:10px;padding-right:10px;padding-top:10px;">
																<div
																	style="color:#101112;direction:ltr;font-family:\'Helvetica Neue\', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:24px;">
																	<p style="margin: 0;">Thanks for your enquiry. Our
																		travel experts are crafting the itinerary as per
																		your preferences. We will get in touch with you
																		soon.</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto;"
						width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; backgrsound-size: auto; background-color: #ffffff; color: #000000; border-radius: 0; width: 600px;"
										width="600">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 20px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="33.333333333333336%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="image_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad"
																style="width:100%;padding-right:0px;padding-left:0px;">
																<div align="center" class="alignment"
																	style="line-height:10px"><img alt=""
																		src="http://mangalamtravel.com/action/images/package.png"
																		style="display: block; height: auto; border: 0; width: 40px; max-width: 100%;"
																		title="" width="40" /></div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="5" cellspacing="0"
														class="text_block block-2" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class=""
																		style="font-size: 12px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p
																			style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 19.2px;">
																			<span style="font-size:12px;">NAME</span>
																		</p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="text_block block-3" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class=""
																		style="font-size: 12px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p
																			style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;">
																			<strong>' . $name . '</strong>
																		</p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-2"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="33.333333333333336%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="image_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad"
																style="width:100%;padding-right:0px;padding-left:0px;">
																<div align="center" class="alignment"
																	style="line-height:10px"><img alt=""
																		src="http://mangalamtravel.com/action/images/phone.png"
																		style="display: block; height: auto; border: 0; width: 40px; max-width: 100%;"
																		title="" width="40" /></div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="5" cellspacing="0"
														class="text_block block-2" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class=""
																		style="font-size: 12px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p
																			style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 19.2px;">
																			<span style="font-size:12px;">PHONE</span>
																		</p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="text_block block-3" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class=""
																		style="font-size: 12px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p
																			style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;">
																			<strong>' . $phone . '</strong>
																		</p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-3"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="33.333333333333336%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="image_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad"
																style="width:100%;padding-right:0px;padding-left:0px;">
																<div align="center" class="alignment"
																	style="line-height:10px"><img alt=""
																		src="http://mangalamtravel.com/action/images/icons8-location-50_2.png"
																		style="display: block; height: auto; border: 0; width: 40px; max-width: 100%;"
																		title="" width="40" /></div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="5" cellspacing="0"
														class="text_block block-2" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class=""
																		style="font-size: 12px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p
																			style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 19.2px;">
																			<span
																				style="font-size:12px;">DESTINATION</span>
																		</p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="text_block block-3" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class=""
																		style="font-size: 12px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p
																			style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;">
																			<strong>' . $destination_name . '</strong>
																		</p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px;"
										width="600">
										<tbody>
											<tr>
											<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 20px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="33.333333333333336%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="image_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad"
																style="width:100%;padding-right:0px;padding-left:0px;">
																<div align="center" class="alignment"
																	style="line-height:10px"><img alt=""
																		src="http://mangalamtravel.com/action/images/icons8-calendar-96_1.png"
																		style="display: block; height: auto; border: 0; width: 40px; max-width: 100%;"
																		title="" width="40" /></div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="5" cellspacing="0"
														class="text_block block-2" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class=""
																		style="font-size: 12px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p
																			style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 19.2px;">
																			<span style="font-size:12px;">PACKAGE NAME</span>
																		</p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="text_block block-3" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class=""
																		style="font-size: 12px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p
																			style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;">
																			<strong>' . $package_name . '</strong>
																		</p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 20px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="33.333333333333336%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="image_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad"
																style="width:100%;padding-right:0px;padding-left:0px;">
																<div align="center" class="alignment"
																	style="line-height:10px"><img alt=""
																		src="http://mangalamtravel.com/action/images/icons8-calendar-96_1.png"
																		style="display: block; height: auto; border: 0; width: 40px; max-width: 100%;"
																		title="" width="40" /></div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="5" cellspacing="0"
														class="text_block block-2" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class=""
																		style="font-size: 12px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p
																			style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 19.2px;">
																			<span style="font-size:12px;">TRIP START
																				DATE</span>
																		</p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="text_block block-3" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class=""
																		style="font-size: 12px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p
																			style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;">
																			<strong>' . $date . '</strong>
																		</p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</td>
											
												<td class="column column-3"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="33.333333333333336%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="image_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad"
																style="width:100%;padding-right:0px;padding-left:0px;">
																<div align="center" class="alignment"
																	style="line-height:10px"><img alt=""
																		src="http://mangalamtravel.com/action/images/icons8-person-90_1.png"
																		style="display: block; height: auto; border: 0; width: 40px; max-width: 100%;"
																		title="" width="40" /></div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="5" cellspacing="0"
														class="text_block block-2" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class=""
																		style="font-size: 12px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p
																			style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 19.2px;">
																			<span style="font-size:12px;">TOTAL
																				ADULTS</span>
																		</p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="text_block block-3" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class=""
																		style="font-size: 12px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p
																			style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;">
																			<strong>' . $adults_count . '</strong>
																		</p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px;"
										width="600">
										<tbody>
										<tr>';
if (sizeof($age_array) > 0) {
	$template2 .=
		'<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 40px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="33.333333333333336%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="image_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad"
																style="width:100%;padding-right:0px;padding-left:0px;">
																<div align="center" class="alignment"
																	style="line-height:10px"><img alt=""
																		src="http://mangalamtravel.com/action/images/icons8-children-64_1.png"
																		style="display: block; height: auto; border: 0; width: 40px; max-width: 100%;"
																		title="" width="40" /></div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="5" cellspacing="0"
														class="text_block block-2" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class=""
																		style="font-size: 12px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p
																			style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 19.2px;">
																			<span style="font-size:12px;">TOTAL
																				CHILDREN</span>
																		</p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="text_block block-3" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class=""
																		style="font-size: 12px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p
																			style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;">
																			<strong>' . sizeof($age_array) . ' Children(';
	foreach ($age_array as $age) {

		$template2 .= $age . ',';
	}

	$template2 .= ')</strong>
																		</p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</td>';
}



$template2 .= '</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-7"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; border-radius: 0; color: #000000; width: 600px;"
										width="600">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="50%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="button_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad" style="text-align:center;">
																<div align="center" class="alignment">
																	<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://api.whatsapp.com/send?phone=+971562675889&text=Hello, *Mangalam Tours* ," style="height:42px;width:300px;v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#123d23"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a
																		href="https://api.whatsapp.com/send?phone=+971562675889&text=Hello, *Mangalam Tours* ,"
																		style="text-decoration:none;display:block;color:#ffffff;background-color:#123d23;border-radius:4px;width:100%;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:5px;padding-bottom:5px;font-family:\'Helvetica Neue\', Helvetica, Arial, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"
																		target="_blank"><span
																			style="padding-left:5px;padding-right:5px;font-size:16px;display:inline-block;letter-spacing:normal;"><span
																				dir="ltr"
																				style="word-break: break-word; line-height: 32px;">
																				Chat on Whats
																				App</a><!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
																</div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-2"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="50%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="button_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad" style="text-align:center;">
																<div align="center" class="alignment">
																	<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="tel:+971562675889" style="height:42px;width:270px;v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#2a2a2a"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a
																		href="tel:+971562675889"
																		style="text-decoration:none;display:block;color:#ffffff;  background: linear-gradient(to right, #f63871 0%, #ff800b 100%);
																		border-radius:4px;width:90.00%;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:5px;padding-bottom:5px;font-family:\'Helvetica Neue\', Helvetica, Arial, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"
																		target="_blank"><span
																			style="padding-left:5px;padding-right:5px;font-size:16px;display:inline-block;letter-spacing:normal;"><span
																				dir="ltr"
																				style="word-break: break-word; line-height: 32px;">
																				Call
																				Us</span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-8"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; border-radius: 0; color: #000000; width: 600px;"
										width="600">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="social_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad"
																style="text-align:center;padding-right:0px;padding-left:0px;">
																<div align="center" class="alignment">
																	<table border="0" cellpadding="0" cellspacing="0"
																		class="social-table" role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;"
																		width="126px">
																		<tr>
																			<td style="padding:0 5px 0 5px;"><a
																					href="https://www.facebook.com/profile.php?id=100094357692373"
																					target="_blank"><img alt="Facebook"
																						height="32"
																						src="http://mangalamtravel.com/action/images/facebook2x.png"
																						style="display: block; height: auto; border: 0;"
																						title="facebook"
																						width="32" /></a></td>
																			<td style="padding:0 5px 0 5px;"><a
																					href="https://www.instagram.com/mangalamtravelandtours/?hl=en"
																					target="_blank"><img alt="Instagram"
																						height="32"
																						src="http://mangalamtravel.com/action/images/instagram2x.png"
																						style="display: block; height: auto; border: 0;"
																						title="instagram"
																						width="32" /></a></td>
																			<td style="padding:0 5px 0 5px;"><a
																					href="https://twitter.com/Mangalam Tours"
																					target="_blank"><img alt="Twitter"
																						height="32"
																						src="http://mangalamtravel.com/action/images/twitter2x.png"
																						style="display: block; height: auto; border: 0;"
																						title="twitter"
																						width="32" /></a></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="10" cellspacing="0"
														class="paragraph_block block-2" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad">
																<div
																	style="color:#101112;direction:ltr;font-family:\'Helvetica Neue\', Helvetica, Arial, sans-serif;font-size:12px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
																	<p style="margin: 0;">Copyright 2024 Mangalam Tours,
																		All rights reserved.</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-9"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px;"
										width="600">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="icons_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad"
																style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
																<table cellpadding="0" cellspacing="0"
																	role="presentation"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
																	width="100%">
																	<tr>
																		<td class="alignment"
																			style="vertical-align: middle; text-align: center;">
																			<!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
																			<!--[if !vml]><!-->
																			<table cellpadding="0" cellspacing="0"
																				class="icons-inner" role="presentation"
																				style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">
																				<!--<![endif]-->
																			
																			</table>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table><!-- End -->
</body>

</html>
';
$template = '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customize Email</title>
    <!-- <link rel="stylesheet" href="style.css"> -->
  <style>
          * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
          }
  
          body,
          table,
          td,
          p,
          h1,
          h2,
          h3,
          h4,
          a {
              font-family: "Helvetica", Arial, sans-serif;
              /* Updated font family */
              color: #000;
              margin: 0;
              padding: 0;
          }
  
          h1 {
              font-size: 40px;
              color: rgb(255, 0, 111);
          }
  
          @media (max-width: 768px) {
              h1 {
                  font-size: 30px;
              }
          }
  
          h2 {
              font-size: 25px;
              margin: 10px 0px;
          }
  
          @media (max-width: 768px) {
              h2 {
                  font-size: 18px;
                  margin-bottom: 20px;
              }
          }
  
          @media (max-width: 768px) {
              p {
                  font-size: 14px;
              }
          }
  
          .container {
              max-width: 600px;
              margin: 0 auto;
              margin-top: 30px;
             
          }
  
          @media (max-width: 768px) {
              .container {
                  padding: 0px 20px;
              }
          }
  
          .center-txt {
              text-align: center;
          }
  
          header {
              display: flex;
              align-items: center;
              justify-content: center;
          
          }
  
          header .logo {
              
            width : 100%;
          }
  
          header .logo img {
             
          }
  
          .banner {
              width: 100%;
              height: 300px;
              background: #eee;
              background-image: url("./admin/files/destinations/' . $destination_image . '");
              background-size: cover;
              background-position: center;
              border-radius: 10px;
              margin-bottom: 30px;
              position: relative;
              overflow : hidden;
          }
  
          .banner svg {
              position: absolute;
              bottom: -20px;
              left: 0;
              display: none;
          }
            .banner img {
                width : 100%;
                height : 100%;
                object-fit : cover;
               border-radius: 10px;
            }
          .things {
              margin-top: 60px;
              justify-content: space-between;
              border: 1px solid rgba(0, 0, 0, 0.064);
              padding: 10px;
              border-radius: 20px;
              float : left;
          }
  
          .things .column {
              float: left;
              width: 49%;
              margin-right: 5px;
              padding: 10px 0px;
              margin-bottom: 5px;
           
              padding: 10px;
              border-radius: 10px;
              border: 1px solid rgba(0, 0, 0, 0.064);
          }
  
          @media (max-width: 768px) {
              .things .column {
                  width: 100%;
                  margin: 0;
                  margin-bottom: 10px;
              }
          }
  
          .things .column .icon {
              width: 30px;
              height: 30px;
              background: rgb(255, 228, 228);
              border-radius: 100%;
              padding: 5px;
              float: left;
          }
  
          .things .column .icon img {
              width: 100%;
          }
  
          .things .column .content {
              width: 80%;
              float: left;
              margin-left: 10px;
          }
      
  
          .things .column .content span {
              display: block;
              font-size: 12px;
              margin-bottom: 5px;
          }
  
          .things .column .content span:nth-child(2) {
              font-size: 16px;
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
          }
          .things .column .content span:nth-child(2) .box {
              width: calc(50% - 10px);
              padding: 5px 0px;
          }
          @media (max-width: 475px) {
              .things .column .content span:nth-child(2) .box {
                  width: 100%;
              }
          }
          .contact-section {
              width: 100%;
              margin-top: 20px;
          }
          @media (max-width: 475px) {
              .contact-section {
                  flex-direction: column;
              }
          }
          .contact-section a {
              width: 49%;
              text-align: center;
              align-items: center;
              justify-content: center;
              text-decoration: none;
              padding: 13px 0px;
              background: #eee;
              border-radius: 5px;
              color: black;
              font-size: 13px;
              float: left;
             
          }
         
          @media (max-width: 475px) {
              .contact-section a {
              margin-left : 0;
                  width: 100%;
                  margin-bottom: 10px;
              }
          }
          .contact-section a img {
              width: 18px;
              margin-right: 10px;
          }
          .contact-section a:nth-child(1) {
              background: rgb(235, 235, 235);
            
          }
          .contact-section a:nth-child(2) {
              background: rgb(235, 235, 235);
                margin-left : 1%;
          }
         /* Default styles */
.footer {
  height: 100px;
  background: white;
  margin-top: 30px;
  margin-bottom: 30px;
  border-radius: 10px;
  color: white;
  padding: 25px 0px;
      float: left;
    width: 100%;
    padding: 20px;
}

.footer span {
  font-size: 10px;
  text-transform: uppercase;
  display: block;
  margin-bottom: 10px;
  text-align : center;
  color : black;
}

.footer ul {
  background: red;
  width : 90px;
  margin: 0 auto;
}

.footer ul li {
  list-style: none;
  margin-right: 10px;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  overflow: hidden;
  opacity: 0.5;
  float: left;
}
.footer ul li:nth-child(3) {
    margin-right : 0;
}

.footer ul li img {
  width: 20px;
  height: 20px;
}

.website-link {
  display: block;
  width: 100%;
  text-align: center;
  margin-top: 30px;
  text-decoration: none;
  font-size: 14px;
}

      </style>
</head>
<body>
    <div class="container">
                  <header>
              <div class="logo">
              <center>
                  <img width="150"src="http://mangalamtravel.com/assets/images/logo/logo-color.png" alt="tour me tour logo">
                  </center>
              </div>
          </header>
          <div class="banner">
             <img src="http://mangalamtravel.com/admin/files/destinations/' . $destination_image . '"" width="100%"/>
          </div>
        <div class="row center-txt">
            <h1>' . $destination_name . '</h1>
            <h2>Hi,👋 Your Itinerary Looks Amazing ' . ucwords($name) . '</h2>
            <p>Thanks for your enquiry. Our travel experts are crafting the itinerary as per your preferences. We will get in touch with you soon.</p>
        </div>
        <div class="row things">
        <div class="column">
                <div class="icon">
                    <img src="http://mangalamtravel.com/action/images/icons8-location-50.png" alt="destination icon">
                </div>
                <div class="content">
                    <span>Name</span>
                    <span>' . $name . '</span>
                </div>
            </div>
            <div class="column">
                <div class="icon">
                    <img src="http://mangalamtravel.com/action/images/icons8-location-50.png" alt="destination icon">
                </div>
                <div class="content">
                    <span>Phone</span>
                    <span>' . $phone . '</span>
                </div>
            </div>
            <div class="column">
                <div class="icon">
                    <img src="http://mangalamtravel.com/action/images/icons8-location-50.png" alt="destination icon">
                </div>
                <div class="content">
                    <span>Destination</span>
                    <span>' . $destination_name . '</span>
                </div>
            </div>
            <div class="column">
                <div class="icon">
                    <img src="http://mangalamtravel.com/action/images/icons8-person-90.png" alt="destination icon">
                </div>
                <div class="content">
                    <span>Package</span>
                    <span>' . $package_name . '</span>
                </div>
            </div>
            <div class="column">
                <div class="icon">
                    <img src="http://mangalamtravel.com/action/images/icons8-calendar-96.png" alt="destination icon">
                </div>
                <div class="content">
                    <span>Trip Date</span>
                    <span>' . $date . '</span>
                </div>
            </div>
            <div class="column">
                <div class="icon">
                    <img src="http://mangalamtravel.com/action/images/icons8-person-90.png" alt="destination icon">
                </div>
                <div class="content">
                    <span>Total Adults</span>
                    <span>' . $adults_count . '</span>
                </div>
            </div>';
if (sizeof($age_array) > 0) {
	$template .= '<div class="column">
                <div class="icon">
                    <img src="http://mangalamtravel.com/action/images/icons8-children-64.png" alt="destination icon">
                </div>
                <div class="content">
                    <span>Total Children</span>
                    <span>' . sizeof($age_array) . ' (Age : ';
	foreach ($age_array as $age) {
		$template .= $age . ',';
	}
	$template .= ')</span>
                </div>
            </div>';
}
$template .= '<div class="contact-section">
                  <a href="https://api.whatsapp.com/send?phone=+971562675889&amp;text=Hi, I\'m enquiring from Mangalam Tours website"><img src="http://mangalamtravel.com/action/images/whatsapp.png" alt="whatsapp icon" />Whats App</a>
                  <a href="tel:+971562675889"><img src="http://mangalamtravel.com/action/images/ringer-volume.png" alt="call icon" />Call Us</a>
            </div>
           
        </div>
        <div class="footer">
            <span>Follow Us On</span>
            <ul>
                <li>
                    <a href="">
                        <img src="http://mangalamtravel.com/action/images/insta.png" alt="">
                    </a>
                </li>
                <li>
                    <a href="">
                        <img src="http://mangalamtravel.com/action/images/fb.png" alt="">
                    </a>
                </li>
                <li>
                    <a href="">
                        <img src="http://mangalamtravel.com/action/images/twitterr.png" alt="">
                    </a>
                </li>
            </ul>
        </div>
    </div>
</body>
</html>';
$subject = 'Travel Enquiry | ' . $destination_name . ' | ' . $date;
$sendmail = sendMail('enquiries@mangalamtravel.com', $subject, $template2, $email);
$sendmail2 = sendMail('prinu@travinno.com', $subject, $template2, $email);
$sendmail3 = sendMail('enquiries@mangalamtravel.com', $subject, $template2, $email);
$sendmail1 = sendMail($email, $subject, $template2, $email);


if ($sendmail == 1 && $sendmail1) {
	echo 1;
} else {
	echo 0;
}
