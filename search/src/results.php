<?php

include_once '../config/dbconfig.php';
include_once 'connect.php';
header('Content-Type: application/json');
date_default_timezone_set('America/Chicago');
if ($_SERVER['REQUEST_METHOD'] == 'GET') {

  if (isset($_GET['custname']) && !empty($_GET['custname'])) {
    $cname = mysqli_real_escape_string($conn, $_GET['custname']);
} else {

  $error = '{"errorCode":"20010"}';
echo $error;
die();
}

    $response = getCustomerDetails($conn, $cname);
    mysqli_close($conn);
    $jsonformat = json_encode($response);
    echo $jsonformat;

}

?>