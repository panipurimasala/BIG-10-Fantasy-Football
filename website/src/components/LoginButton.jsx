import React from "react";
import "./LoginButton.css"
import { useNavigate } from "react-router-dom";
const LoginButton = () => {
    const navigate = useNavigate();
    const loginWithRedirect = () =>{
        navigate("/LoginPage");
    }
    return <button className="login_button" onClick = {() => loginWithRedirect()}>Login</button>
}

export default LoginButton;