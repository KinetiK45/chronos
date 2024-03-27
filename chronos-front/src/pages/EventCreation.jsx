import Requests from "../API/requests";
import Navigation from "../components/Navigation";
import {useParams} from "react-router-dom";
import {useState} from "react";
import './EventCreation.css';
import {toLocalDateInputField} from "../utils/Utils";

function EventCreation() {
    const {calendarId} = useParams();

    // eslint-disable-next-line no-restricted-globals
    const searchParams = new URLSearchParams(location.search);

    const [startAt, setStartAt] = useState(searchParams.has('startAt') ? new Date(searchParams.get('startAt')) : new Date());
    const [endAt, setEndAt] = useState(searchParams.has('endAt') ? new Date(searchParams.get('endAt')) : new Date());
    const [category, setCategory] = useState('arrangement');

    // useEffect(() => {
    //     if (allDay === true){
    //         let date = new Date(searchParams.get('startAt'));
    //         date.setHours(0, 0, 0, 0);
    //         setStartAt(date);
    //         date.setHours(23, 59, 59, 999);
    //         setEndAt(date);
    //     }
    // }, [allDay, searchParams]);

    function submitFrom() {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const notification = document.getElementById('notification').checked;

        if (!title) {
            alert('Пожалуйста, заполните название');
            return;
        }

        if (startAt.getTime() >= endAt.getTime()) {
            alert(`Выберите корректные дату и время.`);
            return;
        }
        const data = {
            calendar_id: calendarId,
            title: title,
            description: description,
            notification: notification,
            startAt: document.getElementById('startAt').value,
            endAt: document.getElementById('endAt').value,
            category: category
        }
        // alert(JSON.stringify(data));
        Requests.createEvent(localStorage.getItem('token'), data).then((resp) => {
            if (resp.state === true){
                window.location = `/calendars/${calendarId}?view=day&date=${data.startAt}`;
            }
        });
    }

    return <div className="main">
        <Navigation/>
        <div className={'main-content'}>
            <div
                className={'center-block'}
                style={{
                    minWidth: 'auto'
                }}
            >
                <div id={'event-creation'}>
                    <input
                        id={'title'}
                        type={'text'}
                        placeholder={'Title'}
                    />
                    <textarea
                        id="description"
                        placeholder="Description"
                        maxLength={255}
                    />
                    <input
                        id={'startAt'}
                        name={'startAt'}
                        type={'datetime-local'}
                        defaultValue={toLocalDateInputField(startAt)}
                        onChange={() => setStartAt(new Date(document.getElementById('startAt').value))}
                    />
                    <input
                        id={'endAt'}
                        name={'endAt'}
                        type={'datetime-local'}
                        defaultValue={toLocalDateInputField(endAt)}
                        onChange={() => setEndAt(new Date(document.getElementById('endAt').value))}
                    />
                    <select
                        id="categorySelector"
                        defaultValue={category || 'arrangement'}
                        onChange={(event) => setCategory(event.target.value)}
                    >
                        <option value="arrangement">Arrangement</option>
                        <option value="reminder">Reminder</option>
                        <option value="task">Task</option>
                    </select>
                    {category !== 'reminder' &&
                        <div>
                            <input
                                type="checkbox"
                                id="notification"
                                name="notification"
                            />
                            <label htmlFor="notification">Notification</label>
                        </div>
                    }
                    {category === 'arrangement' &&
                        <div>
                            <input
                                id={'place'}
                                type={'text'}
                                placeholder={'Place'}
                            />
                        </div>
                    }
                    {category === 'task' &&
                        <div>
                            <input
                                type="checkbox"
                                id="complete"
                                name="complete"
                            />
                            <label htmlFor="notification">Complete</label>
                        </div>
                    }
                    <button onClick={submitFrom}>Submit</button>
                </div>
            </div>
        </div>
    </div>
}

export default EventCreation;
