<?php

function getCustomerDetails($conn,$custname)
{

    if ($conn->connect_error) {
        $error = '{"errorCode":"0001"}';
      echo $error;
     die();
    }
    $query = "SELECT Cust_name, Cust_phone FROM customer where Cust_name LIKE CONCAT('%',?,'%');";
    $cust_name = "";
    $cust_phone = "";

    $list = array();

    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("s", $custname);
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