import React, { useEffect } from "react";
import supabase from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from '@supabase/auth-ui-shared';
import "./LoginPage.css";

const LoginPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if there's an active session on mount
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                // If a session exists, navigate to the profile
                navigate("/profile");
            }
        };

        checkSession();

        // Set up the onAuthStateChange listener
        const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
            if (event === "SIGNED_OUT") {
                alert("You have been signed out.");
                navigate("/");
            } else if (event === "SIGNED_IN") {
                alert("Signed in successfully.");
                navigate("/profile");
            }
        });

        // Cleanup the listener when the component unmounts
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [navigate]);

    return (
        <div className="login_auth">
            <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                theme="light"
                providers={["discord"]}
            />
        </div>
    );
}

export default LoginPage;
