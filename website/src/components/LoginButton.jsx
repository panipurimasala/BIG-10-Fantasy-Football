import React from "react";
import { Auth0Context, useAuth0 } from "@auth0/auth0-react";
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