import React, { useState } from 'react';
import Requests from "../API/requests";

function InvitingButton({userdata, calendarId}) {

    const [inviteState, setInviteState] = useState(1);
    const handleShareCalendar = () => {
        setInviteState(2);

        Requests.shareCalendar(localStorage.getItem('token'), {
            user_id: userdata.id,
            calendar_id: calendarId
        }).then((resp) => {
            if (resp.state === true){
                setInviteState(3);
            }
            else {
                setInviteState(4);
                alert(resp.message);
            }

        });
    };

    return (
        <div>
            {inviteState === 1 &&
                <svg
                    onClick={handleShareCalendar}
                    xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 32 32"
                >
                    <path d="M24,11c-0.261,0-0.513,0.038-0.764,0.077c-1.596-3.226-5.747-6.159-10.231-6.04C12.093,3.808,10.644,3,9,3 C6.243,3,4,5.243,4,8s2.243,5,5,5s5-2.243,5-5c0-0.322-0.037-0.636-0.095-0.941c3.334,0.274,6.258,2.594,7.436,4.723 C19.939,12.669,19,14.222,19,16c0,1.778,0.939,3.331,2.341,4.218c-1.178,2.13-4.1,4.45-7.437,4.723C13.963,24.636,14,24.322,14,24 c0-2.757-2.243-5-5-5s-5,2.243-5,5s2.243,5,5,5c1.643,0,3.09-0.807,4.002-2.034c0.094,0.003,0.188,0.013,0.281,0.013 c4.376,0,8.388-2.896,9.952-6.056C23.487,20.962,23.738,21,24,21c2.757,0,5-2.243,5-5S26.757,11,24,11z"></path>
                </svg>
            }
            {inviteState === 2 &&
                <div>Надсилаємо запрошення на пошту...</div>
            }
            {inviteState === 3 &&
                <div>Запрошення надіслано</div>
            }
            {inviteState === 4 &&
                <div>Сталася помилка при запрошенні</div>
            }
        </div>
    );
}

export default InvitingButton;
