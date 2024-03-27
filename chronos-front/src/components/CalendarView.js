import {useEffect, useState} from "react";
import MonthView from "./MonthView";
import DayView from "./DayView";
import WeekView from "./WeekView";
import {fillEventsFullData, getStartEndMonthByDate} from "../utils/Utils";
import Requests from "../API/requests";
import './CalendarView.css';

function CalendarView({
                          calendarData,
                      }) {
    const [viewMode, setViewMode] = useState('month');
    const [selectedDay, setSelectedDay] = useState(new Date());

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('date')){
            let temp = new Date(searchParams.get('date'));
            if (temp.toString() !== 'Invalid Date'){
                temp.setHours(0,0,0,0);
                setSelectedDay(temp);
            }
        }

        if (searchParams.has('view') && ['month', 'week', 'day'].includes(searchParams.get('view'))){
            setViewMode(searchParams.get('view'));
        }
    }, []);

    const handleSelectChange = (event) => {
        setViewMode(event.target.value);
    };

    function selectViewMode(day, viewMode = 'day'){
        if (day !== selectedDay){
            setSelectedDay(day);
        }
        setViewMode(viewMode);
    }

    return (
        <div
            className={'calendar-view'}
        >
            <div className={'calendar-info'}>
                <div
                    style={{
                        height: 0,
                        width: '100%',
                        position: 'relative'
                    }}
                >
                    {
                        calendarData.type !== 'default' &&
                        <a
                            style={{
                                position: 'absolute',
                                right: 0,
                            }}
                            href={`${window.location.origin}/calendars/${calendarData.id}/settings`}><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 32 32">
                            <path d="M28.323,18.504c-0.521-0.88-1.091-1.72-1.698-2.504c0.607-0.784,1.177-1.624,1.698-2.504	c0.139-0.234,0.168-0.509,0.103-0.761c-0.392-2.292-1.579-4.358-3.353-5.838c-0.007-0.008-0.015-0.016-0.023-0.024	c-0.189-0.188-0.458-0.277-0.712-0.29c-1.032,0.008-2.045,0.08-3.022,0.212c-0.381-0.924-0.826-1.835-1.327-2.719	c-0.116-0.204-0.299-0.36-0.518-0.443c-2.237-0.842-4.702-0.842-6.939,0c-0.219,0.083-0.402,0.239-0.518,0.443	c-0.5,0.883-0.945,1.794-1.327,2.719c-0.977-0.132-1.99-0.204-3.022-0.212c-0.003,0-0.005,0-0.008,0	c-0.262,0-0.514,0.108-0.701,0.292c-1.777,1.472-2.97,3.53-3.372,5.815c-0.082,0.263-0.053,0.557,0.095,0.807	c0.521,0.88,1.091,1.72,1.698,2.504c-0.607,0.784-1.177,1.624-1.698,2.504c-0.139,0.234-0.168,0.509-0.103,0.761	c0.392,2.292,1.578,4.356,3.351,5.836c0.008,0.009,0.017,0.018,0.025,0.026c0.189,0.188,0.444,0.308,0.713,0.29	c1.033-0.009,2.046-0.08,3.021-0.212c0.381,0.924,0.826,1.835,1.327,2.719c0.116,0.204,0.299,0.36,0.518,0.443	c1.119,0.421,2.294,0.631,3.47,0.631s2.351-0.21,3.47-0.631c0.219-0.083,0.402-0.239,0.518-0.443c0.5-0.883,0.945-1.795,1.327-2.719	c0.976,0.132,1.988,0.203,3.021,0.212c0.29,0.003,0.521-0.106,0.711-0.293c1.776-1.471,2.969-3.528,3.371-5.813	C28.499,19.047,28.471,18.754,28.323,18.504z M20,16c0,2.209-1.791,4-4,4s-4-1.791-4-4c0-2.209,1.791-4,4-4S20,13.791,20,16z"></path>
                        </svg></a>
                    }
                </div>
                <h1>{calendarData.title}</h1>
                <h3>{calendarData.description}</h3>
            </div>
            <div
                className={'view-selector'}
            >
                <select
                    id="timeInterval"
                    value={viewMode}
                    onChange={handleSelectChange}>
                    <option value="month">Місяць</option>
                    <option value="week">Тиждень</option>
                    <option value="day">День</option>
                </select>
            </div>
            {viewMode === 'month' &&
                <MonthView
                    calendarData={calendarData}
                    selectedDate={selectedDay}
                    onDaySelect={selectViewMode}
                />
            }
            {
                viewMode === 'week' &&
                <WeekView
                    calendarData={calendarData}
                    initialDate={selectedDay}
                    onDaySelect={selectViewMode}
                />
            }
            {
                viewMode === 'day' &&
                <DayView
                    calendarData={calendarData}
                    initialDate={selectedDay}
                    onDaySelect={selectViewMode}
                />
            }
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: 5
                }}
            ><a
                href={`/calendars/${calendarData.id}/createEvent?startAt=${selectedDay.toISOString()}&endAt=${selectedDay.toISOString()}`}>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 32 32">
                    <path d="M16,3C8.832,3,3,8.832,3,16s5.832,13,13,13s13-5.832,13-13S23.168,3,16,3z M22.989,16.207c0,1.034-0.741,1.911-1.755,2.11	c-0.419,0.082-0.84,0.154-1.262,0.217c-0.751,0.111-1.328,0.688-1.438,1.439c-0.062,0.422-0.134,0.843-0.217,1.262	c-0.199,1.014-1.077,1.755-2.111,1.755h-0.413c-1.034,0-1.911-0.741-2.111-1.755c-0.082-0.419-0.154-0.84-0.217-1.262	c-0.111-0.751-0.688-1.328-1.438-1.439c-0.422-0.062-0.843-0.134-1.262-0.217c-1.014-0.199-1.755-1.077-1.755-2.174v-0.35	c0-1.034,0.741-1.911,1.755-2.11c0.419-0.082,0.84-0.154,1.262-0.217c0.751-0.111,1.328-0.688,1.438-1.439	c0.062-0.422,0.134-0.843,0.217-1.262c0.199-1.014,1.077-1.755,2.111-1.755h0.413c1.034,0,1.911,0.741,2.111,1.755	c0.082,0.419,0.154,0.84,0.217,1.262c0.111,0.751,0.688,1.328,1.438,1.439c0.422,0.062,0.843,0.134,1.262,0.217	c1.014,0.199,1.755,1.077,1.755,2.174V16.207z"></path>
                </svg>
                Створити подію
            </a></div>

        </div>
    );
}

export default CalendarView;
