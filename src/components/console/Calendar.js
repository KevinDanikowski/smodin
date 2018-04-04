import React, { Component } from 'react';

import $ from 'jquery';
import 'moment/min/moment.min.js';

import 'fullcalendar/dist/fullcalendar.css';
import 'fullcalendar/dist/fullcalendar.js';
//See More Example At https://codepen.io/kotazi/pen/KVoXob

class Calendar extends Component {
    render() {
        return <div id="calendar"></div>;
    }
    componentDidMount() {
        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar
            drop: function() {
                // is the "remove after drop" checkbox checked?
                if ($('#drop-remove').is(':checked')) {
                    // if so, remove the element from the "Draggable Events" list
                    $(this).remove();
                }
            }
        })
    }
}
//TODO ADD QUERY TO GET SCHEDULED POSTS, THIS WILL CALL FROM API.SMODIN.ME/GRAPHQL
export default Calendar