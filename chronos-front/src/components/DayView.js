import './DayView.css';
import {useEffect, useState} from "react";
import EventEditor from "./EventEditor";
import DayViewEvent from "./DayViewEvent";
import Requests from "../API/requests";
import {fillEventsFullData, filterEventsToTargetDate, toLocalDateInputField} from "../utils/Utils";
import ViewTitle from "./ViewTitle";

function DayView({ calendarData = {id: 1},
                     initialDate = new Date(),
                     onDaySelect
                 }) {

    const [currentViewDateAnchor, setCurrentViewDateAnchor] = useState(initialDate);
    const [events, setEvents] = useState([]);
    const isViewer = 'calendar_user' in calendarData && calendarData.calendar_user.role === 'inspector';

    //получение ивентов
    useEffect(() => {
        const fetchData = async () => {
            const startDay = new Date(currentViewDateAnchor.setHours(0,0,0,0));
            const events_resp = await Requests.allEvents(
                localStorage.getItem('token'),
                calendarData.id,
                new Date(startDay.getTime() - 48 * 60 * 60 * 1000),
                new Date(startDay.getTime() + 48 * 60 * 60 * 1000)
            );

            if (events_resp?.data?.events) {
                refreshEvents(
                    filterEventsToTargetDate(currentViewDateAnchor,
                        fillEventsFullData(events_resp.data.events, calendarData)
                    )
                );
            }
        };
        if (calendarData !== null)
            fetchData();
        onDaySelect(currentViewDateAnchor);
    }, [calendarData, currentViewDateAnchor]);

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


    //создание ивентов
    function calculateEventCreate(event) {
        if (isViewer){
            return;
        }
        // Получаем координаты клика относительно верхнего края блока hours-container
        const offsetY = event.clientY - event.currentTarget.getBoundingClientRect().top;
        const offsetX = event.clientX - event.currentTarget.getBoundingClientRect().left;

        const column = Math.floor((offsetX / event.currentTarget.clientWidth) * eventColumnsSize);

        // Рассчитываем процентное расстояние
        const hours = (offsetY / event.currentTarget.clientHeight) * 24;
        let startAt = new Date(currentViewDateAnchor);
        startAt.setHours(Math.floor(hours), Math.round(hours % 1 * 6) * 10, 0, 0);
        const endAt = new Date(startAt.getTime() + 1000 * 60 * 30);

        const newEvent = {
            calendar_id: calendarData.id,
            title: 'Нова подія',
            description: '',
            category: 'task',
            startAt: startAt,
            endAt: endAt,
            color: calendarData?.calendar_user?.custom_color
                ? calendarData.calendar_user.custom_color
                : calendarData.color
        };

        const creationData = {...newEvent};
        creationData.startAt = toLocalDateInputField(creationData.startAt);
        creationData.endAt = toLocalDateInputField(creationData.endAt);

        Requests.createEvent(localStorage.getItem('token'), creationData)
            .then((resp) => {
                if (resp.state !== true){
                    refreshEvents(events.filter((ev) => 'id' in ev));
                    alert(`Creation fail: ${resp.message}`);
                }
                else {
                    newEvent.id = resp.data;
                    refreshEvents([...events.filter((ev) => 'id' in ev), newEvent]);
                }
            });

        newEvent.columnIndex = column;
        refreshEvents([...events, newEvent]);
    }


    const [currentEditingData, setCurrentEditingData] = useState(null);

    const [editor_coords, setEditor_coords] = useState({
        top: 0,
        left: 0
    });

    function formatTitle(date) {
        const options = { weekday: 'short', day: 'numeric', month: 'long' };
        const dateString = date.toLocaleDateString(undefined, options);
        const firstTwoLetters = dateString.slice(0, 2).toUpperCase();
        const dayAndMonth = dateString.slice(2);
        return `${firstTwoLetters}${dayAndMonth}`;
    }

    return (
        <div
            className={'selected-calendar-day'}
        >
            <ViewTitle
                titleStr={`${formatTitle(currentViewDateAnchor)}`}
                onPrev={() => {
                    setEvents([]);
                    setCurrentViewDateAnchor(new Date(currentViewDateAnchor.getTime() - 24 * 60 * 60 * 1000));
                }}
                onNext={() => {
                    setEvents([]);
                    setCurrentViewDateAnchor(new Date(currentViewDateAnchor.getTime() + 24 * 60 * 60 * 1000));
                }}
            />
            {currentEditingData !== null &&
                <EventEditor
                    eventData={currentEditingData}
                    coords={editor_coords}
                    onEdited={(dataUpdated) => {
                        setEvents(prevEvents => {
                            return prevEvents.map(event => {
                                if (event.id === dataUpdated.id) {
                                    return dataUpdated;
                                }
                                return event;
                            });
                        });
                    }}
                    onDelete={(event_id) => {
                        Requests.deleteEvent(localStorage.getItem('token'), event_id).then((resp) => {
                            if (resp.state === true){
                                setCurrentEditingData(null);
                                refreshEvents(events.filter((ev) => ev.id !== event_id));
                            }
                            else {
                                alert(`Error deleting event: ${resp.message}`);
                            }
                        })
                    }}
                    onHide={() => {
                        setCurrentEditingData(null);
                    }}
                />
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
                        {`${new Date(currentViewDateAnchor.getFullYear(), currentViewDateAnchor.getMonth(), currentViewDateAnchor.getDate(), hour / 2, hour % 2 ? 30 : 0)
                            .toLocaleTimeString(undefined, {hour: "numeric", minute: "numeric"})}`}
                    </div>
                ))}
                <div
                    className={'events-container'}
                    onDoubleClick={calculateEventCreate}
                    style={{
                        cursor: isViewer ? 'default' : 'copy',
                    }}
                >
                    { events &&
                        events.map((day_event) => (
                            <DayViewEvent
                                key={`event-${day_event.id}-full`}
                                eventData={day_event}
                                currentViewDate={currentViewDateAnchor}
                                countColumns={eventColumnsSize}
                                onTimeChange={refreshEvents}
                                canChange={!isViewer}
                                onEditorCalled={(event) => {
                                    setCurrentEditingData(day_event);
                                    setEditor_coords({
                                        'top': window.scrollY + event.clientY,
                                        'left': window.scrollX + event.clientX
                                    });
                                }}
                            />
                        ))
                    }
                </div>
                <div
                    className={'current-time-line'}
                    style={{
                        display: currentViewDateAnchor.getDate() === new Date().getDate() ? '' : 'none',
                        pointerEvents: 'none',
                    }}
                ></div>
            </div>
        </div>
    );
}

export default DayView;
