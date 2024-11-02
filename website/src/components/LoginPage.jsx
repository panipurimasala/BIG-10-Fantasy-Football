import React, { useEffect } from "react";
import supabase from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import "./LoginPage.css";

const LoginPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                navigate("/profile");
            }
        };

        checkSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
            if (event === "SIGNED_OUT") {
                alert("You have been signed out.");
                navigate("/");
            } else if (event === "SIGNED_IN") {
                alert("Signed in successfully.");
                
                // Only attempt to insert user data after sign-in
                const { data, error } = await supabase.auth.getSession()
                if (data) {
                    const { data: { user } } = await supabase.auth.getUser()
                    const { error } = await supabase.from("Users").insert({
                        userid: user.id,
                        user_email: user.email
                    });
                    if (error) console.error("Error inserting user:", error.message);
                }

                navigate("/profile");
            }
        });

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
};

export default LoginPage;
