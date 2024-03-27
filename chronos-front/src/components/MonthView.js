import './MonthView.css';
import CalendarCell from "./CalendarCell";
import {useEffect, useState} from "react";
import ViewTitle from "./ViewTitle";
import {
    toMonthTitleFormat,
    getWeekDates,
    getStartEndWeekByDate,
    fillEventsFullData,
    getStartEndMonthByDate, filterEventsToTargetDate, getDaysInMonth
} from "../utils/Utils";
import Requests from "../API/requests";
function MonthView({
                       calendarData,
                       selectedDate = new Date(),
                       onDaySelect = function (day, viewMode){}
}) {
    const [monthDayViewAnchor, setMonthDayViewAnchor] = useState(selectedDate);

    const [monthEvents, setMonthEvents] = useState([]);
    //заполнение events
    useEffect(() => {
        const fetchData = async () => {
            const startEndCurrentMonth = getStartEndMonthByDate(monthDayViewAnchor);
            const events_resp = await Requests.allEvents(
                localStorage.getItem('token'),
                calendarData.id,
                startEndCurrentMonth[0],
                startEndCurrentMonth[1]
            );
            if (events_resp?.data?.events) {
                setMonthEvents(fillEventsFullData(events_resp.data.events, calendarData));
            }
        };
        if (calendarData !== null)
            fetchData();
    }, [calendarData, monthDayViewAnchor]);

    return (
        <div
            className={'month-calendar'}
        >
            <ViewTitle
                titleStr={toMonthTitleFormat(monthDayViewAnchor)}
                onPrev={() => {
                    let newDate = new Date(monthDayViewAnchor);
                    newDate.setMonth(monthDayViewAnchor.getMonth() - 1);
                    setMonthDayViewAnchor(newDate);
                }}
                onNext={() => {
                    let newDate = new Date(monthDayViewAnchor);
                    newDate.setMonth(monthDayViewAnchor.getMonth() + 1);
                    setMonthDayViewAnchor(newDate);
                }}
            />
            <div className={'day-names'}>
                {getWeekDates(monthDayViewAnchor).map((date, index) => (
                    <div key={`day-name-${index}`} className={'day-name'}>
                        {`${date.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase()}`}
                    </div>
                ))}
            </div>
            <div className={'days'}>
                {monthDayViewAnchor && getDaysInMonth(monthDayViewAnchor)
                    .map((date) => (
                            <div
                                onClick={() => onDaySelect(date, 'day')}
                                key={`calendar-day-${date.toLocaleDateString()}`}
                                style={
                                    {
                                        gridColumn: date.getDay() === 0 ? 7 : date.getDay(),
                                        gridColumnEnd: 'auto',
                                    }
                                }
                            >
                                {
                                    <CalendarCell
                                        date={date}
                                        calendarId={calendarData.id}
                                        events={filterEventsToTargetDate(date, monthEvents)}
                                    />
                                }
                            </div>
                        )
                    )}

            </div>
        </div>
    );
}

export default MonthView;
