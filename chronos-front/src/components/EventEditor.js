import './EventEditor.css'
import {useEffect, useRef, useState} from "react";
import Requests from "../API/requests";
import {toLocalDateInputField} from "../utils/Utils";
function EventEditor({
                         eventData,
                         coords,
                         onEdited,
                         onDelete,
                         onHide
                     }) {
    const elementRef = useRef(null);
    const [category, setCategory] = useState(eventData.category);

    useEffect(() => {
        setCategory(eventData?.category || 'task');
        const handleWindowClick = (event) => {
            if (elementRef.current && !elementRef.current.contains(event.target)) {
                onHide();
            }
        };

        document.addEventListener('click', handleWindowClick);

        return () => {
            document.removeEventListener('click', handleWindowClick);
        };
    }, [eventData, onHide]);

    function onEdit() {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const notification = document.getElementById('notification')
            ? document.getElementById('notification').checked : true;
        const category = document.getElementById('categorySelector').value;
        const place = document.getElementById('place')?.value || '';
        const complete = document.getElementById('complete')
            ? document.getElementById('complete').checked : true;

        if (!title) {
            alert('Пожалуйста, заполните название');
            return;
        }

        const data = {...eventData};
        data.title = title;
        data.description = description;
        data.notification = notification;
        data.category = category;
        data.place = place;
        data.complete = complete;

        const requestData = {...data}

        requestData.startAt = toLocalDateInputField(requestData.startAt);
        requestData.endAt = toLocalDateInputField(requestData.endAt);

        Requests.editEvent(localStorage.getItem('token'), requestData).then((resp) => {
            if (resp.state !== true)
                alert(JSON.stringify(resp));
        });
        onEdited(data);
        onHide();
    }
    function deleteEvent(){
        onDelete(eventData.id);
    }

    return <div
        className={'event-editor'}
        key={`event-${eventData.id}-editor`}
        ref={elementRef}
        onDoubleClick={(event) => {event.stopPropagation();}}
        style={{
            top: coords.top,
            left: coords.left + 15
            // visibility: 'hidden',
        }}
    >
        {/*<div>{JSON.stringify(eventEditor)}</div>*/}
        <input
            id={'title'}
            type={'text'}
            placeholder={'Назва події'}
            defaultValue={eventData?.title}
        />
        <textarea
            id="description"
            placeholder="Опис"
            defaultValue={eventData?.description}
            maxLength={255}
        />
        <select
            id="categorySelector"
            defaultValue={eventData?.category || 'arrangement'}
            onChange={(event) => setCategory(event.target.value)}
        >
            <option value="arrangement">Захід</option>
            <option value="reminder">Нагадування</option>
            <option value="task">Завдання</option>
        </select>

        {category !== 'reminder' &&
            <div>
                <input
                    type="checkbox"
                    id="notification"
                    name="notification"
                    defaultChecked={eventData.notification}
                />
                <label htmlFor="notification">Сповіщення</label>
            </div>
        }
        {category === 'arrangement' &&
            <div>
                <input
                    id={'place'}
                    type={'text'}
                    placeholder={'Місце'}
                    defaultValue={eventData?.place?.trim()}
                />
            </div>
        }
        {category === 'task' &&
            <div>
                <input
                    type="checkbox"
                    id="complete"
                    name="complete"
                    defaultChecked={eventData?.complete}
                />
                <label htmlFor="complete">Статус виконання</label>
            </div>
        }
        <div
            style={{
                display: "flex",
                justifyContent: 'space-around',
                paddingTop: 5
            }}
        >
            <svg
                onClick={onEdit}
                xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 32 32">
                <path d="M13.071,24.358c-0.497,0-0.962-0.246-1.242-0.658c-2.339-3.45-4.751-5.873-7.373-7.405 c-0.715-0.418-0.956-1.337-0.538-2.052c0.417-0.715,1.336-0.958,2.052-0.538c2.529,1.478,4.856,3.627,7.071,6.539 c4.261-6.008,9.283-10.838,14.952-14.375c0.705-0.438,1.628-0.225,2.066,0.479c0.438,0.703,0.225,1.628-0.479,2.066 c-5.935,3.702-10.925,8.697-15.258,15.27c-0.276,0.419-0.742,0.672-1.243,0.675C13.077,24.358,13.074,24.358,13.071,24.358z"></path>
            </svg>
            <svg
                onClick={deleteEvent}
                xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 32 32">
                <path d="M26.285,7.517c-1.431-0.427-2.868-0.743-4.306-0.991c0.026-0.451,0.027-0.913-0.01-1.282 c-0.118-1.16-0.894-2.16-1.976-2.548c-2.577-0.924-5.414-0.923-7.987,0c-1.083,0.388-1.858,1.388-1.977,2.548 c-0.032,0.32-0.036,0.813-0.016,1.297c-1.437,0.251-2.873,0.57-4.304,1.001C5.182,7.701,4.882,8.26,5.041,8.788 C5.172,9.221,5.568,9.5,5.999,9.5c0.095,0,0.192-0.014,0.288-0.042C6.518,9.389,6.749,9.34,6.98,9.276 c-1.02,4.766-1.462,11.209,0.056,16.677c0.749,2.693,1.493,2.979,4.226,3.65c1.084,0.267,2.909,0.4,4.735,0.4 c1.829,0,3.658-0.134,4.746-0.401c2.728-0.67,3.472-0.956,4.221-3.649c1.52-5.476,1.077-11.928,0.056-16.7 c0.231,0.064,0.463,0.112,0.693,0.181c0.527,0.155,1.087-0.144,1.244-0.672C27.115,8.231,26.814,7.674,26.285,7.517z M19.03,14.242 c-0.135-0.535,0.191-1.078,0.728-1.212c0.535-0.137,1.078,0.191,1.212,0.728c0.704,2.814,0.704,5.67,0,8.484 C20.856,22.697,20.449,23,20.001,23c-0.08,0-0.162-0.01-0.243-0.03c-0.536-0.134-0.862-0.677-0.728-1.212 C19.653,19.265,19.653,16.735,19.03,14.242z M12.97,21.758c0.135,0.535-0.191,1.078-0.728,1.212C12.161,22.99,12.079,23,11.999,23 c-0.448,0-0.855-0.303-0.969-0.758c-0.704-2.814-0.704-5.67,0-8.484c0.133-0.536,0.674-0.864,1.212-0.728 c0.536,0.134,0.862,0.677,0.728,1.212C12.347,16.735,12.347,19.265,12.97,21.758z M15,22v-8c0-0.553,0.447-1,1-1s1,0.447,1,1v8 c0,0.553-0.447,1-1,1S15,22.553,15,22z M12.021,5.445c0.04-0.396,0.3-0.737,0.661-0.866c2.139-0.768,4.495-0.768,6.638,0 c0.36,0.129,0.62,0.47,0.66,0.865c0.022,0.22,0.024,0.51,0.013,0.8c-2.661-0.304-5.327-0.301-7.988,0.01 C11.997,5.949,12,5.645,12.021,5.445z"></path>
            </svg>
        </div>
    </div>

}

export default EventEditor;
