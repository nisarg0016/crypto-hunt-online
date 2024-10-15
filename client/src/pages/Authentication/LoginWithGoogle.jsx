import React, { useState, useEffect } from "react";
import axios from 'axios';

const LoginWithGoogle = () => {
    const [user, setUser] = useState(null);

    const signin = () => {
        const redirectUri = 'http://localhost:8000/auth/google';
        window.location.href = redirectUri;
    }
    
    return (
        <div className="landing_page_full">
        <section id="up"></section>
        <section id="down"></section>
        <section id="left"></section>
        <section id="right"></section>
            <div className="login_area">
                <h1 className="animated_typing_class">Welcome to CryptoHunt</h1>
                <div className="login_button_area">
                    <button className="login_button" onClick={signin}>
                        Student Sign in
                    </button>
                    <p>* Login should only be with student email</p>
                </div>
            </div>
        </div>
    );
}

export default LoginWithGoogle;