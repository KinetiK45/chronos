import './Main.css';
import './Login.css';
import Requests from "../API/requests";
import Navigation from "../components/Navigation";
import {useEffect} from "react";

async function handle_auth() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username === '' || password === '') {
        return displayError('Заполните все поля');
    }

    const resp = await Requests.login(username, password);
    if (resp.state === true){
        localStorage.setItem('user_id', resp.data.user_id);
        localStorage.setItem('token', resp.data.auth_key);
        window.location.href = `/users/${resp.data.user_id}`;
    }
    else
        displayError(resp.message);
}

const displayError = (errorMessage) => {
    const errorsContainer = document.querySelector('.errors');
    errorsContainer.textContent = errorMessage;
    errorsContainer.style.display = 'block';
    setTimeout(()=>{errorsContainer.style.display = 'none'}, 5000);
};

function Login() {
    return (
        <div className="main">
            <Navigation/>
            <div className={'main-content'}>
                <div
                    className={'center-block'}
                    style={{
                        minWidth: 0
                    }}
                >
                    <h1>Вхід</h1>
                    <div className={'errors'}></div>
                    <div className={'inputs'}>
                        <input id={'username'} name={'username'} type={'text'} placeholder={'Логін'}/>
                        <input id={'password'} name={'password'} type={'password'} placeholder={'Пароль'}/>
                    </div>
                    <div className={'text-line'}>
                        <p>Немає аккаунту? <a href={'/registration'}>Зареєструватися</a></p>
                    </div>
                    <div className={'text-line'}>
                        <p>Забули пароль? <a href={'/password-recovery'}>Відновлення</a></p>
                    </div>
                    <br/>
                    <button className={'form-submit'} onClick={handle_auth}>Увійти</button>
                </div>
            </div>
        </div>
    );
}

export default Login;
