import './WeekView.css';
import {useEffect, useState} from "react";
import WeekViewEvent from "./WeekViewEvent";
import {
    fillEventsFullData,
    filterEventsToTargetDate,
    getStartEndWeekByDate,
    getWeekDates,
    getWeekNumber,
    toShortDayTitle
} from "../utils/Utils";
import ViewTitle from "./ViewTitle";
import Requests from "../API/requests";

function getWeekTitle(startWeek = new Date(), endWeek = new Date()) {
    let month, year;
    let startMonth = startWeek.toLocaleDateString(undefined, { month: 'long' });
    startMonth = startMonth.charAt(0).toUpperCase() + startMonth.slice(1);
    let endMonth = endWeek.toLocaleDateString(undefined, { month: 'long' });

    if (startWeek.getMonth() === endWeek.getMonth())
        month = startMonth;
    else
        month = `${startMonth}-${endMonth}`;


    if (startWeek.getFullYear() === endWeek.getFullYear())
        year = startWeek.getFullYear();
    else
        year = `${startWeek.getFullYear()}-${endWeek.getFullYear()}`
    return `${month} ${year}`;
}

function WeekView({
                      calendarData = {id: 1},
                      initialDate = new Date(),
                      onDaySelect
                 }) {
    const [weekDayViewAnchor, setWeekDayViewAnchor] = useState(new Date(initialDate));
    const [weekEvents, setWeekEvents] = useState([]);

    //заполнение events
    useEffect(() => {
        const fetchData = async () => {
            const startEndCurrentWeek = getStartEndWeekByDate(weekDayViewAnchor);
            const events_resp = await Requests.allEvents(
                localStorage.getItem('token'),
                calendarData.id,
                startEndCurrentWeek[0],
                startEndCurrentWeek[1]
            );
            if (events_resp?.data?.events) {
                setWeekEvents(fillEventsFullData(events_resp.data.events, calendarData));
            }
        };
        if (calendarData !== null)
            fetchData();
    }, [calendarData, weekDayViewAnchor]);

    function fillViewColumns(events) {
        //widthPercentage
        //leftOffsetPercentage
        events.forEach((one_event) => {
            one_event.widthPercentage = 100;
            one_event.leftOffsetPercentage = 0;
        });

        const columns = [];

        for (let event of events) {
            let index = undefined;
            for (let i = 0; i < columns.length; i++) {
                if (columns[i] < event.startAt){
                    columns[i] = event.endAt;
                    index = i;
                    break;
                }
            }
            if (index === undefined){
                index = columns.length;
                columns.push(event.endAt);
            }
            event.columnIndex = index;
        }
        for (let event of events) {
            event.leftOffsetPercentage = 100 / columns.length * event.columnIndex;
            event.widthPercentage = 100 - event.leftOffsetPercentage;
        }
        return events;
    }

    return (
        <div className={'month-calendar'}>
            <ViewTitle
                titleStr={getWeekTitle(getWeekDates(weekDayViewAnchor)[0], getWeekDates(weekDayViewAnchor)[6])}
                onPrev={() => {
                    setWeekDayViewAnchor(new Date(weekDayViewAnchor.getTime() - 7 * 24 * 60 * 60 * 1000));
                }}
                onNext={() => {
                    setWeekDayViewAnchor(new Date(weekDayViewAnchor.getTime() + 7 * 24 * 60 * 60 * 1000));
                }}
            />
            <div className={'week-date-names'}>
                <div>{`№${getWeekNumber(weekDayViewAnchor)}`}</div>
                {getWeekDates(weekDayViewAnchor).map((week_day, index) => (
                    <div
                        key={`week-date-name-${index}`}
                        onClick={() => {onDaySelect(week_day)}}
                        style={{
                            cursor: 'pointer',
                        }}
                    >
                        {`${toShortDayTitle(week_day)}`}
                    </div>
                ))}
            </div>
            <div
                className="hours-container"
                style={{
                    width: '1100px'
                }}
            >
                {[...Array(48).keys()].map((hour, index) => (
                    <div
                        key={`hour-index-${index}`}
                        className="hour-label"
                        style={{
                            left: '0px',
                            width: '5%',
                            textAlign: 'center',
                            WebkitUserSelect: 'none',
                            MozUserSelect: 'none',
                            msUserSelect: 'none',
                            userSelect: 'none',
                        }}
                    >
                        {`${new Date(0, 0, 0, hour / 2, hour % 2 ? 30 : 0)
                            .toLocaleTimeString(undefined, {hour: "numeric", minute: "numeric"})}`}
                    </div>
                ))}
                <div
                    className={'week-events-container'}
                >
                    {getWeekDates(weekDayViewAnchor).map((week_day, index) => (
                        <div
                            style={{
                                position: 'absolute',
                                // backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                borderLeft: '0.5px solid var(--day-view-hourline-color)',
                                width: `${100/7}%`,
                                height: '100%',
                                left: `${100/7 * index}%`,
                                overflow: 'hidden',
                            }}
                        >
                            {
                                weekEvents &&
                                fillViewColumns(filterEventsToTargetDate(week_day, weekEvents))
                                    .map((week_day_event) => (
                                    <WeekViewEvent
                                        eventData={week_day_event}
                                        currentViewDate={week_day}
                                        isResizable={false}
                                    />
                                ))
                            }
                        </div>
                    ))}
                </div>
                {/*<div*/}
                {/*    className={'current-time-line'}*/}
                {/*    style={{*/}
                {/*        display: date.getDate() === new Date().getDate() ? '' : 'none',*/}
                {/*        pointerEvents: 'none',*/}
                {/*    }}*/}
                {/*></div>*/}
            </div>
        </div>
    );
}

export default WeekView;
