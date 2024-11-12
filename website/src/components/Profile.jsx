import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import supabase from "../supabaseClient";
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const [utilizer, setUser] = useState(null);
  const navigate = useNavigate();
  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };
  const logout = async() => {
    const { error } = await supabase.auth.signOut();
    if(error){
      alert(error);
    }
    else{
      navigate("/");
    }
  }
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      {/* Uncomment this if user has a picture */}
      {/* <img src={utilizer.picture} alt={utilizer.name} /> */}
      <div>
        {<button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>}
      </div>
    </div>
  );
}

export default Profile;
