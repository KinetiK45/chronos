import Navigation from "../components/Navigation";
import {useEffect, useState} from "react";
import Requests from "../API/requests";
import '../components/MonthView.css';
import ViewTitle from "../components/ViewTitle";
import {filterEventsToTargetDate, getDaysInMonth, getWeekDates, toMonthTitleFormat} from "../utils/Utils";
import CalendarCell from "../components/CalendarCell";
function HolidaysView() {

    const [monthDayViewAnchor, setMonthDayViewAnchor] = useState(new Date());
    const [holidays, setHolidays] = useState([]);

    useEffect(() => {
        const currentYear = monthDayViewAnchor.getFullYear();

        // Проверяем, был ли уже выполнен запрос для текущего года
        if (!holidays.some(holiday => holiday.date.getFullYear() === currentYear)) {
            const fetchData = async () => {
                const resp = await Requests.getNationalHolidays(currentYear, 'UA');
                console.log(JSON.stringify(resp));

                // Преобразуем и добавляем праздники в состояние
                const newHolidays = resp.map(element => {
                    return {
                        ...element,
                        date: new Date(element.date),
                        color: '#FFFFFF'
                    };
                });

                setHolidays(prevHolidays => [...prevHolidays, ...newHolidays]);
            };

            fetchData();
        }
    }, [monthDayViewAnchor]);


    return (
        <div className="main">
            <Navigation/>
            <div className={'main-content'}>
                <div className={'center-block'}>
                    <h1>Свята</h1>
                    <div
                        className={'month-calendar'}
                        style={{
                            width: 1200,
                        }}
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
                        <div
                            className={'day-names'}
                        >
                            {getWeekDates(monthDayViewAnchor).map((date, index) => (
                                <div key={`day-name-${index}`} className={'day-name'}>
                                    {`${date.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase()}`}
                                </div>
                            ))}
                        </div>
                        <div
                            className={'days'}
                        >
                            {monthDayViewAnchor && getDaysInMonth(monthDayViewAnchor)
                                .map((date) => (
                                        <div
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
                                                    holidays={holidays.filter(
                                                        (holiday) => holiday.date.toLocaleDateString() === date.toLocaleDateString()
                                                    )}
                                                />
                                            }
                                        </div>
                                    )
                                )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HolidaysView;
