import './DayViewEvent.css';
import {useEffect, useRef, useState} from "react";
import DayViewEventDataDisplay from "./DayViewEventDataDisplay";
import Requests from "../API/requests";
import {
    calculateEventH,
    calculateEventLeft, cropDateToCurrent,
    getDateMinutes,
    getEventHeightPercent,
    hexToRgba,
    toLocalDateInputField
} from "../utils/Utils";

const TRANSITION_DURATION = '0.3s';

function DayViewEvent({
                          eventData,
                          currentViewDate,
                          countColumns,
                          onTimeChange,
                          canChange = true,
                          onEditorCalled,
}) {
    const eventDataRef = useRef(null);
    const eventLineRef = useRef(null);
    const [timeUpdate, setTimeUpdate] = useState(false);

    useEffect(() => {
        const height = eventDataRef.current.scrollHeight; //текущая высота элемента
        const parentHeight = document.querySelector('.hours-container').offsetHeight; //высота родителя

        const topPercent = getEventHeightPercent(0, getDateMinutes(eventData.startAt, currentViewDate)); //отступ сверху

        const heightCalculated = calculateEventH(eventData, currentViewDate);
        const minHeightPercent = Math.max(heightCalculated, 28 / parentHeight * 100);
        eventDataRef.current.style.minHeight = `${minHeightPercent}%`;

        const maxHeightPercent = Math.max(heightCalculated, height / parentHeight * 100);
        eventDataRef.current.style.maxHeight = `${maxHeightPercent}%`;

        if (maxHeightPercent + topPercent >= 100){
            eventDataRef.current.style.bottom = 0;
            eventDataRef.current.style.top = '';
            eventDataRef.current.style.height = `${100 - topPercent}%`;
        }
        else {
            eventDataRef.current.style.top = `${topPercent}%`;
            eventDataRef.current.style.bottom = '';
            eventDataRef.current.style.height = `${calculateEventH(eventData, currentViewDate)}%`;
        }

        // console.log(`effect h:${height}%`);
        if (timeUpdate)
            setTimeUpdate(false);
    }, [currentViewDate, eventData, timeUpdate]);


    let initialY = 0;
    let initialHeight = 0;
    let isEndChange = true;
    let initialStartTime = eventData.startAt;
    let initialEndTime = eventData.endAt;

    function handleResizeStart(event) {
        if (!canChange)
            return;
        const mouseY = event.clientY;
        const rect = event.target.getBoundingClientRect();
        const elementTop = rect.top;
        const elementBottom = rect.bottom;

        isEndChange = mouseY >= (elementTop + elementBottom) / 2;

        eventDataRef.current.style.transitionDuration = '';
        eventDataRef.current.style.bottom = '';
        initialY = event.clientY;
        initialHeight = event.target.clientHeight;
        initialStartTime = eventData.startAt;
        initialEndTime = eventData.endAt;
        document.addEventListener('mousemove', handleResizeMove);
        document.addEventListener('mouseup', handleResizeEnd);
        eventDataRef.current.style.zIndex = 3;
        eventLineRef.current.style.zIndex = 4;
        // console.log(`resize start y:${initialY}, h:${initialHeight}`);
    }

    function handleResizeMove(event) {
        const deltaY = event.clientY - initialY;
        const parentHeight = document.querySelector('.hours-container').offsetHeight;

        const sizeCoefficient = isEndChange ? 1 : -1;

        const newHeightPx = initialHeight + deltaY * sizeCoefficient;

        if (newHeightPx < 0){
            if (isEndChange){
                eventData.endAt = initialStartTime;
                initialEndTime = initialStartTime;
            }
            else {
                eventData.startAt = initialEndTime;
                initialStartTime = initialEndTime;
            }
            isEndChange = !isEndChange;
            initialY = event.clientY;
            initialHeight = 0;
            return;
        }

        const day_minutes = 24 * 60;
        const heightMinutes = day_minutes * newHeightPx / parentHeight;

        const targetDateMinutes = getDateMinutes(isEndChange ? eventData.startAt : eventData.endAt, currentViewDate) + heightMinutes * sizeCoefficient;

        let newDate = new Date(currentViewDate);
        newDate.setHours(targetDateMinutes / 60);
        newDate.setMinutes(targetDateMinutes % 60);

        newDate = cropDateToCurrent(newDate, currentViewDate);

        if (isEndChange){
            eventData.endAt = newDate;
        }
        else{
            eventData.startAt = newDate;
        }
        setTimeUpdate(true);
    }

    function handleResizeEnd() {
        eventDataRef.current.style.transitionDuration = TRANSITION_DURATION;
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
        eventDataRef.current.style.zIndex = '';
        eventLineRef.current.style.zIndex = '';
        const updatedEventData = {...eventData};
        updatedEventData.startAt = toLocalDateInputField(updatedEventData.startAt);
        updatedEventData.endAt = toLocalDateInputField(updatedEventData.endAt);
        Requests.editEvent(localStorage.getItem('token'), updatedEventData).then((resp) => {
            if (resp.state !== true)
                alert('Щось пішло не так');
        });
        onTimeChange();
        // console.log(`resize end`);
    }
    return <div
        onDoubleClick={(event) => {event.stopPropagation();}}
    >
        <div
            key={`event-${eventData.id}-time-line`}
            ref={eventLineRef}
            className={'day-event-timeline'}
            onMouseDown={handleResizeStart}
            // onMouseMove={handleResizeMove}
            // onMouseUp={handleResizeEnd}
            style={
                {
                    backgroundColor: `${hexToRgba(eventData.color || '#FFFFFF')}`,
                    height: `${calculateEventH(eventData, currentViewDate)}%`,
                    top: `${getEventHeightPercent(0, getDateMinutes(eventData.startAt, currentViewDate))}%`,
                    left: `${calculateEventLeft(eventData.columnIndex, countColumns)}%`,
                    cursor: canChange ? 'ns-resize' : 'default',
                }
            }/>

        <div
            ref={eventDataRef}
            className={`event event-${eventData.id}`}
            key={`event-${eventData.id}`}
            onClick={(event) => {
                event.stopPropagation();
            }}
            onMouseEnter={() => {
                eventDataRef.current.style.zIndex = 2;
                eventLineRef.current.style.zIndex = 3;
                eventDataRef.current.style.height = eventDataRef.current.style.maxHeight;
            }}
            onMouseLeave={() => {
                eventDataRef.current.style.zIndex = '';
                eventLineRef.current.style.zIndex = '';
                eventDataRef.current.style.height = eventDataRef.current.style.minHeight;
            }}
            style={
                {
                    background: `linear-gradient(135deg, ${
                        hexToRgba(eventData.color || '#a2a2a2', 0.3
                        )}, transparent)`,
                    width: `${100 / countColumns}%`,
                    left: `${calculateEventLeft(eventData.columnIndex, countColumns)}%`,
                    transitionDuration: TRANSITION_DURATION,
                }
            }
        >
            <DayViewEventDataDisplay
                currentViewDate={currentViewDate}
                eventData={eventData}
                onEditButtonClicked={onEditorCalled}
                canChange={canChange}
            />
        </div>
    </div>

}

export default DayViewEvent;
