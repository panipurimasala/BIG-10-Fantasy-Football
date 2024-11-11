import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import Profile from './Profile';
import LoginButton from "./LoginButton";

const ProfileFunctionality = () => {
    const [session, setSession] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            const { user, err } = await supabase.auth.getSession();
            setSession(data & user);
            console.log(data);
        };
        getUser();
    }, []);
    return (
        <div>
            {session ? <Profile/> : <LoginButton />}
        </div>
    );
};

export default ProfileFunctionality;
