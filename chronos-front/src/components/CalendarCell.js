import './CalendarCell.css';
import {useEffect} from "react";
import {hexToRgba} from "../utils/Utils";

function CalendarCell({
                          calendarId = 1,
                          date = new Date(),
                          events = [],
                          holidays = []
                      }) {

    useEffect(() => {
        const current_cell = document
            .querySelector(`.calendar-${calendarId}-cell-${date.getDate()}`);
        if (current_cell) {
            if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
                current_cell.classList.add('current-day');
            }
        }
    }, [calendarId, date]);
    const classNames = [
        'calendar-cell',
        `calendar-${calendarId}-cell-${date.getDate()}`
    ];

    function getUniqueCreatorColors(events) {
        const uniqueValues = {};

        events.forEach(event => {
            const { creator_id, color } = event;

            if (uniqueValues[creator_id + color]) {
                uniqueValues[creator_id + color].count++;
            } else {
                uniqueValues[creator_id + color] = { creator_id, color, count: 1 };
            }
        });

        return Object.values(uniqueValues);
    }

    const colors = [
        { creator_id: 1, color: '#ff0000', count: 3 },
        { creator_id: 2, color: '#00ff00', count: 5 },
        { creator_id: 3, color: '#0000ff', count: 2 },
        { creator_id: 4, color: '#ffff00', count: 4 },
        { creator_id: 5, color: '#ff00ff', count: 1 },
        { creator_id: 6, color: '#00ffff', count: 3 },
        { creator_id: 7, color: '#ff9900', count: 2 },
        { creator_id: 8, color: '#9900ff', count: 3 },
        { creator_id: 9, color: '#0099ff', count: 4 },
        { creator_id: 10, color: '#99ff00', count: 2 },
        { creator_id: 11, color: '#ff0099', count: 1 },
        { creator_id: 12, color: '#009900', count: 3 },
        { creator_id: 13, color: '#990000', count: 4 },
        { creator_id: 14, color: '#000099', count: 2 }
    ];

    return (
        <div
            className={classNames.join(' ')}
        >
            <div className={'date-of-month'}>{date.getDate()}</div>
            {getUniqueCreatorColors(events).length > 0 &&
                <div
                    style={{
                        display: 'flex',
                        marginLeft: 5,
                        width: '100%',
                        justifyContent: 'right'
                    }}
                >
                    {/*<div>{JSON.stringify(getUniqueCreatorColors(events))}</div>*/}
                    {getUniqueCreatorColors(events).slice(0, 4)
                        .map((creator_data) => (
                            <div
                                style={{
                                    textAlign: 'center',
                                    backgroundColor: hexToRgba(creator_data.color, 0.3),
                                    fontSize: 10,
                                    width: 13,
                                    height: 13,
                                    padding: 1,
                                    marginRight: 1,
                                    borderLeft: `0.5px solid ${creator_data.color}`,
                                    // borderRadius: '0 50% 50% 0'
                                    borderRadius: '20%'
                                }}
                            >{`${creator_data.count > 99 ? '99+' : creator_data.count}`}</div>
                        ))}
                </div>
            }
            <div className={'holidays-block'}>
                {holidays.map((holiday) => (
                    <div
                        style={{
                            fontSize: '10px',
                            padding: '5px'
                        }}
                    >{`${holiday.localName}`}</div>
                ))}
            </div>
        </div>
    );
}

export default CalendarCell;
