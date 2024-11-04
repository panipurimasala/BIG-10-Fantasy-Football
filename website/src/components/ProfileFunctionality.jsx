import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import Profile from './Profile';
import LoginButton from './LoginButton';
function ProfileFunctionality() {
  const { authenticated, isAuthenticated } = useState(0);

  useEffect(() => {
    const fetchUser= async() =>{
      const { data: { user }} = await supabase.auth.getUser();
      if(user){
        isAuthenticated(1);
      }
    };
    fetchUser();
  },[]);
  return (
    <div>
      {authenticated ? <Profile /> : <LoginButton />}
    </div>
  );
}

export default ProfileFunctionality