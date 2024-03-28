import './Navigation.css';
import Requests from "../API/requests";
import {useEffect, useState} from "react";
import {logout} from "../utils/Utils";

function Navigation() {

    const [userdata, setUserdata] = useState({
        username: 'Завантаження...',
    });

    useEffect(() => {
        const fetchData = async () => {
            const resp = await Requests.user_by_id(localStorage.getItem('user_id'));
            if (resp.state === true){
                const currentURL = window.location.href.trim();
                if (currentURL.includes('/login') || currentURL.includes('/registration')) {
                    window.location.href = `${window.location.origin}/users/${localStorage.getItem('user_id')}`;
                }
                setUserdata(resp.data[0]);
            }
            else {
                logout();
                window.location.href = '/login';
            }
        }
        if (localStorage.getItem('user_id'))
            fetchData();
    }, []);

    return (
        <div id={'navigation'}>
            <div
                className={'main-links'}
            >
                {localStorage.getItem('defaultCalendar') &&
                    <a href={`${window.location.origin}/calendars/${localStorage.getItem('defaultCalendar')}`}>Головна</a>
                }
                {!localStorage.getItem('defaultCalendar') &&
                    <a href={`${window.location.origin}/users/${localStorage.getItem('user_id')}`}>Головна</a>
                }
                <a href={'/holidays'}>Свята</a>
            </div>
            {localStorage.getItem('user_id') &&
                <div className={'userdata-min'}>
                    <img
                        className={'avatar'}
                        onClick={() => window.location.href = `${window.location.origin}/users/${localStorage.getItem('user_id')}`}
                        src={Requests.get_img_link(localStorage.getItem('user_id'))}
                        alt={'Ava'}
                    />
                    <a href={`${window.location.origin}/users/${localStorage.getItem('user_id')}`}>
                        {`${userdata.full_name}`}
                    </a>
                    <img
                        onClick={logout}
                        className={'svg-image'}
                        alt={'leave'}
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC6klEQVR4nO3bz6sVZRzH8bHUW0bpaWcklbsWRSWSdBOEFDRX3Y2k3hZqiblwIfhjo4hK2aKQ8A/QK4qK2N1F1CK4V8Gl7QTFXyi1MMsfiF59yeAUw+g53XM6zznznDtvmNUzc87z+cwzM98fM0lSUVFRUREWPIdatk1JegW8hLkYxG4cxM/4Db/joafzANdxBadwHHuxEYsxKykbeBbvYD2GcE5Y/sSv+Aofp2Z3S/hUbMUl3WUMp7EKkzsl/mWMKh/D6OuEASeUl82hxX+o3FwKbcBe5WdGSANOKj8fhDTguvLzeSjxr4iD70IZ8JE4+CmUAV+KgzBPAnwjDsaCJFc4LB5eC2HAqHiYH8KAi+JhWbvFT8J98bAiN/c+HMUtHGspYcJ0cbEyN/fVhbFNrRjwhngNWFMYu5aW45o14D1xMZibey1b/q2vAiwMONmrWZRZa+M2tTD/bwv/eRdvNWPAQEAD1iedqWKlBdk8FzB7vD+wLLrs7UkNi7LKc57LWDCegwcDGnAeb3fIhB1P+f+0TL8Pzzc6cLXw/J3VG4rbbZ1hqJEB6/Q+D+qW00wMA1JmdvMS6DYnu3UTDMHaOvHBtjr7p5nuq916DAZNhnIa+nGvsN8NfIFn6opPwSciNiDrWKdd5zx/4N2kBKFwJwz4ujCepvbvj0t8pMnQ8tzcZ+BmYXx70gx4XVx82iAdTpf+tF4viAw0eIRvbUp8riRWvIOWmSWFktiRLKQ+3jDm76Gi6IKWRP6HASPi4c0QBhwSD9NDGLBHHNxuu/jImqNnkgneHj8WyoCZ4mB3EAMiekXms2SCvyQ1byK/JncXL4Y0oF+5GQ4m/h+yuLqsZz98f8HjNtNICcX/WwPohAlTsKUkr8v/gDkdE1/ng4k0SjyAsw2+CGkHf+EX7MTSdDUmZQMvpGckrcthF/bjxzREzTq0d+qIe5jFGeeySyzN3b/HhqyxWb5PZv4PWaGiFiRzq6ioqKhIWuYRpUEkRCuy7OcAAAAASUVORK5CYII="
                    />
                </div>
            }
            {!localStorage.getItem('user_id') &&
                <a href={`${window.location.origin}/login`}>Вхід</a>
            }
        </div>
    );
}

export default Navigation;
