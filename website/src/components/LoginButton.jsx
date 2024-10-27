import React from "react";
import { Auth0Context, useAuth0 } from "@auth0/auth0-react";
import "./LoginButton.css"
const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return <button className="login_button" onClick = {() => loginWithRedirect()}>Login</button>
}

export default LoginButton;