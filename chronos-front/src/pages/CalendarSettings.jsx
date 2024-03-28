import Navigation from "../components/Navigation";
import {useEffect, useState} from "react";
import Requests from "../API/requests";
import {useParams} from "react-router-dom";
import './CalendarSettings.css';
import EditableTextInput from "../components/EditableTextInput";
import UserFinder from "../components/UserFinder";
import InvitingButton from "../components/InvitingButton";
function CalendarSettings() {

    const {calendarId} = useParams();
    const [calendarData, setCalendarData] = useState(undefined);
    const [calendarUsers, setCalendarUsers] = useState([]);
    const [permissions, setPermissions] = useState({
        fieldsEdit: false,
        roleEdit: false,
    });
    useEffect( () => {
        const fetchData = async () => {
            const resp = await Requests.calendarById(
                localStorage.getItem('token'), calendarId
            );
            setCalendarData(resp.data);
        }
        fetchData();
    }, [calendarId]);


    useEffect(() => {
        if (calendarData){
            setPermissions({
                fieldsEdit: !('calendar_user' in calendarData && calendarData.calendar_user.role === 'inspector'),
                roleEdit: Number.parseInt(localStorage.getItem('user_id')) === calendarData.user_id
            });
            // alert(JSON.stringify({
            //     fieldsEdit: !('calendar_user' in calendarData && calendarData.calendar_user.role === 'inspector'),
            //     roleEdit: Number.parseInt(localStorage.getItem('user_id')) === calendarData.user_id
            // }))
        }
    }, [calendarData]);
    useEffect(() => {
        // Пользовательская функция сравнения для сортировки по ролям
        const compareRoles = (user1, user2) => {
            const rolesOrder = { "owner": 1, "editor": 2, "inspector": 3 };
            return rolesOrder[user1.role] - rolesOrder[user2.role];
        }
        const fetchData = async () => {
            const resp = await Requests.usersByCalendar(localStorage.getItem('token'), calendarId);
            if (resp.state === true){
                resp.data.sort(compareRoles);
                setCalendarUsers(resp.data);
            }
        }
        fetchData();
    }, [calendarId]);
    async function sendEditedData(editedFields) {
        const resp = await Requests.editCalendar(localStorage.getItem('token'),
            {...editedFields,
                'calendar_id': Number.parseInt(calendarId),
            });
        if (resp.state !== true){
            alert(resp.message);
            window.location.reload();
        }
    }


    const [usersFound, setUsersFound] = useState([]);
    return (
        <div className="main">
            <Navigation/>
            <div className={'main-content'}>
                <div className={'center-block'}>
                    {/*{calendarData && <div>{JSON.stringify(calendarData)}</div>}*/}
                    {calendarData &&
                        <div className={'calendar-info-editor'}>
                            <div className={'calendar-header-buttons-line'}>
                                {
                                    calendarData.user_id !== Number.parseInt(localStorage.getItem('user_id')) &&
                                    <img
                                        style={{
                                            position: 'absolute',
                                            right: '5px'
                                        }}
                                        className={'svg-image'}
                                        onClick={async () => {
                                            Requests.deleteCalendar(localStorage.getItem('token'), calendarData.id)
                                                .then((resp) => {
                                                    if (resp.state === true)
                                                        window.location.href = `/users/${localStorage.getItem('user_id')}`;
                                                    else
                                                        alert('Something went wrong');
                                                })
                                        }}
                                        alt={'delete'}
                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC6klEQVR4nO3bz6sVZRzH8bHUW0bpaWcklbsWRSWSdBOEFDRX3Y2k3hZqiblwIfhjo4hK2aKQ8A/QK4qK2N1F1CK4V8Gl7QTFXyi1MMsfiF59yeAUw+g53XM6zznznDtvmNUzc87z+cwzM98fM0lSUVFRUREWPIdatk1JegW8hLkYxG4cxM/4Db/joafzANdxBadwHHuxEYsxKykbeBbvYD2GcE5Y/sSv+Aofp2Z3S/hUbMUl3WUMp7EKkzsl/mWMKh/D6OuEASeUl82hxX+o3FwKbcBe5WdGSANOKj8fhDTguvLzeSjxr4iD70IZ8JE4+CmUAV+KgzBPAnwjDsaCJFc4LB5eC2HAqHiYH8KAi+JhWbvFT8J98bAiN/c+HMUtHGspYcJ0cbEyN/fVhbFNrRjwhngNWFMYu5aW45o14D1xMZibey1b/q2vAiwMONmrWZRZa+M2tTD/bwv/eRdvNWPAQEAD1iedqWKlBdk8FzB7vD+wLLrs7UkNi7LKc57LWDCegwcDGnAeb3fIhB1P+f+0TL8Pzzc6cLXw/J3VG4rbbZ1hqJEB6/Q+D+qW00wMA1JmdvMS6DYnu3UTDMHaOvHBtjr7p5nuq916DAZNhnIa+nGvsN8NfIFn6opPwSciNiDrWKdd5zx/4N2kBKFwJwz4ujCepvbvj0t8pMnQ8tzcZ+BmYXx70gx4XVx82iAdTpf+tF4viAw0eIRvbUp8riRWvIOWmSWFktiRLKQ+3jDm76Gi6IKWRP6HASPi4c0QBhwSD9NDGLBHHNxuu/jImqNnkgneHj8WyoCZ4mB3EAMiekXms2SCvyQ1byK/JncXL4Y0oF+5GQ4m/h+yuLqsZz98f8HjNtNICcX/WwPohAlTsKUkr8v/gDkdE1/ng4k0SjyAsw2+CGkHf+EX7MTSdDUmZQMvpGckrcthF/bjxzREzTq0d+qIe5jFGeeySyzN3b/HhqyxWb5PZv4PWaGiFiRzq6ioqKhIWuYRpUEkRCuy7OcAAAAASUVORK5CYII="
                                    />
                                }
                                {
                                    calendarData.user_id === Number.parseInt(localStorage.getItem('user_id')) &&
                                    <svg
                                        style={{
                                            position: 'absolute',
                                            right: '5px'
                                        }}
                                        onClick={async () => {
                                            Requests.deleteCalendar(localStorage.getItem('token'), calendarData.id)
                                                .then((resp) => {
                                                    if (resp.state === true)
                                                        window.location.href = `/users/${localStorage.getItem('user_id')}`;
                                                    else
                                                        alert('Щось пішло не так...');
                                                })
                                        }}
                                        xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 32 32">
                                        <path d="M26.285,7.517c-1.431-0.427-2.868-0.743-4.306-0.991c0.026-0.451,0.027-0.913-0.01-1.282 c-0.118-1.16-0.894-2.16-1.976-2.548c-2.577-0.924-5.414-0.923-7.987,0c-1.083,0.388-1.858,1.388-1.977,2.548 c-0.032,0.32-0.036,0.813-0.016,1.297c-1.437,0.251-2.873,0.57-4.304,1.001C5.182,7.701,4.882,8.26,5.041,8.788 C5.172,9.221,5.568,9.5,5.999,9.5c0.095,0,0.192-0.014,0.288-0.042C6.518,9.389,6.749,9.34,6.98,9.276 c-1.02,4.766-1.462,11.209,0.056,16.677c0.749,2.693,1.493,2.979,4.226,3.65c1.084,0.267,2.909,0.4,4.735,0.4 c1.829,0,3.658-0.134,4.746-0.401c2.728-0.67,3.472-0.956,4.221-3.649c1.52-5.476,1.077-11.928,0.056-16.7 c0.231,0.064,0.463,0.112,0.693,0.181c0.527,0.155,1.087-0.144,1.244-0.672C27.115,8.231,26.814,7.674,26.285,7.517z M19.03,14.242 c-0.135-0.535,0.191-1.078,0.728-1.212c0.535-0.137,1.078,0.191,1.212,0.728c0.704,2.814,0.704,5.67,0,8.484 C20.856,22.697,20.449,23,20.001,23c-0.08,0-0.162-0.01-0.243-0.03c-0.536-0.134-0.862-0.677-0.728-1.212 C19.653,19.265,19.653,16.735,19.03,14.242z M12.97,21.758c0.135,0.535-0.191,1.078-0.728,1.212C12.161,22.99,12.079,23,11.999,23 c-0.448,0-0.855-0.303-0.969-0.758c-0.704-2.814-0.704-5.67,0-8.484c0.133-0.536,0.674-0.864,1.212-0.728 c0.536,0.134,0.862,0.677,0.728,1.212C12.347,16.735,12.347,19.265,12.97,21.758z M15,22v-8c0-0.553,0.447-1,1-1s1,0.447,1,1v8 c0,0.553-0.447,1-1,1S15,22.553,15,22z M12.021,5.445c0.04-0.396,0.3-0.737,0.661-0.866c2.139-0.768,4.495-0.768,6.638,0 c0.36,0.129,0.62,0.47,0.66,0.865c0.022,0.22,0.024,0.51,0.013,0.8c-2.661-0.304-5.327-0.301-7.988,0.01 C11.997,5.949,12,5.645,12.021,5.445z"></path>
                                    </svg>
                                }
                            </div>
                            <h1>
                                <EditableTextInput
                                    initialText={calendarData.title}
                                    placeholder={'Назва календаря'}
                                    onEdited={async (value) => {
                                        await sendEditedData({
                                            title: value,
                                        });
                                    }}
                                    canEmpty={false}
                                />
                            </h1>
                            <h3 style={{
                                padding: '5px',
                            }}>
                                <EditableTextInput
                                    initialText={calendarData.description}
                                    placeholder={'Опис'}
                                    onEdited={async (value) => {
                                        await sendEditedData({
                                            description: value,
                                        });
                                    }}
                                />
                            </h3>
                        </div>
                    }
                    <UserFinder
                        exclude_ids={calendarUsers.map((calendarUser) => calendarUser.user_id)}
                        onFound={(found_users_data) => setUsersFound(found_users_data)}
                    />
                    <div className={'users-found'}>
                        {usersFound.map((userdata) => (
                            <div className={'calendar-user-inspect-userdata'}>
                                <img
                                    className={'calendar-user-inspect-avatar'}
                                    src={Requests.get_img_link(userdata.id)}
                                    alt={'Ava'}
                                />
                                <a href={`${window.location.origin}/users/${userdata.id}`}>
                                    {`${userdata.full_name}`}
                                </a>
                                <InvitingButton
                                    userdata={userdata}
                                    calendarId={calendarId}
                                />
                            </div>
                        ))}
                    </div>
                    <div className={'calendar-users'}>
                        {calendarUsers &&
                            calendarUsers.map((userdata, index) => (
                                <div
                                    className={'calendar-user-inspect'}
                                    key={`calendar-user-inspect-${userdata.user_id}`}
                                >
                                    <div className={'calendar-user-inspect-userdata'}>
                                        <img
                                            className={'calendar-user-inspect-avatar'}
                                            src={Requests.get_img_link(userdata.user_id)}
                                            alt={'Ava'}
                                        />
                                        <a
                                            style={{
                                                marginRight: 0,
                                            }}
                                            href={`${window.location.origin}/users/${userdata.user_id}`}>
                                            {`${userdata.full_name}`}
                                        </a>
                                        <label
                                            className="color-picker"
                                            style={{
                                                cursor: userdata.user_id === Number.parseInt(localStorage.getItem('user_id')) ? 'pointer' : '',
                                            }}
                                        >
                                            <input
                                                className={'color-picker-input'}
                                                type={'color'}
                                                style={{
                                                    position: 'absolute',
                                                    height: 20,
                                                    width: 20,
                                                    visibility: 'hidden',
                                                }}
                                                defaultValue={userdata.color}
                                                onChange={(event) => {
                                                    const newColor = event.target.value;
                                                    const updatedUserdata = { ...userdata, color: newColor };
                                                    const updatedCalendarUsers = [
                                                        ...calendarUsers.slice(0, index),
                                                        updatedUserdata,
                                                        ...calendarUsers.slice(index + 1)
                                                    ];
                                                    setCalendarUsers(updatedCalendarUsers);
                                                    sendEditedData({color: event.target.value})
                                                }}
                                                disabled={userdata.user_id !== Number.parseInt(localStorage.getItem('user_id'))}
                                            />
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 32 32"
                                                style={{
                                                    fill: userdata.color
                                                }}
                                            >
                                                <path d="M26.429,8.397c-0.508-1.864-1.918-3.402-3.771-4.113C18.145,2.552,13.57,2.588,9.061,4.395	C7.376,5.069,6.072,6.562,5.574,8.388C3.935,14.393,3.984,20.484,5.721,26.49c0.226,0.782,0.765,1.453,1.477,1.842	c0.693,0.377,1.485,0.464,2.229,0.242c2.234-0.667,4.563-1.904,6.584-3.479c2.506,2.136,5.209,3.111,6.598,3.502	c0.26,0.073,0.522,0.108,0.782,0.108c1.294,0,2.5-0.874,2.885-2.203C28.015,20.497,28.066,14.405,26.429,8.397z"></path>
                                            </svg>
                                        </label>
                                    </div>
                                    {/*<div>{JSON.stringify(userdata)}</div>*/}
                                    {
                                        permissions.roleEdit && userdata.role !== 'owner' &&
                                        <select
                                            className={'role-select'}
                                            defaultValue={userdata.role || 'inspector'}
                                            onChange={(event) => {
                                                Requests.updateRole(localStorage.getItem('token'),
                                                    {
                                                        calendar_id: Number.parseInt(calendarId),
                                                        user_id: userdata.user_id,
                                                        role: event.target.value
                                                    }
                                                )
                                            }}
                                        >
                                            <option value="editor">Редактор</option>
                                            <option value="inspector">Спостерігач</option>
                                        </select>
                                    }
                                    {
                                        (!permissions.roleEdit && userdata.role === 'editor') &&
                                        <img
                                            className={'svg-image'}
                                            alt={'editor'}
                                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE2UlEQVR4nO2aa4hWRRjHZ9WiNcWiC2xuhkZ90DIlAstuVPShNawEMwMLqTXNzOiyWUL3q2U3LGKjYN1PCtaWldvFrpaVpVFBZUJFUhGSXbf7L6ae5Oyzc857zpk5r6eX8/v28s55/s/MmfPMM8+MMRUVFRUVFf87gD2AE4CLgA7gPGA80GQaGeAg4EGgDzefAu3ALqbRAE4FfiMdrwEtppEA9gOeIT2fASNNIwE0AecD36UchDeBIfVybH/gRGAOcC2wDFgFvApsAN4HtgCfAN3A8AR7g4GjgKEx/1uttSkHYX7ozg4BJsib6ATeAX4iO9fE2G8GeqTNVhnQAW/RBjrgkRQ6W4KsDkAL8ACwnTAsdWjsKTNGYwd5YszMuy6F1uG+nZ8AfEk4PgRGOdb2TQnP/A4scr1NYG4NvXafzg+XaVSLbcB6oAu4XpKU6cCx9g0A44AxQGvMtH8l5eD1uOKHaMZxpc8AzHUYtLPhUeAq4CRgr9wC/2qsJBtvAfs4PoflMe0X+ji3VhnrDJlpAfPIxwfA3srWrsDLjrZteZ0bBHyvjI0O2PlxCWlt2nV+mLI5Gvgh0qZPt8nqYJSvQ3Ve7Kddy5NYpQMjcGHk/y4fB89VYqtDdFxsn0k4LnfM3BeBX4GDfZy8O03yksOudfCjgANgN0mHOrLFKb6OPq2Epvl2XuyeTnhsPBgcwr8dSN4eZbwJgGPNt/nDpTJtfZgdwr/okvJHxPhfcZuTLEiUtraiHBb5f7IscXn4HNjN18do9aWfcRMAm5Upu+scbYZ5rBCTQvhpgKOV4fWB7L6eZrtqs0spcWXhsWBxADhDGe8JYLNZlqYorQntj8nQeRtXmn193AFwgRLoNJ4Axymbm1M840ptNRvtVtrXv34AVyuRm40ndrorm105YobGrhwjfH0bAHCDElpsPAHuVDYX1Wg/EXg7ofPdwaK+BliSlG7mQfL2KGc52owCLnYEyyg/28MQX38SAe5VoguMJ8BzymYvMFPqCt0pCy+9Xvl9BmfvV8LzAthMW/Vx8V6oVDzvRmhhAJvrMnb6TwlyU2NqgYOkfD7G17cBALcpZzqMJ8AtKTr9i3T6Cl04dZTAnpJnbMo+w9e/fjjKzd5bYRux7XIqmx8b5J4FVsjqMEcKqKmSGRsHlH8v+frXDzl2jrLElAjgZOXf86EFZiuB/KWlAnBUq5aHFmhTAmtMiZBDkii3hxY4QglsNCXCkadcElqgVQlsMyVCgmdiVukr0OQ49fU6AQqJI6c4vgiRd5XIkaYEyMvRp9QHFCG0UomcY0oAcGBdPk8GbonvMiXA7gkKzQH+AzitVgFzZwDcqPy6oyihFiXUV4Y7eMCTyq+zixTbWkjZOb8/9m7QV8qnQ+q53m6wg1CX62fuQ5WHlD/bC/UFmEJ8WcreyLxH9g2T9a0ND83dpR44Xa6+2G3vNzF+LAuhWWvNfZz0fCv5Q69cWVkqW+sOOf+zd3kXyO/FUnd4GHgCeMPxySVh2+5rigYYkXEQ6sHmUIe1WWZCm8SEL3ZSp+11nRfk0CbftZfAl5enyje6Qk5nfgzUUXsn8GNZ7my1aBYw1tYATdkBRsq9wFNs6gxcJneHb5V4YO/73ye/b5JY0C6D+U+Bswy5RkVFRUVFRYVpaP4GZNthS1ei0EgAAAAASUVORK5CYII="
                                        />
                                    }
                                    {
                                        (!permissions.roleEdit && userdata.role === 'inspector') &&
                                        <img
                                            className={'svg-image'}
                                            alt={'inspector'}
                                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADrElEQVR4nO2aSU8UQRSA+yAuERDXC54FjagnBXFBrupdo0bvojejUUHcIkH/g0G9ENDoHzDEoEjCoiYuIGqMmrgCMlw0Op95UiQEm+mqruoZxtSXVEJ66LdUd9V79V4Hgcfj8Xg8Ho/HkwjAEmA30ADcALqB18Aw8FONYXWtW/1PvbpncZCPAOuBi8AT4DfxkXsfAxeAdcFsBigGjgLPSA6RXQcUBbMFYClwGfhO9hgFmmR55dLxecBJZYwOaaBHre8aoAxYqEa5uib7RK/BRIwAx4G52XZ+K/DcwPFWYJWBfJmcNnWvDk+B6mS9Dv4aVgBcMTBsCNhooa9SRQfdDbMZmOPWawWwEniAPndlfwgsAZYBHQZ67wOltnrDwtp7Q+cLAkfIGjechHdAhSvl2w13+CEXT36GN0F3OaA25y22SjcDKQOlaZs1r2FPlcH+I4zJPhJX2RqDEDdJq3Ov/7Wr3dAmCZXlcZKbIUNFaZ1Qp/IHyRgfAuNqyN9H5DeN+yVnMGXQ6FwB3ImhpEdDbinwKIOMfp0dHOiLYd8tXecPEY96jSefyfmpk5DxTQDOxLTxQJTzi4DPMYXXRMiW116XughZtTFt/JTxIMXEETYuGde/Ouvr0qWRKsfl7ExCFwDfLAQXRhhtEk5TEbIKLez8CswPE7oPO4ocTsBYhKwiS1v3hgm9bik0X5aA0BImdNBS6I4IoyXO53oTnGQgTOi4pdAGjTAoIS6K/qgCB9BoaWvKdo2G0ZvJ6CmJUL+DREhnIo0nYNBSqKTCZZpHWylsdqlJT6k6Q51OaQtYjT0vwgRfcyC4LUgYSWkd2Hk1iTA4+RZUJuh8teFxeCb2JJEITfIGWJ6A83FOqGF8CU2EBNWBcUGHy1K12jfuObKtMSrD+uhIUSewwtGTlxqjC+SgVxyl8CDukBpeleWalyXliv26im87VJpWZSztspQKdTdxS7tpS/sl7ulTxYxaVdoqVKNcXWt0kOSEMQCUaE/AlKcgBcV8Z1gnQcvUmpLScr4i/YxNgQ3Atiy3vl0x6qxhCqwF3pI/fAA2OHF+WnNUGo+znU7nzdFp7fFmy+9+kkJsupRYezykZygfJcwWBqPK8s5hosJzIsehUg5vx7L+iUxI0tQUo5Fqw4jqYZglN0nCxEGqLuGlIbIPR/Ugcg5QAZxXaa3NhvlLpc/nJBQH+QhQAuwCTquym9QCX6n1+0ONb+qa/NYCnAJ2Sq8y1/Z7PB6Px+PxeIL/lD9WdPU4yNy2sQAAAABJRU5ErkJggg=="
                                        />
                                    }
                                    {
                                        userdata.role === 'owner' &&
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 32 32">
                                            <path d="M25.485,18.341c2.204-2.204,2.922-5.327,2.161-8.133c-0.237-0.875-1.341-1.163-1.982-0.522l-1.778,1.778	c-0.887,0.887-2.333,1.057-3.303,0.263c-1.116-0.913-1.177-2.562-0.184-3.556l1.874-1.874c0.641-0.641,0.353-1.745-0.522-1.982	c-2.806-0.761-5.929-0.042-8.133,2.161c-2.407,2.407-3.038,5.909-1.91,8.899c-4,1.164-6.548,4.13-7.128,5.553	c-1.685,4.132,2.379,8.323,6.478,6.478c1.379-0.62,4.15-3.217,5.487-7.169C19.546,21.386,23.069,20.758,25.485,18.341z"></path>
                                        </svg>
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CalendarSettings;
