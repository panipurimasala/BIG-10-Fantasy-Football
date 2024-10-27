import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function Profile() {
  const { user, logout } = useAuth0();

  return (
    <div>
      {/* <img src={user.picture} alt={user.name} /> */}
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => logout({ returnTo: window.location.origin })}>
        Log Out
      </button>
    </div>
  );
}

export default Profile