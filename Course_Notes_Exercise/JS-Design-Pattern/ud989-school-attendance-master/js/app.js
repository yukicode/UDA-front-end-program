/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    'use strict';
    var names = ["Slappy the Frog", "Lilly the Lizard", "Paulrus the Walrus", "Gregory the Goat", "Adam the Anaconda"];
    var days = 12;
    
    function getRandom() {
        return (Math.random() >= 0.5);
    }
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        var temp = document.getElementById("template");
        var name = temp.content.querySelector(".name-col");
        var attend = temp.content.querySelectorAll(".attend-col");
        var attendance = {};
        var clone;
        var tbody =document.getElementsByTagName("tbody")[0];
        names.forEach(function(n) {
            attendance[n] = [];
            name.innerHTML = n;
            for (var i = 0; i <= 11; i++) {
                var random = getRandom();
                attendance[n].push(random);
            }
            clone = document.importNode(temp.content, true);
            tbody.appendChild(clone);
        });
        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {
    var attendance = JSON.parse(localStorage.attendance),
        $allMissed = $('tbody .missed-col'),
        $allCheckboxes = $('tbody input');

    // Count a student's missed days
    function countMissing() {
        $allMissed.each(function() {
            var studentRow = $(this).parent('tr'),
                dayChecks = $(studentRow).children('td').children('input'),
                numMissed = 0;

            dayChecks.each(function() {
                if (!$(this).prop('checked')) {
                    numMissed++;
                }
            });

            $(this).text(numMissed);
        });
    }

    // Check boxes, based on attendace records
    $.each(attendance, function(name, days) {
        var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
            dayChecks = $(studentRow).children('.attend-col').children('input');

        dayChecks.each(function(i) {
            $(this).prop('checked', days[i]);
        });
    });

    // When a checkbox is clicked, update localStorage
    $allCheckboxes.on('click', function() {
        var studentRows = $('tbody .student'),
            newAttendance = {};

        studentRows.each(function() {
            var name = $(this).children('.name-col').text(),
                $allCheckboxes = $(this).children('td').children('input');

            newAttendance[name] = [];

            $allCheckboxes.each(function() {
                newAttendance[name].push($(this).prop('checked'));
            });
        });

        countMissing();
        localStorage.attendance = JSON.stringify(newAttendance);
    });

    countMissing();
}());
