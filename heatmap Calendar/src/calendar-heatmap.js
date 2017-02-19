function calendarHeatmap() {
    var width = 500;
    var height = 180;
    var legendWidth = 150;
    //Week labels to display as column names in chart.
    var weeks = ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12','W13','W14','W15','W16','W17'];
    //Day labels to display as row names in chart.
    var days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    var selector = 'AttendanceCalendar';
    var SQUARE_LENGTH = 20;
    var SQUARE_PADDING = 2;
    var WEEK_LABEL_PADDING = 6;
    var data = [];
    var startDate=new Date();
    var endDate=new Date();
    // Cell colors based on status.
    var colorRange = [];
    var tooltipEnabled = true;
    var legendEnabled = false;
    var onClick = null;
    var weekStart = 0; //0 for Sunday, 1 for Monday

    // setters and getters
    chart.data = function (value) {
        if (!arguments.length) { return data; }
        data = value;
        return chart;
    };
    chart.endDate = function (value) {
        if (!arguments.length) { return endDate; }
        endDate = value;
        return chart;
    };
    chart.startDate=function(value)
    {
        if(!arguments.length){return startDate;}
        startDate=value;
        return chart;
    };
    chart.selector = function (value) {
        if (!arguments.length) { return selector; }
        selector = value;
        return chart;
    };

    chart.colorRange = function (value) {
        if (!arguments.length) { return colorRange; }
        colorRange = value;
        return chart;
    };

    chart.tooltipEnabled = function (value) {
        if (!arguments.length) { return tooltipEnabled; }
        tooltipEnabled = value;
        return chart;
    };

    chart.legendEnabled = function (value) {
        if (!arguments.length) { return legendEnabled; }
        legendEnabled = value;
        return chart;
    };

    chart.onClick = function (value) {
        if (!arguments.length) { return onClick(); }
        onClick = value;
        return chart;
    };

    function chart() {

        d3.select(chart.selector()).selectAll('svg.calendar-heatmap').remove(); // remove the existing chart, if it exists
        // dateArray gives no. of cells to be displayed in heatmap.
        var dateArray=d3.time.scale()
            .domain([moment(startDate).toDate(), moment(endDate).toDate()])
            .ticks(d3.time.days, 1);
        var rectdata=dateArray;
        var weekRange = d3.time.weeks(moment(startDate).toDate(), moment(endDate).toDate());

        Date.prototype.getWeek = function() {
            var onejan = new Date(this.getFullYear(),0,1);
            return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
        }
        var firstweek=weekRange[0].getWeek();
        var weekNumbers=[];
        for(i=0;i<weekRange.length;i++)
            weekNumbers.push(weekRange[i].getWeek());
        var firstDate = moment(dateArray[0]);
        var max = d3.max(chart.data(), function (d) { return d.status; }); // max data value

        // color range
        var color = d3.scale.linear()
            .range(chart.colorRange())
            .domain([0,1,2,3]);

        var tooltip;
        var dayRects;

        drawChart();

        function drawChart() {
            var svg = d3.select(chart.selector())
                .append('svg')
                .attr('width', width)
                .attr('class', 'calendar-heatmap')
                .attr('height', height)
                .style('padding', '15px');

            dayRects = svg.selectAll('.day-cell')
                .data(rectdata);  //  array of days for the last yr

            dayRects.enter().append('rect')
                .attr('class', 'day-cell')
                .attr('width', SQUARE_LENGTH)
                .attr('height', SQUARE_LENGTH)
                .attr('fill', function(d) { return color(checkthestatus(d)); }) //checks the status of student's attendance passing each date in heatmap as input parameter.
                .attr('x', function (d, i) {
                    var cellDate = moment(d);
                    var result = cellDate.week() - firstDate.week() + (firstDate.weeksInYear() * (cellDate.weekYear() - firstDate.weekYear()));
                    return result * (SQUARE_LENGTH + SQUARE_PADDING);
                })
                .attr('y', function (d, i) {

                    return WEEK_LABEL_PADDING + formatWeekday(d.getDay()) * (SQUARE_LENGTH + SQUARE_PADDING);


                });

            if (typeof onClick === 'function') {
                dayRects.on('click', function (d) {
                    var count = checkthestatus(d);
                    onClick({ date: d, count: count});
                });
            }

            if (chart.tooltipEnabled()) {
                dayRects.on('mouseover', function (d, i) {
                    tooltip = d3.select(chart.selector())
                        .append('div')
                        .attr('class', 'day-cell-tooltip')
                        .html(tooltipHTMLForDate(d))//Gets the tooltip text for each date in heatmap.
                        .style('left', function () { return Math.floor(i / 7) * SQUARE_LENGTH + 'px'; })
                        .style('top', function () {
                            return formatWeekday(d.getDay()) * (SQUARE_LENGTH + SQUARE_PADDING) + WEEK_LABEL_PADDING * 3 + 'px';

                        });
                })
                    .on('mouseout', function (d, i) {
                        tooltip.remove();
                    });
            }

            if (chart.legendEnabled()) {
                var colorRange = [color(0)];
                for (var i = 3; i > 0; i--) {
                    colorRange.push(color(max / i));
                }

            }

            dayRects.exit().remove();
            //displays week labels as columns in heatmap.
            var weeklabels = svg.selectAll('.week')
                .data(weekRange)
                .enter().append('text')
                .attr('class', 'week-name')
                .style()
                .text(function (d) {
                    if(d.getWeek()%2==0) //displays alternative weeks as labels.
                        return weeks[d.getWeek()-firstweek];
                })
                .attr('x', function (d, i) {
                    var matchIndex = 0;
                    dateArray.find(function (element, index) {
                        matchIndex = index;
                        return moment(d).isSame(element, 'week');
                    });

                    return Math.floor(matchIndex / 7) * (SQUARE_LENGTH + SQUARE_PADDING);
                })
                .attr('y', 0);  // fix these to the top

            days.forEach(function (day, index) {
                index = formatWeekday(index);
                // if (index % 2) {
                svg.append('text')
                    .attr('class', 'day-initial')
                    .attr('transform', 'translate(-8,' + (SQUARE_LENGTH + SQUARE_PADDING) * (index + 1) + ')')
                    .style('text-anchor', 'middle')
                    .attr('dy', '2')
                    .text(day);
                //  }
            });
        }

        function tooltipHTMLForDate(d) {
            var dateStr = moment(d).format('ddd, MMM Do YYYY');
            var count = checkthestatus(d);
            var slabel="";
            if(count==1)
                slabel= "<span>Student is absent on "+dateStr+"</span>";
            else if(count==2)
                slabel= "<span>Student is tardy on "+dateStr+"</span>";
            else if(count==3)
                slabel= "<span>Student is present on "+dateStr+"</span>";
            else
                slabel="<span>No Class on "+dateStr+"</span>"
            return slabel;
        }

        function checkthestatus(d) {
            var count = 0;
            var match = chart.data().find(function (element, index) {
                return moment(element.classDate).isSame(d, 'day');
            });
            if (match) {
                count = match.status;
            }
            return count;
        }

        function formatWeekday(weekDay) {
            if (weekStart === 1) {
                if (weekDay === 0) {
                    return 6;
                } else {
                    return weekDay - 1;
                }
            }
            return weekDay;
        }

        var daysofChart = chart.data().map(function (day) {
            return day.classDate;
        });


        dayRects.filter(function (d) {
            return daysofChart.indexOf(d.classDate) > -1;
        }).attr('fill', function (d, i) {

            return color(chart.data()[i].status);
        });
    }

    return chart;
}


// polyfill for Array.find() method
/* jshint ignore:start */
if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        if (this === null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}
/* jshint ignore:end */
