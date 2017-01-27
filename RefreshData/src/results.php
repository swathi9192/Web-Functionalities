<?php

include_once '../config/dbconfig.php';
include_once 'connect.php';
header('Content-Type: application/json');
date_default_timezone_set('America/Chicago');
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $response = getCustomerDetails($conn);
    mysqli_close($conn);
    $jsonformat = json_encode($response);
    echo $jsonformat;
}

?>