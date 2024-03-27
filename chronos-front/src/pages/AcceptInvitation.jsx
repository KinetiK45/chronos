import './Main.css';

import Requests from "../API/requests";
import Navigation from "../components/Navigation";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";

const displayError = (errorMessage) => {
    const errorsContainer = document.querySelector('.errors');
    errorsContainer.textContent = errorMessage;
    errorsContainer.style.display = 'block';
    setTimeout(()=>{errorsContainer.style.display = 'none'}, 5000);
};

function AcceptInvitation() {
    const {acceptToken} = useParams();
    const [acceptState, setAcceptState] = useState('Pending...');

    useEffect(()=>{
        const fetchData = async () => {
            const resp = await Requests.acceptInvitation(acceptToken);
            setAcceptState(JSON.stringify(resp.data))
        };
        fetchData();
    }, [acceptToken]);

    return (
        <div className="main">
            <Navigation/>
            <div className={'main-content'}>
                <div className={'center-block'}>
                    <h1>Приймаю інвайт</h1>
                    <div className={'errors'}></div>
                    {acceptState &&
                        <div>{`${acceptState}`}</div>
                    }
                </div>
            </div>
        </div>
    );
}

export default AcceptInvitation;
