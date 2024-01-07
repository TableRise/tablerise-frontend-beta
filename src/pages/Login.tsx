// import React from 'react';
import 'src/pages/styles/Login.css';

export default function Login() {
    return(
        <section className="login-main">
            <form className="login-box">
                <h1 className="login-title">TableRise</h1>
                <div className="login-credentials">
                    <label htmlFor="login-email-input">
                        <span>Digite seu email</span>
                        <input id="login-email-input" type="text" />
                    </label>
                    <label htmlFor="login-password-input">
                        <span>Digite sua senha</span>
                        <input id="login-password-input" type="password" />
                    </label>
                </div>
                <div className="login-buttons">
                    <button type="button">Login</button>
                </div>
            </form>
        </section>
    )
}
