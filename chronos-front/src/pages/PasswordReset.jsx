import './Main.css';
import './Login.css';
import React from "react";
import Requests from "../API/requests";
import {useParams} from "react-router-dom";
import Navigation from "../components/Navigation";

const displayError = (errorMessage) => {
    const errorsContainer = document.querySelector('.errors');
    errorsContainer.textContent = errorMessage;
    errorsContainer.style.display = 'block';
    setTimeout(()=>{errorsContainer.style.display = 'none'}, 5000);
};

function Login() {
    const { token } = useParams();

    async function recover_password() {
        const password = document.getElementById('password').value.trim();
        if (password === '') {
            return displayError('Заполните все поля');
        }

        const resp = await Requests.passwordResetConfirm(token, password);
        if (resp.state === true){
            window.location.href = '/login';
        }
        else
            displayError(resp.message);
    }

    return (
        <div className="main">
            <Navigation/>
            <div className={'main-content'}>
                <div className={'center-block'}>
                    <h1>Уведіть новий пароль</h1>
                    <div className={'errors'}></div>
                    <div className={'inputs'}>
                        <input id={'password'} name={'password'} type={'password'} placeholder={'New password'}/>
                    </div>
                    <br/>
                    <button onClick={recover_password}>Змінити пароль</button>
                </div>
            </div>
        </div>
    );
}

export default Login;
