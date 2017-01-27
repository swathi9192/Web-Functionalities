<?php

function getCustomerDetails($conn)
{

    if ($conn->connect_error) {
        $error = '{"errorCode":"0001"}';
      echo $error;
     die();
    }
    $query = "SELECT Cust_name, Cust_phone FROM customer;";
    $cust_name = "";
    $cust_phone = "";

    $list = array();

    if ($stmt = $conn->prepare($query)) {
        $stmt->execute();
        $stmt->bind_result($cust_name, $cust_phone);


        while ($stmt->fetch()) {
            $list[] = array('custname' => $cust_name,
                'custphone' => $cust_phone);

        }

        $stmt->close();

    }
    return $list;

}

?>