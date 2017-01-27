<?php
/**
 * Created by:
 * User: jtrimmer
 * Date: 3/6/2016
 * Time: 6:58 PM
 */

$config = array(
            "dbname" => "test",
            "username" => "root",
            "password" => "",
            "host" => "localhost:3306"
);

//database details from config file

$dbuser = $config['username'];
$dbpass = $config['password'];
$database_name = $config['dbname'];
$server = $config['host'];



//connect to cat instance
$conn = mysqli_connect($server, $dbuser, $dbpass,$database_name);
if(mysqli_connect_errno()){ die("ERROR: Couldn't connect to database. <br>".mysqli_error());}




?>