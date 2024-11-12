import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import Profile from './Profile';
import LoginButton from './LoginButton';
function ProfileFunctionality() {
  const { authenticated, isAuthenticated } = useState(0);

  useEffect(() => {
    const getUser = async () => {
        const { data, error } = await supabase.auth.getUser();
        const { user, err } = await supabase.auth.getSession();
        isAuthenticated(data & user);
    };
    getUser();
}, []);
  return (
    <div>
      {authenticated ? <Profile /> : <LoginButton />}
    </div>
  );
}

export default ProfileFunctionality