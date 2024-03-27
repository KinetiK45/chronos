import Requests from "../API/requests";
import Navigation from "../components/Navigation";
import './Profile.css';
import {useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {logout} from "../utils/Utils";

function Profile() {

    const {userId} = useParams();
    const [userData, setUserData] = useState({
        id: 1,
        username: 'Loading...',
        full_name: 'Loading...',
    });

    useEffect(() => {
        const fetchData = async () => {
            const resp = await Requests.user_by_id(userId);
            setUserData(resp.data[0]);
        };
        fetchData();
    }, [userId]);

    const fileInputRef = useRef(null);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        Requests.avatarUpload(file, userId, localStorage.getItem('token'))
            .then((resp) => {
                if (resp.data.state === true)
                    window.location.reload();
                else {
                    alert('Unexpected error');
                }
        });
    };

    const [calendars, setCalendars] = useState([]);

    useEffect( () => {
        const fetchData = async () => {
            try {
                const resp = await Requests.allCalendars(
                    localStorage.getItem('token')
                );
                resp.data.sort((a, b) => {
                    if (a.type === 'default') return -1; // Календарь с типом "default" идет первым
                    if (b.type === 'default') return 1; // Календарь с типом "default" идет первым
                    if (a.type === 'own' && b.type !== 'own') return -1; // Календари типа "own" идут вторыми
                    if (a.type !== 'own' && b.type === 'own') return 1; // Календари типа "own" идут вторыми
                    return 0; // Остальные календари остаются в исходном порядке
                });
                setCalendars(resp.data);
                resp.data.forEach((calendar) => {
                    if (calendar.type === 'default')
                        localStorage.setItem('defaultCalendar', calendar.id);
                });
            } catch (e){
                if (e.response.status === 401){
                    logout();
                }
                console.error(e);
            }
        }
        if (userId === localStorage.getItem('user_id'))
            fetchData();
    }, [])

    return (
        <div className="main">
            <Navigation/>
            <div className={'main-content'}>
                <div
                    className={'center-block'}
                >
                    <div className={'avatar-container'}>
                        <img className={'profileAvatar'} src={Requests.get_img_link(userData.id)} alt={'AVATAR'} onClick={handleImageClick}/>
                        <input type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} accept="image/*"/>
                    </div>
                    <h1>{`${userData.full_name}`}</h1>
                    {calendars && calendars.length > 0 &&
                        <div className={'calendars'}>
                            <h1 style={{
                                textAlign: 'left'
                            }}>Ваші календарі:</h1>
                            <div
                                className={'user-calendars'}
                            >
                                {
                                    calendars.map((calendarData) => (
                                        <>
                                            <div
                                                className={'main-calendar-info'}
                                                key={`main-calendar-info-${calendarData.id}`}
                                            >
                                                <h1><a href={`/calendars/${calendarData.id}`}>{calendarData.title}</a></h1>
                                                <h3>{calendarData.description}</h3>
                                            </div>
                                            <div
                                                className={'calendar-info-optional'}
                                                key={`calendar-info-optional-buttons-${calendarData.id}`}
                                            >
                                                {
                                                    calendarData.type !== 'default' &&
                                                    <a href={`${window.location.origin}/calendars/${calendarData.id}/settings`}><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 32 32">
                                                        <path d="M28.323,18.504c-0.521-0.88-1.091-1.72-1.698-2.504c0.607-0.784,1.177-1.624,1.698-2.504	c0.139-0.234,0.168-0.509,0.103-0.761c-0.392-2.292-1.579-4.358-3.353-5.838c-0.007-0.008-0.015-0.016-0.023-0.024	c-0.189-0.188-0.458-0.277-0.712-0.29c-1.032,0.008-2.045,0.08-3.022,0.212c-0.381-0.924-0.826-1.835-1.327-2.719	c-0.116-0.204-0.299-0.36-0.518-0.443c-2.237-0.842-4.702-0.842-6.939,0c-0.219,0.083-0.402,0.239-0.518,0.443	c-0.5,0.883-0.945,1.794-1.327,2.719c-0.977-0.132-1.99-0.204-3.022-0.212c-0.003,0-0.005,0-0.008,0	c-0.262,0-0.514,0.108-0.701,0.292c-1.777,1.472-2.97,3.53-3.372,5.815c-0.082,0.263-0.053,0.557,0.095,0.807	c0.521,0.88,1.091,1.72,1.698,2.504c-0.607,0.784-1.177,1.624-1.698,2.504c-0.139,0.234-0.168,0.509-0.103,0.761	c0.392,2.292,1.578,4.356,3.351,5.836c0.008,0.009,0.017,0.018,0.025,0.026c0.189,0.188,0.444,0.308,0.713,0.29	c1.033-0.009,2.046-0.08,3.021-0.212c0.381,0.924,0.826,1.835,1.327,2.719c0.116,0.204,0.299,0.36,0.518,0.443	c1.119,0.421,2.294,0.631,3.47,0.631s2.351-0.21,3.47-0.631c0.219-0.083,0.402-0.239,0.518-0.443c0.5-0.883,0.945-1.795,1.327-2.719	c0.976,0.132,1.988,0.203,3.021,0.212c0.29,0.003,0.521-0.106,0.711-0.293c1.776-1.471,2.969-3.528,3.371-5.813	C28.499,19.047,28.471,18.754,28.323,18.504z M20,16c0,2.209-1.791,4-4,4s-4-1.791-4-4c0-2.209,1.791-4,4-4S20,13.791,20,16z"></path>
                                                    </svg></a>
                                                }
                                                {
                                                    calendarData.type === 'default' &&
                                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 32 32">
                                                        <path d="M25.915,13.739c-0.352-0.802-1.074-1.42-1.934-1.654c-0.307-0.083-0.615-0.145-0.922-0.219	c0.081-0.84,0.112-1.685,0.044-2.523c-0.302-3.687-3.397-6.589-7.039-6.607c-0.007,0-0.111-0.001-0.119,0	c-3.651,0.018-6.747,2.92-7.049,6.607c-0.068,0.836-0.037,1.68,0.044,2.523c-0.307,0.074-0.615,0.136-0.922,0.219	c-0.859,0.234-1.582,0.852-1.935,1.654c-1.822,4.154-1.822,8.367,0.001,12.522c0.352,0.802,1.074,1.42,1.934,1.654	c2.648,0.721,5.314,1.081,7.981,1.081s5.333-0.36,7.981-1.081c0.859-0.234,1.582-0.852,1.935-1.654	C27.738,22.106,27.738,17.894,25.915,13.739z M10.891,9.506c0.218-2.662,2.442-4.757,5.154-4.771	c2.622,0.013,4.847,2.108,5.064,4.77c0.053,0.649,0.035,1.302-0.017,1.954c-3.389-0.585-6.796-0.585-10.185,0	C10.856,10.806,10.838,10.153,10.891,9.506z M17,21.723V23c0,0.552-0.447,1-1,1s-1-0.448-1-1v-1.277c-0.595-0.346-1-0.984-1-1.723	c0-1.105,0.895-2,2-2s2,0.895,2,2C18,20.738,17.595,21.376,17,21.723z"></path>
                                                    </svg>
                                                }
                                            </div>
                                        </>
                                    ))
                                }
                            </div>
                            <button
                                id={'create-calendar-button'}
                                onClick={() => {
                                    Requests.createCalendar(localStorage.getItem('token')).then((resp)=>{
                                        if (resp.state === true){
                                            Requests.calendarById(localStorage.getItem('token'), resp.data).then((resp2) => {
                                                if (resp2.state === true){
                                                    setCalendars([...calendars, resp2.data]);
                                                }
                                            })
                                        }
                                    })
                                }}>
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 32 32">
                                    <path d="M16,3C8.832,3,3,8.832,3,16s5.832,13,13,13s13-5.832,13-13S23.168,3,16,3z M22.989,16.207c0,1.034-0.741,1.911-1.755,2.11	c-0.419,0.082-0.84,0.154-1.262,0.217c-0.751,0.111-1.328,0.688-1.438,1.439c-0.062,0.422-0.134,0.843-0.217,1.262	c-0.199,1.014-1.077,1.755-2.111,1.755h-0.413c-1.034,0-1.911-0.741-2.111-1.755c-0.082-0.419-0.154-0.84-0.217-1.262	c-0.111-0.751-0.688-1.328-1.438-1.439c-0.422-0.062-0.843-0.134-1.262-0.217c-1.014-0.199-1.755-1.077-1.755-2.174v-0.35	c0-1.034,0.741-1.911,1.755-2.11c0.419-0.082,0.84-0.154,1.262-0.217c0.751-0.111,1.328-0.688,1.438-1.439	c0.062-0.422,0.134-0.843,0.217-1.262c0.199-1.014,1.077-1.755,2.111-1.755h0.413c1.034,0,1.911,0.741,2.111,1.755	c0.082,0.419,0.154,0.84,0.217,1.262c0.111,0.751,0.688,1.328,1.438,1.439c0.422,0.062,0.843,0.134,1.262,0.217	c1.014,0.199,1.755,1.077,1.755,2.174V16.207z"></path>
                                </svg>
                                Створити календар
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Profile;
