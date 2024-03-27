import {useEffect, useState} from "react";
import WeekViewEvent from "./WeekViewEvent";

function WeekDayView({
                         initialDate = new Date(),
                         getInfoByDay
                 }) {

    const [currentViewDate, setCurrentViewDate] = useState(initialDate);
    const [events, setEvents] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const isViewer = true;
    useEffect(() => {
        const data = getInfoByDay(currentViewDate);
        setEvents(fillViewColumns(data[0]));
        setHolidays(data[1]);

    }, [currentViewDate, getInfoByDay]);

    const [eventColumnsSize, setEventColumnsSize] = useState(2);

    // рассчет колонок для ивентов
    function fillViewColumns(events) {
        const columns = [];
        for (let event of events) {
            if (!('id' in event))
                continue;
            let index = undefined;
            const minHMinutes = 33;
            for (let i = 0; i < columns.length; i++) {
                if (columns[i].getHours() > 22 && columns[i].getMinutes() > 30)
                    continue;
                if (columns[i] < event.startAt){
                    if (event.endAt.getTime() - event.startAt.getTime() < minHMinutes * 60 * 1000){
                        columns[i] = new Date(event.startAt.getTime() + minHMinutes * 60 * 1000);
                    }
                    else
                        columns[i] = event.endAt;
                    index = i;
                    break;
                }
            }
            if (index === undefined){
                setEventColumnsSize(Math.min(columns.length + 2, 4));
                index = columns.length;
                if (event.endAt.getTime() - event.startAt.getTime() < minHMinutes * 60 * 1000){
                    columns.push(new Date(event.startAt.getTime() + minHMinutes * 60 * 1000));
                }
                else
                    columns.push(event.endAt);
            }
            event.columnIndex = index;
        }
        // setEventColumnsSize(3);
        return events;
    }

    function refreshEvents(new_events = events) {
        setEvents(
            fillViewColumns(
                [...new_events].sort((a, b) =>
                    a.startAt.getTime() - b.startAt.getTime()
                    || (b.endAt.getTime() - b.startAt.getTime()) - (a.endAt.getTime() - a.startAt.getTime()))
            )
        );
    }

    useEffect(() => {
        const updateLine = () => {
            const timeUpd = new Date();
            const dayView = document.querySelector('.selected-calendar-day');
            const currentTimeLine = document.querySelector('.current-time-line');
            if (dayView && currentTimeLine){
                const top = (timeUpd.getHours() * 60 + timeUpd.getMinutes()) / (23 * 60 + 59) * 100;
                currentTimeLine.style.top = `${top}%`;
            }
            setTimeout(updateLine, 60000);
        }
        updateLine();
    }, []);

    return (
        <div
            className={'selected-calendar-day'}
        >
            <div className={'month-header'}>
                <h1>{`${currentViewDate.toLocaleDateString(undefined,
                    { weekday: 'short', day: 'numeric', month: 'long' })}`}</h1>
            </div>
            {holidays.length > 0 &&
                <div className={'holidays'}>
                    <h3>Holidays:</h3>
                    {holidays.map((el) =>(
                        <div key={el.localName}>
                            {el.localName}
                        </div>
                    ))}
                </div>
            }

            <div
                className="hours-container"
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
                        {`${new Date(currentViewDate.getFullYear(), currentViewDate.getMonth(), currentViewDate.getDate(), hour / 2, hour % 2 ? 30 : 0)
                            .toLocaleTimeString(undefined, {hour: "numeric", minute: "numeric"})}`}
                    </div>
                ))}
                <div
                    className={'events-container'}
                    style={{
                        cursor: isViewer ? 'default' : 'copy',
                    }}
                >
                    { events &&
                        events.map((day_event) => (
                            <WeekViewEvent
                                key={`event-${day_event.id}-full`}
                                eventData={day_event}
                                currentViewDate={currentViewDate}
                                countColumns={eventColumnsSize}
                                onTimeChange={refreshEvents}
                                isResizable={!isViewer}
                            />
                        ))
                    }
                </div>
                <div
                    className={'current-time-line'}
                    style={{
                        display: currentViewDate.getDate() === new Date().getDate() ? '' : 'none',
                        pointerEvents: 'none',
                    }}
                ></div>
            </div>
        </div>
    );
}

export default WeekDayView;
