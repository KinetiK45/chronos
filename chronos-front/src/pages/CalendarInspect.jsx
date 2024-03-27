import Navigation from "../components/Navigation";
import {useEffect, useState} from "react";
import Requests from "../API/requests";
import {useParams} from "react-router-dom";
import CalendarView from "../components/CalendarView";
import {getStartEndMonthByDate} from "../utils/Utils";

function CalendarInspect() {

    const {calendarId} = useParams();

    const [calendarData, setCalendarData] = useState(null);

    useEffect( () => {
        const fetchData = async () => {
            const resp = await Requests.calendarById(
                localStorage.getItem('token'), calendarId
            );
            setCalendarData(resp.data);
        }
        fetchData();
    }, [calendarId]);

    return (
        <div className="main">
            <Navigation/>
            <div className={'main-content'}>
                <div className={'center-block'}>
                    {calendarData &&
                        <CalendarView
                            calendarData={calendarData}
                        />
                    }
                </div>
            </div>
        </div>
    );
}

export default CalendarInspect;
