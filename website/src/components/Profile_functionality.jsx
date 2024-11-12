// import React, { useState, useEffect } from 'react';
// import supabase from '../supabaseClient';
// import Profile from './Profile';
// import LoginButton from "./LoginButton";
// import { useNavigate } from "react-router-dom";
// const Profile_Functionality = () => {
//     const navigate = useNavigate();
//     const [session, setSession] = useState(null);

//     useEffect(() => {
//         const getUser = async () => {
//             const { data, error } = await supabase.auth.getUser();
//             const { user, err } = await supabase.auth.getSession();
//             setSession(data & user);
//             console.log(data);
//         };
//         getUser();
//     }, []);
//     const { dat } = supabase.auth.onAuthStateChange((event, session) => {
//         console.log(event, session)
      
//         if (event === 'INITIAL_SESSION') {
//           // handle initial session
//         } else if (event === 'SIGNED_IN') {
//           setSession(session)
//           navigate("/")
//         } else if (event === 'SIGNED_OUT') {
//           // handle sign out event
//         } else if (event === 'PASSWORD_RECOVERY') {
//           // handle password recovery event
//         } else if (event === 'TOKEN_REFRESHED') {
//             setSession(session)
//             navigate("/")
//         } else if (event === 'USER_UPDATED') {
//             setSession(session)
//             navigate("/")
//         }
//       })
//       if(session){
//         navigate("/")
//       }
//     return (
//         <div>
//             {session ? <Profile/> : <LoginButton />}
//         </div>
//     );
// };

// export default Profile_Functionality;
import React from 'react';
import Profile from './Profile';
import LoginButton from './LoginButton';
import { useAuth } from './AuthContext';

function Profile_Functionality() {
  const { authenticated } = useAuth();

  return (
    <div>
      {authenticated ? <Profile /> : <LoginButton />}
    </div>
  );
}

export default Profile_Functionality;
