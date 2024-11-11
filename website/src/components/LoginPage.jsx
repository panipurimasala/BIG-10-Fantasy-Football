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





// import React, { useState } from "react";
// import supabase from '../supabaseClient'; // Ensure the path is correct

// const LoginPage = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const handleSignUp = async (e) => {
//         e.preventDefault();
//         const { data, error } = await supabase.auth.signUp({
//             email,
//             password,
//         });

//         if (error) {
//             console.error("Error signing up:", error.message);
//             alert("Error signing up: " + error.message);
//         } else {
//             console.log("User signed up:", data);
//         }
//     };

//     return (
//         <div>
//             <form onSubmit={handleSignUp}>
//                 <label htmlFor="email">Email:</label><br/>
//                 <input
//                     type="email"
//                     id="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 /><br/>
                
//                 <label htmlFor="password">Password:</label><br/>
//                 <input
//                     type="password"
//                     id="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 /><br/>
                
//                 <input type="submit" value="Sign Up"/>
//             </form>
//         </div>
//     );
// };

// export default LoginPage;
