import { useAuth0 } from '@auth0/auth0-react';
import Profile from './Profile';
import LoginButton from "./LoginButton";
function Profile_functionality() {
  const { isAuthenticated, isLoading, user } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isAuthenticated ? <Profile /> : <LoginButton />}
    </div>
  );
}

export default Profile_functionality