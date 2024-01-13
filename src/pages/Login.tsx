import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CredentialHandler from 'src/api/users/CredentialHandler';
import 'src/pages/styles/Login.css';

export default function Login() {
    const navigate = useNavigate();
    const [toggleError, setToggleError] = useState(false);
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });

    const handleLogin = async () => {
        const { status } = await CredentialHandler({
            email: loginForm.email,
            password: loginForm.password
        });

        if (status !== 204) return setToggleError(true);

        navigate('/match');
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setLoginForm({
            ...loginForm,
            [name]: value
        });
    }

    const errorMessageElement = <span className="login-error-msg">
        Seu email ou senha estão incorretos!
    </span>

    return(
        <section className="login-main">
            <form className="login-box">
                <h1 className="login-title">TableRise</h1>
                <div className="login-credentials">
                    <label htmlFor="login-email-input">
                        <span>Digite seu email</span>
                        <input
                            id="login-email-input"
                            name="email"
                            type="text"
                            onChange={handleChange}
                        />
                    </label>
                    <label htmlFor="login-password-input">
                        <span>Digite sua senha</span>
                        <input
                            id="login-password-input"
                            name="password"
                            type="password"
                            onChange={handleChange}
                        />
                    </label>
                </div>
                {toggleError && errorMessageElement}
                <div className="login-buttons">
                    <button
                        type="button"
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                </div>
            </form>
        </section>
    )
}
