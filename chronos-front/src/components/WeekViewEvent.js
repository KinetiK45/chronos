import {useEffect, useRef} from "react";
import './WeekViewEvent.css';
import {
    calculateEventH,
    calculateEventLeft,
    getDateMinutes,
    getEventHeightPercent,
    hexToRgba,
} from "../utils/Utils";
import WeekViewEventDataDisplay from "./WeekViewEventDataDisplay";

const TRANSITION_DURATION = '0.5s';

function WeekViewEvent({
                          eventData,
                          currentViewDate,
                          isResizable = true}) {
    const eventDataRef = useRef(null);

    useEffect(() => {
        const height = eventDataRef.current.scrollHeight; //текущая высота элемента
        eventDataRef.current.style.width = `${eventData.widthPercentage}%`;
        const parentHeight = document.querySelector('.hours-container').offsetHeight; //высота родителя

        const topPercent = getEventHeightPercent(0, getDateMinutes(eventData.startAt, currentViewDate)); //отступ сверху

        const heightCalculated = calculateEventH(eventData, currentViewDate);
        const minHeightPercent = Math.max(heightCalculated, 5 / parentHeight * 100);
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
        eventDataRef.current.style.visibility = '';
    }, [currentViewDate, eventData]);

    let timeoutId = null;
    const handleMouseEnter = () => {
        console.log('onmouse enter');
        eventDataRef.current.style.borderLeft = `2px solid ${eventData.color}`;
        timeoutId = setTimeout(() => {
            eventDataRef.current.style.zIndex = 999;
            eventDataRef.current.style.height = eventDataRef.current.style.maxHeight;
            eventDataRef.current.style.width = '98%';
            eventDataRef.current.style.left = '0%';
        }, 500); // Время задержки в миллисекундах (здесь 1000 миллисекунд = 1 секунда)
    }

    return <div>
        <div
            ref={eventDataRef}
            className={`week-event event-${eventData.id}`}
            key={`event-${eventData.id}`}
            onClick={(event) => {
                event.stopPropagation();
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => {
                clearTimeout(timeoutId);
                eventDataRef.current.style.borderLeft = `1px solid ${eventData.color}`;
                eventDataRef.current.style.width = `${eventData.widthPercentage}%`;
                eventDataRef.current.style.left = `${eventData.leftOffsetPercentage}%`;
                eventDataRef.current.style.zIndex = eventData.columnIndex + 1;
                eventDataRef.current.style.height = eventDataRef.current.style.minHeight;
            }}
            style={
                {
                    background: `linear-gradient(135deg, ${
                        hexToRgba(eventData.color || '#a2a2a2', 0.3
                        )}, transparent)`,
                    borderLeft: `1px solid ${eventData.color}`,
                    left: `${eventData.leftOffsetPercentage}%`,
                    transitionDuration: TRANSITION_DURATION,
                    zIndex: eventData.columnIndex + 1,
                    visibility: 'hidden',
                }
            }
        >
            {/*<div*/}
            {/*    className={'week-event-title'}*/}
            {/*>{`${eventData.title}`}</div>*/}
            <WeekViewEventDataDisplay
                eventData={eventData}
                currentViewDate={currentViewDate}
            />
        </div>
    </div>

}

export default WeekViewEvent;
