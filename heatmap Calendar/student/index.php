<?php
include_once('dbconfig.php');
include_once("results.php");
?>
<?php
$studentID='217';
$attendanceDetails=getStudentDatesForClassDetail($conn, $studentID, $sessionID);
$jsonArray=json_encode($attendanceDetails);
$semesterDates=getSemesterDates($conn,$sessionID);
$jsonSemDates=json_encode($semesterDates);
?>
<script>
    var attendanceDetails = <?php echo $jsonArray;?>;
    var semesterDates=<?php echo $jsonSemDates;?>;
</script>
<link rel="stylesheet" type="text/css" href="../src/calendar-heatmap.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.12.0/moment.min.js" charset="utf-8"></script>
<script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="../src/calendar-heatmap.js"></script>
<script type="text/javascript">

    $(document).ready(function(){
        mapCalendarData();
    });


    function mapCalendarData()
    {
        var chartData = attendanceDetails[0].map(function (classObj) {
            var st;
            if (classObj.all_lates == null)
                st = 1;
            else if (classObj.all_lates == 0)
                st = 3;
            else if (classObj.all_lates == 1)
                st = 2;
            else if (classObj.all_lates == -2)
                st = 1;
            return {
                classDate: classObj.all_dates,
                status: st

            };
        });
        var  startDate = semesterDates[1].startDate;

        var  endDate = semesterDates[1].endDate;
        var heatmap = calendarHeatmap()
            .  data(chartData)
            .selector('#AttendanceCalendar')
            .tooltipEnabled(true)
            .colorRange(['#D3D3D3','#FF0000', '#FFA500','#008000']).startDate(startDate).endDate(endDate)
            .onClick(function (data) {
                console.log('data', data);
            });
        heatmap();
    }

</script>
<div id="AttendanceCalendar" >
    <!-- put your heatmap here-->
</div>
