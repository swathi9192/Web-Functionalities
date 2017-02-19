<?php
function getStudentDatesForClassDetail($conn, $studentID, $sessionID)
{
$all = array();

if ($conn->connect_error) {
$error = '{"errorCode":"0001"}';
echo $error;
die();
}

$studentID = mysqli_real_escape_string($conn, $studentID);
$studentID = (int)($studentID);
$sessionID = mysqli_real_escape_string($conn, $sessionID);
$sessionID = (int)($sessionID);
if (!($studentID == "") && !($sessionID == "")) {

$studentID = !empty($studentID) ? "$studentID" : "NULL";
$sessionID = !empty($sessionID) ? "$sessionID" : "NULL";
$query_all_dates = "select meetingDate, late from meeting as m  left join (select meetingNumber, sessionID , late from attends_detail where personID =? and sessionID= ?)  as d on d.sessionID=m.sessionID and d.meetingNumber = m.meetingNumber where m.sessionID =? and concat ( meetingDate, \" \", timeStart) < date_add(now(),INTERVAL 10 MINUTE);";

if ($stmt = $conn->prepare($query_all_dates)) {
$all_dates = "";
$all_lates = "";
$stmt->bind_param("iii", $studentID, $sessionID, $sessionID);
$stmt->execute();
$stmt->bind_result($all_dates, $all_lates);
while ($stmt->fetch()) {
$all[] = array("all_dates" => $all_dates, "all_lates" => $all_lates);
}
$stmt->close();
}
$list = array($all);

}
return $list;
}
function getSemesterDates($conn, $sessionID){

    if ( $conn->connect_error ){
        $error = '{"errorCode":"0001"}'; echo $error;
        die();
    }
    //$sessionID = mysqli_real_escape_string($conn, $sessionID);
    $sessionID = (int)($sessionID);

    $query = "select semester.semesterStart, semester.semesterEnd from semester join session on (semester.semesterName = session.semester and semester.semesterYear = session.year) where session.sessionID= ?;";
    $semesterDates[] = "";
    if ($stmt = $conn->prepare($query)) {
        $startDate = "";
        $endDate = "";
        $stmt->bind_param("i", $sessionID);
        $stmt->execute();
        $stmt->bind_result($startDate,$endDate);

        while ($stmt->fetch()) {
            $semesterDates[] = array("startDate" => $startDate,"endDate"=>$endDate);
        }
        $stmt->close();
    }
    return $semesterDates;
}
?>