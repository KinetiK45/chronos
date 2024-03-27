import './DayView.css';
import './DayOfWeek.css';
import {useEffect, useState} from "react";

function DayOfWeek({
                       calendarId = 1,
                       date = new Date(),
                       holidaysColor = '#237cfd',
                       onDaySelect = function (day, viewMode){},
                       getInfoByDay
                   }) {


    const [events, setEvents] = useState([]);
    const [holidays, setHolidays] = useState([]);

    useEffect(() => {
        const data = getInfoByDay(date, 'week');
        setEvents(data[0]);
        setHolidays(data[1]);
    }, [date, getInfoByDay]);

    function getWeekDayTitle(){
        let weekday = date.toLocaleDateString(undefined, { weekday: 'short' });
        weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
        return `${weekday}, ${date.getDate()}`;
    }

    return (
        <div className={'day-of-week'}>
            <b style={{
                textAlign: "left",
                fontSize: '20px',
            }}>{`${getWeekDayTitle()}`}</b>
            <div className="events-container-week">
                {
                    holidays.map((holiday, index) => (
                        <div
                            key={`event-${index}`}
                            style={{
                                borderRadius: '20px',
                                backgroundColor: holidaysColor,
                                margin: '2px',
                            }}
                        >
                            <b>{`${holiday.localName}`}</b>
                        </div>
                    ))
                }

                {
                    events.map((day_event) => (
                        <div>
                            {`${day_event.title}`}
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default DayOfWeek;
