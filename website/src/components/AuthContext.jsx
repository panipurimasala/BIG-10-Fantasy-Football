import React, { createContext, useState, useEffect } from "react";
import supabase from "../supabaseClient";
import { useNavigate } from "react-router-dom";

// Create context
export const AuthContext = createContext();

// AuthProvider component that will wrap your app and provide the auth state
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsLoggedIn(true);
                navigate("/profile");
            } else {
                setIsLoggedIn(false);
            }
        };

        checkSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
            if (event === "SIGNED_OUT") {
                setIsLoggedIn(false);
                navigate("/");
            } else if (event === "SIGNED_IN") {
                setIsLoggedIn(true);
                const { data, error } = await supabase.auth.getSession();
                if (data) {
                    const { data: { user } } = await supabase.auth.getUser();
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
        <AuthContext.Provider value={{ isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};