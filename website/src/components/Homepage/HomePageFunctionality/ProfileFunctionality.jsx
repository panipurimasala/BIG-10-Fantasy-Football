import React, { useEffect, useState } from 'react';
import supabase from '../../../supabaseClient';
import Profile from './Profile';
import LoginButton from './LoginButton';

function ProfileFunctionality() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    };
    getUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
    });

    // Cleanup listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      {authenticated ? <Profile /> : <LoginButton />}
    </div>
  );
}

export default ProfileFunctionality;
